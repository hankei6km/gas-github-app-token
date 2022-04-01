import { jest } from '@jest/globals'
import { generateFunc } from '../src/github-app-token.js'

const saveDateNow = Date.now
afterEach(() => {
  Date.now = saveDateNow
})

describe('generateFunc()', () => {
  it('should return token', () => {
    const utilitiesMock: any = {
      base64Encode: jest.fn().mockImplementation((a) => `base64Encode:${a}`),
      computeRsaSha256Signature: jest
        .fn()
        .mockImplementation((a) => `computeRsaSha256Signature:${a}`)
    }
    const fakeNow = 12345678
    Date.now = () => fakeNow
    const [url, opts] = generateFunc(utilitiesMock, {
      appId: 'app-id',
      installationId: 'installation-id',
      privateKey: 'private-key'
    })
    expect(url).toEqual(
      'https://api.github.com/app/installations/installation-id/access_tokens'
    )
    const p = `base64Encode:${JSON.stringify({
      alg: 'RS256',
      typ: 'JWT'
    })}.base64Encode:${JSON.stringify({
      exp: Math.floor(fakeNow / 1000) + 60,
      iat: Math.floor(fakeNow / 1000) - 10,
      iss: 'app-id'
    })}`
    const t = `${p}.base64Encode:${JSON.stringify(
      `computeRsaSha256Signature:${p}`
    )}`
    expect(opts).toEqual({
      method: 'post',
      headers: {
        Authorization: `Bearer ${t}`,
        Accept: 'application/vnd.github.machine-man-preview+json'
      }
    })
  })
  it('should use passed base url', () => {
    const utilitiesMock: any = {
      base64Encode: jest.fn().mockImplementation((a) => `base64Encode:${a}`),
      computeRsaSha256Signature: jest
        .fn()
        .mockImplementation((a) => `computeRsaSha256Signature:${a}`)
    }
    const [url] = generateFunc(utilitiesMock, {
      appId: 'app-id',
      installationId: 'installation-id',
      privateKey: 'private-key',
      apiBaseUrl: 'http://localhost:3000'
    })
    expect(url).toEqual(
      'http://localhost:3000/app/installations/installation-id/access_tokens'
    )
  })
})
