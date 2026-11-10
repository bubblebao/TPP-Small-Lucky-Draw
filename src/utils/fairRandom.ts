/**
 * Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
 * Guarantees zero predictability, zero manipulation, and uniform distribution across the remaining pool.
 */

export interface DrawAuditRecord {
  id: string;
  sequence: number;
  drawnNumber: number;
  remainingBefore: number;
  remainingAfter: number;
  timestamp: string;
  cryptoEntropy: string; // 8 hex chars from hardware entropy for audit verification
}

/**
 * Returns a cryptographically secure random integer between min (inclusive) and max (inclusive)
 */
export function getSecureRandomInt(min: number, max: number): { value: number; entropyHex: string } {
  if (min > max) throw new Error("min cannot be greater than max");
  const range = max - min + 1;
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  
  const rawValue = array[0];
  const entropyHex = rawValue.toString(16).padStart(8, '0').toUpperCase();
  
  // To avoid modulo bias, rejection sampling is used if range is not a power of 2
  const maxRange = Math.floor(0xFFFFFFFF / range) * range;
  if (rawValue >= maxRange) {
    // Retry recursively if in biased range (statistically rare)
    return getSecureRandomInt(min, max);
  }
  
  const value = min + (rawValue % range);
  return { value, entropyHex };
}

/**
 * Picks a random item from the pool array using CSPRNG
 */
export function drawFromPool(pool: number[]): { picked: number; index: number; entropyHex: string } {
  if (pool.length === 0) {
    throw new Error("Pool is empty");
  }
  
  const { value: index, entropyHex } = getSecureRandomInt(0, pool.length - 1);
  return {
    picked: pool[index],
    index,
    entropyHex
  };
}

