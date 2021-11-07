import { CryptoAlgorithm } from './js/algorithm'
import { HackathonApi } from './js/hackathonapi';
import { Symbols } from './js/models/symbols';

declare var process: {
  env: {
    API_KEY: string,
    API_URL: string,
    RUN_INTERVAL: number,
    // Value under which to close the position ( sell loss )
    PRC_LOW: number,
    // Value over which to close the position ( sell profit )
    PRC_HIGH: number,
    // Value under which to open a position
    BUY_PRC_AVG: number,
    // Value under which to open a position ( the above must be true as well )
    BUY_PRC_MAX_AVG: number,
    // The percentual value over which when the current percentage minus the previous percent goes over the position is closed
    SELL_TRL_STOP_PRC_BACK_STEP: number;
    ENABLE_TRAILING_STOP: boolean;
  }
}
let apiKey = process.env.API_KEY || '61851f8bc2eb836d86faae81';
let apiUrl = process.env.API_URL || 'https://crypto-bot-challenge-api.herokuapp.com/api';
let runIntervalInMS = process.env.RUN_INTERVAL || 60000;
let sellLimitLowPercent = process.env.PRC_LOW || -1;
let sellLimitHighPercent = process.env.PRC_HIGH || 0.3;
let buyLimitAverage = process.env.BUY_PRC_AVG || -0.25;
let buyLimitMaxAverage = process.env.BUY_PRC_MAX_AVG || -0.75;
let trailingStopPercentBackStep = process.env.SELL_TRL_STOP_PRC_BACK_STEP || 0.1;
let enableTrailingStop = process.env.ENABLE_TRAILING_STOP || true;

var hackathonApi = new HackathonApi(apiKey, apiUrl);
let cryptoAlgorithm = new CryptoAlgorithm(hackathonApi, sellLimitLowPercent, sellLimitHighPercent, buyLimitAverage, buyLimitMaxAverage, trailingStopPercentBackStep, enableTrailingStop);
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let program = async function () {
  while (true) {
    await cryptoAlgorithm.runOnce();
    await sleep(runIntervalInMS);
  }
}
program();
