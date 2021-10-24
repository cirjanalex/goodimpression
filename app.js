import { CryptoAlgorithm } from './js/algorithm.js'

let cryptoAlgorithm = new CryptoAlgorithm();

setInterval(cryptoAlgorithm.runOnce, 1000);

//cryptoAlgorithm.runOnce();