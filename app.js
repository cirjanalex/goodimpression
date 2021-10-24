import { CryptoAlgorithm } from './js/algorithm.js'

let cryptoAlgorithm = new CryptoAlgorithm();

setInterval(cryptoAlgorithm.runOnce, 10000);

//cryptoAlgorithm.runOnce();