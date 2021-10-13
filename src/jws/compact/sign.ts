import { FlattenedSign } from '../flattened/sign.js'
import type { JWSHeaderParameters, KeyLike, SignOptions } from '../../types.d'

/**
 * The CompactSign class is a utility for creating Compact JWS strings.
 *
 * @example Usage
 * ```js
 * const encoder = new TextEncoder()
 *
 * const jws = await new CompactSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
 *   .setProtectedHeader({ alg: 'ES256' })
 *   .sign(privateKey)
 *
 * console.log(jws)
 * ```
 *
 * @example ESM import
 * ```js
 * import { CompactSign } from 'jose'
 * ```
 *
 * @example CJS import
 * ```js
 * const { CompactSign } = require('jose')
 * ```
 *
 * @example Deno import
 * ```js
 * import { CompactSign } from 'https://deno.land/x/jose@VERSION/index.ts'
 * ```
 */
export class CompactSign {
  private _flattened: FlattenedSign

  /**
   * @param payload Binary representation of the payload to sign.
   */
  constructor(payload: Uint8Array) {
    this._flattened = new FlattenedSign(payload)
  }

  /**
   * Sets the JWS Protected Header on the Sign object.
   *
   * @param protectedHeader JWS Protected Header.
   */
  setProtectedHeader(protectedHeader: JWSHeaderParameters) {
    this._flattened.setProtectedHeader(protectedHeader)
    return this
  }

  /**
   * Signs and resolves the value of the Compact JWS string.
   *
   * @param key Private Key or Secret to sign the JWS with.
   * @param options JWS Sign options.
   */
  async sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string> {
    const jws = await this._flattened.sign(key, options)

    if (jws.payload === undefined) {
      throw new TypeError('use the flattened module for creating JWS with b64: false')
    }

    return `${jws.protected}.${jws.payload}.${jws.signature}`
  }
}
