import { CryptoAlgorithm } from './js/algorithm'
import { HackathonApi } from './js/hackathonapi';
import { Symbols } from './js/models/symbols';

declare var process: {
  env: {
    API_KEY: string,
    API_URL: string,
    RUN_INTERVAL: number,
    PRC_LOW: number,
    PRC_HIGH: number
  }
}
let apiKey = process.env.API_KEY || '61851f8bc2eb836d86faae81';
let apiUrl = process.env.API_URL || 'https://crypto-bot-challenge-api.herokuapp.com/api';
let runIntervalInMS = process.env.RUN_INTERVAL || 60000;
let sellLimitLowPercent = process.env.PRC_LOW || -1;
let sellLimitHighPercent = process.env.PRC_HIGH || 0.3;

var hackathonApi = new HackathonApi(apiKey, apiUrl);
let cryptoAlgorithm = new CryptoAlgorithm(hackathonApi, sellLimitLowPercent, sellLimitHighPercent);
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let program = async function () {
  while (true) {
    await cryptoAlgorithm.runOnce();
    await sleep(60000);
  }
}
program();
