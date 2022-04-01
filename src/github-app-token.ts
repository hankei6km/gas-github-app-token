export namespace GitHubAppToken {
  /**
   * Options to generate function.
   */
  export type GenerateOpts = {
    /**
     * @type Application Id.
     */
    appId: string
    /**
     * @type Installation Id.
     */
    installationId: string
    /**
     * @type Private key. PKCS#1(RSA key) is not supported.
     */
    privateKey: string
    /**
     * @type GitHub API Base URL(ie. `https://api.github.com`).
     */
    apiBaseUrl?: string
  }
  /**
   * Generate the token that is used to fetch an access token, and the API Url to fetch It.
   * @param opts - Application Id, Installtion Id and other options to sign payload.
   * @returns API URL and fetch options.
   */
  export function generate(opts: GenerateOpts): [string, any] {
    return generateFunc(Utilities, opts)
  }
}

/**
 * jwt の要素(?)用にエンコードする.
 * @param  Utilities - GAS の Utilities.
 * @param s - ソース.
 */
function encodeItem_(
  Utilities: GoogleAppsScript.Utilities.Utilities,
  s: Record<string, any> | any[]
) {
  if (Array.isArray(s)) {
    return Utilities.base64Encode(s)
  }
  return Utilities.base64Encode(JSON.stringify(s))
}

/**
 * リクエスト用の jwt を生成.
 * @param  Utilities - GAS の Utilities.
 * @param  appId - App Id.
 * @param  privateKey - private key(RSA key は扱えない).
 */
function jwtEncode(
  Utilities: GoogleAppsScript.Utilities.Utilities,
  appId: string,
  privateKey: string
) {
  const now = Date.now()
  const payload = {
    exp: Math.floor(now / 1000) + 60, // JWT expiration time
    // ちょっとだけ時間を手前にしておくとアクセストークンの発行に失敗し辛いらしい。
    // https://qiita.com/icoxfog417/items/fe411b94b8e7ae229e3e#github-apps%E3%81%AE%E8%AA%8D%E8%A8%BC
    iat: Math.floor(now / 1000) - 10, // Issued at time
    iss: appId
  }
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const src = `${encodeItem_(Utilities, header)}.${encodeItem_(
    Utilities,
    payload
  )}`
  const signed = Utilities.computeRsaSha256Signature(src, privateKey)
  return `${src}.${encodeItem_(Utilities, signed)}`
}

export function generateFunc(
  Utilities: GoogleAppsScript.Utilities.Utilities,
  opts: GitHubAppToken.GenerateOpts
): [string, any] {
  const api_url =
    typeof opts.apiBaseUrl === 'string' && opts.apiBaseUrl !== ''
      ? opts.apiBaseUrl
      : 'https://api.github.com'
  const path = `/app/installations/${opts.installationId}/access_tokens`
  const t = jwtEncode(Utilities, opts.appId, opts.privateKey)
  return [
    `${api_url}${path}`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${t}`,
        Accept: 'application/vnd.github.machine-man-preview+json'
      }
    }
  ]
}
