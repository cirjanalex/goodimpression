import { HackathonApi } from "./hackathonapi";
import { AccountSymbol } from "./models/account";
import { Order } from "./models/orderHistory";
import { SymbolHistory } from "./models/symbolHistory";
import { Symbols } from "./models/symbols";
declare type SymbolString = keyof typeof Symbols;
export class CryptoAlgorithm {
    hackathonApi: HackathonApi;
    sellLimitLowPercent: number;
    sellLimitHighPercent: number;
    buyLimitAverage: number;
    buyLimitMax: number;
    enableTrailingStop: boolean;
    trailingStopPercentBackStep: number;

    previousTrailingStopPercent: number | null;

    constructor(hackathonApi: HackathonApi, sellLimitLowPercent: number, sellLimitHighPercent: number, buyLimitAverage: number, buyLimitMax: number, trailingStopPercentBackStep: number, enableTrailingStop: boolean) {
        this.hackathonApi = hackathonApi;
        this.sellLimitHighPercent = sellLimitHighPercent;
        this.sellLimitLowPercent = sellLimitLowPercent;
        this.buyLimitAverage = buyLimitAverage;
        this.buyLimitMax = buyLimitMax;
        this.trailingStopPercentBackStep = trailingStopPercentBackStep;
        this.enableTrailingStop = enableTrailingStop;
        this.previousTrailingStopPercent = null;
    }

    private async getLatestOrder(): Promise<Order | null> {
        var orders = await this.hackathonApi.orderHistory();
        var sortedValues = orders.sort((a: Order, b: Order) => {
            if (a.date > b.date) return -1;
            else return 1;
        });
        if (sortedValues.length > 0) {
            return sortedValues[0];
        }
        return null;
    }


    private async getSymbolToBuy(): Promise<string | null> {
        var results = new Array<{ average: number, max: number, current: number, currentVsPreviousAverage: number, currentVsPreviousMax: number, symbol: string }>();
        for (const symbol in Symbols) {
            if (isNaN(Number(symbol))) {
                var history = await this.hackathonApi.symbolHistory({ symbol: symbol, interval: '1m' });
                var sortedHistory = history.sort((his1: SymbolHistory, his2: SymbolHistory) => {
                    if (his1 < his2) return 1
                    else return -1;
                });

                var currentValue = sortedHistory[0];
                let sum = 0;
                let max = 0;
                for (var i = 30; i < 90; i++) {
                    sum += sortedHistory[i].open;
                    max = Math.max(sortedHistory[i].high, max);
                }

                let average = sum / 60;
                results.push({
                    average: average,
                    max: max,
                    current: currentValue.open,
                    currentVsPreviousAverage: ((currentValue.open - average) / average) * 100,
                    currentVsPreviousMax: ((currentValue.open - max) / max) * 100,
                    symbol: symbol
                });
            }
        }
        console.log(results);
        let average = 0;
        let maxAverage = 0;
        results.forEach(result => {
            average += result.currentVsPreviousAverage;
            maxAverage += result.currentVsPreviousMax;
        });
        average = average / results.length;
        maxAverage = maxAverage / results.length;
        console.log(`Global averages avg: ${average} maxAvg:${maxAverage}`);
        var priorityList = results.sort((r1, r2) => {
            let localAvg = Math.abs(average);
            if (Math.abs(localAvg - Math.abs(r1.currentVsPreviousAverage)) < Math.abs(localAvg - Math.abs(r2.currentVsPreviousAverage))) return -1;
            else return 1;
        });
        for (let i = 0; i < priorityList.length; i++) {
            let elem = priorityList[i];
            console.log('avg' + elem.currentVsPreviousAverage);
            if (elem.currentVsPreviousAverage < this.buyLimitAverage && elem.currentVsPreviousMax < this.buyLimitMax) {
                return elem.symbol;
            }
        }
        return null;
    }

    private async processBuyStrategy() {
        let symbolToBuy = await this.getSymbolToBuy();
        if (symbolToBuy !== null) {
            console.log(`Found a symbol to buy, it's ${symbolToBuy}`);
            var account = await this.hackathonApi.account();
            var price = await (await this.hackathonApi.price({ symbol: symbolToBuy })).value;
            var amountOfUSDTAvailable = account.symbols.find((s) => {
                return s.name === "USDT";
            });
            var amountToBuy = (amountOfUSDTAvailable!.quantity * 0.9) / price;
            console.log(`Trying to buy ${amountToBuy} of ${symbolToBuy}`);
            var buyResult = await this.hackathonApi.buy(Symbols[symbolToBuy as SymbolString], amountToBuy);
            console.log(`Buying was ${buyResult ? "successfull" : "unsuccessfull"}`);
        }
    }
    private processTrailingStop(currentPercentage: number): boolean {
        if (this.previousTrailingStopPercent === null) {
            this.previousTrailingStopPercent = currentPercentage;
        }        

        if (currentPercentage - this.previousTrailingStopPercent < - this.trailingStopPercentBackStep) {
            this.previousTrailingStopPercent = null;
            return true;
        }
        else {
            if(currentPercentage > this.previousTrailingStopPercent) {
                this.trailingStopPercentBackStep = currentPercentage;
            }
            return false;
        }
    }

    private async processSellStrategy(latestOrder: Order) {
        var dateNow = new Date();
        var dateNowUtcInMinutes = dateNow.getTime() / 60000;// + dateNow.getTimezoneOffset();
        var minutesSinceTheBuyOrder = dateNowUtcInMinutes - latestOrder.date.getTime() / 60000;
        console.log(`${minutesSinceTheBuyOrder / 60} hours passed since the buy was made, waiting a minimum of 6 hours`);
        if (minutesSinceTheBuyOrder > 360) {
            console.log("Selling because of timeout");
            var sellResult = await this.hackathonApi.sell(latestOrder.symbol, latestOrder.quantity);
            console.log(`Selling result was ${sellResult ? 'successfull' : 'unsuccessfull'}`);
        }

        var currentPrice = (await this.hackathonApi.price({ symbol: Symbols[latestOrder.symbol] })).value;
        var openPrice = latestOrder.price;
        var diffPrice = currentPrice - openPrice;
        var currentPercentage = (diffPrice / openPrice) * 100;
        console.log(`Current percentage is ${currentPercentage}, limits are: low ${this.sellLimitLowPercent} and high ${this.sellLimitHighPercent}`);
        if (currentPercentage < this.sellLimitLowPercent || currentPercentage > this.sellLimitHighPercent) {

            let shouldSell = true;
            if (currentPercentage > this.sellLimitHighPercent && this.enableTrailingStop) {
                shouldSell = this.processTrailingStop(currentPercentage);
                console.log(`Trailing stop result: ${shouldSell ? 'SELL' : 'WAIT'}}`);
            }
            if (shouldSell) {
                console.log("Selling because of limit reached");
                var sellResult = await this.hackathonApi.sell(latestOrder.symbol, latestOrder.quantity);
                console.log(`Selling result was ${sellResult ? 'successfull' : 'unsuccessfull'}`);
            }
        }
    }

    async runOnce() {
        var latestOrder = await this.getLatestOrder();
        if (latestOrder != null && latestOrder.side == 'BUY') {
            await this.processSellStrategy(latestOrder);
        }
        else {
            await this.processBuyStrategy();
        }
    }
}