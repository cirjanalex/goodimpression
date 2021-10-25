import { CryptoAlgorithm } from './js/algorithm.js'

let cryptoAlgorithm = new CryptoAlgorithm();

let runIntervalInMS = process.env.RUN_INTERVAL
setInterval(cryptoAlgorithm.runOnce, runIntervalInMS);

