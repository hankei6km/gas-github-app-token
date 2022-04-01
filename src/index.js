/**
 * gas-github-app-token
 * @copyright (c) 2022 hankei6km
 * @license MIT
 * see "LICENSE.txt" "OPEN_SOURCE_LICENSES.txt" of "gas-github-app-token.zip" in
 * releases(https://github.com/hankei6km/gas-github-app-token/releases)
 */

'use strict'

/**
 * @typedef {GenerateOpts} - Options to generate function.
 * @property {string} appId - Application Id.
 * @property {string} installationId - installation Id.
 * @property {string} privateKey - Private key. PKCS#1(RSA key) is not supported.
 */

/**
 * Generate the token that is used to fetch an access token, and the API Url to fetch It.
 * @param {GenerateOpts} opts - Application Id, Installtion Id and other options to sign payload.
 * @returns API URL and fetch options.
 */
function generate(opts) {
  return _entry_point_.GitHubAppToken.generate(opts)
}
