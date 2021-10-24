import { Api } from "./api.js";

var apiKey = process.env.API_KEY;
var api = new Api(apiKey || '61531a36ddf621d59e852734');

export class CryptoAlgorithm {
    async runOnce() {
        // Retrieves the current estimated value of a team together with the quantity of each symbol
        var account = await api.account();
        console.log(account);

        var nonUSDTCoinToSell = account.symbols.find(p => p.quantity > 0 && p.name != "USDT");
        if (nonUSDTCoinToSell !== undefined) {
            await api.order({ symbol: nonUSDTCoinToSell.name, side: 'SELL', quantity: nonUSDTCoinToSell.quantity });
        }
        else {
            var prices = await api.prices();
            prices = prices.filter(p => p.name !== "USDT");
            var rand = Math.floor(Math.random() * prices.length);
            var coinToBuy = prices[rand];
            var amountToBuy = account.symbols.find(s => s.name === "USDT").quantity / coinToBuy.value;
            await api.order({ symbol: coinToBuy.name, side: 'BUY', quantity: amountToBuy * 0.95 });
        }
    }
}