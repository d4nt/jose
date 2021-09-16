import { decode as base64url } from '../runtime/base64url.js'
import asKeyObject from '../runtime/jwk_to_key.js'

import { JOSENotSupported } from '../util/errors.js'
import isObject from '../lib/is_object.js'
import type { JWK, KeyLike } from '../types.d'

/**
 * @deprecated use `jose/key/import`
 */
async function parseJwk(jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike> {
  if (!isObject(jwk)) {
    throw new TypeError('JWK must be an object')
  }

  alg ||= jwk.alg

  if (typeof alg !== 'string' || !alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present')
  }

  switch (jwk.kty) {
    case 'oct':
      if (typeof jwk.k !== 'string' || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value')
      }

      octAsKeyObject ??= jwk.ext !== true

      if (octAsKeyObject) {
        return asKeyObject({ ...jwk, alg, ext: false })
      }

      return base64url(jwk.k)
    case 'RSA':
      if (jwk.oth !== undefined) {
        throw new JOSENotSupported(
          'RSA JWK "oth" (Other Primes Info) Parameter value is not supported',
        )
      }
    case 'EC':
    case 'OKP':
      return asKeyObject({ ...jwk, alg })
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value')
  }
}

export { parseJwk }
export default parseJwk
export type { KeyLike, JWK }
