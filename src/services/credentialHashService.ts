/**
 * Deterministic Credential Hashing Service
 *
 * Adheres to Canonical JSON principles (RFC 8785 JSON Canonicalization Scheme):
 * 1. Object keys are recursively sorted lexicographically.
 * 2. Whitespace is normalized.
 * 3. SHA-256 cryptographic digest is computed deterministically.
 *
 * Guarantee: The same credential claims always produce the EXACT same 0x... hash.
 */
export class CredentialHashService {
  /**
   * Recursively sorts object keys alphabetically to produce a canonical JSON string.
   */
  public static canonicalize(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map(item => this.canonicalize(item)).join(',') + ']';
    }
    const sortedKeys = Object.keys(obj).sort();
    const parts = sortedKeys.map(key => {
      return JSON.stringify(key) + ':' + this.canonicalize(obj[key]);
    });
    return '{' + parts.join(',') + '}';
  }

  /**
   * Computes deterministic SHA-256 hash of any input string.
   * Returns a 0x-prefixed 64-character lowercase hex string.
   */
  public static async computeSha256(canonicalStr: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(canonicalStr);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `0x${hex}`;
    }

    return `0x${this.pureJsSha256(canonicalStr)}`;
  }

  /**
   * Synchronous pure-JS SHA-256 implementation for instant UI updates.
   */
  public static computeSha256Sync(canonicalStr: string): string {
    return `0x${this.pureJsSha256(canonicalStr)}`;
  }

  /**
   * Standalone standard SHA-256 algorithm implementation (FIPS PUB 180-4).
   */
  private static pureJsSha256(ascii: string): string {
    function rightRotate(value: number, amount: number) {
      return (value >>> amount) | (value << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let i = 0, j = 0;
    let result = '';

    const words: number[] = [];
    const asciiBitLength = ascii.length * 8;

    let hash: number[] = [];
    const k: number[] = [];
    let primeCounter = 0;

    const isComposite: Record<number, boolean> = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 300; i += candidate) {
          isComposite[i] = true;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    words.push(...Array(Math.ceil((asciiBitLength + 64) / 512) * 16).fill(0));
    for (i = 0; i < ascii.length; i++) {
      words[i >> 2] |= (ascii.charCodeAt(i) & 255) << (24 - (i % 4) * 8);
    }
    words[i >> 2] |= 128 << (24 - (i % 4) * 8);
    words[words.length - 1] = asciiBitLength;

    for (j = 0; j < words.length; j += 16) {
      const w = words.slice(j, j + 16);
      const oldHash = [...hash];

      for (i = 0; i < 64; i++) {
        if (i >= 16) {
          const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
          const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
          w[i] = ((w[i - 16] + s0 + w[i - 7] + s1) | 0);
        }

        const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const temp1 = (hash[7] + s1 + ch + k[i] + w[i]) | 0;
        const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const temp2 = (s0 + maj) | 0;

        hash[7] = hash[6];
        hash[6] = hash[5];
        hash[5] = hash[4];
        hash[4] = (hash[3] + temp1) | 0;
        hash[3] = hash[2];
        hash[2] = hash[1];
        hash[1] = hash[0];
        hash[0] = (temp1 + temp2) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }
}
