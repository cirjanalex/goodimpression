import { CryptoAlgorithm } from './js/algorithm'
import { HackathonApi } from './js/hackathonapi';
import { Symbols } from './js/models/symbols';

declare var process : {
  env: {
    API_KEY: string,
    API_URL: string,
    RUN_INTERVAL: number,
    PRC_LOW: number,
    PRC_HIGH:number
  }
}
let apiKey = process.env.API_KEY;
let apiUrl = process.env.API_URL;
let runIntervalInMS = process.env.RUN_INTERVAL;
let sellLimitLowPercent = process.env.PRC_LOW || -1;
let sellLimitHighPercent = process.env.PRC_HIGH || 0.3;

var hackathonApi = new HackathonApi(apiKey, apiUrl);
let cryptoAlgorithm = new CryptoAlgorithm(hackathonApi, sellLimitLowPercent, sellLimitHighPercent);

let program = async function () {
  //var btcHistory = await hackathonApi.symbolHistory({ symbol: 'BTC', interval: '1M' })
  //console.trace(btcHistory);
  //var btcPrice = await api.price({symbol:'BTC'});
  //console.log(btcPrice);
  //var prices = await api.prices();
  //console.log(prices);
  //var account = await api.account();
  //console.log(account);
  //var orderHistory = await hackathonApi.orderHistory();
  //console.log(orderHistory);
  cryptoAlgorithm.runOnce();
}
//program();
setInterval(cryptoAlgorithm.runOnce, runIntervalInMS);
