const crypto = require('crypto');

class TokenPassportSignature {
	constructor() {
    /**
     * The value of the TokenPassportSignature
     * @type {String}
     */
    this.value = '';

    /**
     * The algorithm used to hash the value
     * Supported options - HMAC-SHA1 and HMAC-SHA256
     * @type {String}
     */
    this.algorithm = '';
  }

  /**
   * Create a key to be used to generate a signature
   * @param  {String} consumerSecret
   * @param  {String} tokenSecret
   * @return {String}
   */
  static createKey(consumerSecret, tokenSecret) {
    return encodeURI(`${consumerSecret}&${tokenSecret}`);
  }

  /**
   * Create the SHA Hash from the base string, key, and algorithm.
   * @param  {String} baseString - The base string from the TokenPassport
   * @param  {String} key - The key created from TokenPassportSignature.createKey
   * @return {void}
   */
  createAndSetSignature(baseString, key) {
    if (!isAlgorithmSupported(this.algorithm)) {
      throw new Error(HASHING_ALGORITHM_NOT_SUPPORTED);
    }

    if (!baseString) {
      throw new Error(BASE_STRING_NOT_FOUND);
    }

    if (!key) {
      throw new Error(KEY_NOT_FOUND);
    }

    const algo = sanitizeHashingAlgorithm(this.algorithm);
    const hash = crypto.createHmac(algo, key).update(baseString, 'utf8').digest('base64');
    this.value = hash;
  }
}

const SUPPORTED_ALGORITHMS = [
  'HMAC-SHA256',
  'HMACSHA256',
  'SHA256',
  'HMAC-SHA1',
  'HMACSHA1',
  'SHA1'
];

const HASHING_ALGORITHM_NOT_SUPPORTED = 'Hashing algorithm is not supported. Supported algorithms include SHA1 and SHA256';
const KEY_NOT_FOUND = 'A hashing key is required. Generate a key with TokenPassportSignature.createKey(consumerSecret, tokenSecret);';
const BASE_STRING_NOT_FOUND = 'A base string is required.';

/**
 * Check if the algorithm is supported
 * @param  {String}  algo Algorithm Name
 * @return {Boolean}
 */
function isAlgorithmSupported(algo) {
  if (!algo)
    return false;
  
  return SUPPORTED_ALGORITHMS.indexOf(algo.toUpperCase()) > -1;
  }

/**
 * Sanitize the hashing algorithm string
 * @param  {String} algo 
 * @return {String} 
 */
function sanitizeHashingAlgorithm(algo) {
  let hashingAlgo;
  const uppedAlgoStr = algo.toUpperCase();
  if (uppedAlgoStr.indexOf('SHA256') > -1) {
    hashingAlgo = 'sha256';
  } else {
    hashingAlgo = 'sha1';
  }

  return hashingAlgo;
}

module.exports = TokenPassportSignature;
