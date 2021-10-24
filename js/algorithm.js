import { Api } from "./api.js";

var apiKey = process.env.API_KEY;
var api = new Api(apiKey);

export class CryptoAlgorithm {
    async runOnce() {
        
        var account = await api.account();
        console.log(account);
        // Find a coin which is not USD
        var nonUSDTCoinToSell = account.symbols.find(p => p.quantity > 0 && p.name != "USDT");
        // If we find one we sell it
        if (nonUSDTCoinToSell !== undefined) {        
            await api.order({ symbol: nonUSDTCoinToSell.name, side: 'SELL', quantity: nonUSDTCoinToSell.quantity });
        }
        // If we don't we buy one
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