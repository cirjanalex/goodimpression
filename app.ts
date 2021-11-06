import { CryptoAlgorithm } from './js/algorithm'
import { Api } from './js/api';

declare var process : {
  env: {
    API_KEY: string,
    API_URL: string,
    RUN_INTERVAL: number
  }
}
var apiKey = process.env.API_KEY;
let apiUrl = process.env.API_URL;
let runIntervalInMS = process.env.RUN_INTERVAL;


var api = new Api(apiKey, apiUrl);
let cryptoAlgorithm = new CryptoAlgorithm(api);

let program = async function () {
  //var btcHistory = await api.symbolHistory({ symbol: 'BTC', interval: '1M' })
  //console.trace(btcHistory);
  //var btcPrice = await api.price({symbol:'BTC'});
  //console.log(btcPrice);
  //var prices = await api.prices();
  //console.log(prices);
  //var account = await api.account();
  //console.log(account);
  //var orderHistory = await api.orderHistory();
  //console.log(orderHistory);
}
program();
//setInterval(cryptoAlgorithm.runOnce, runIntervalInMS);
