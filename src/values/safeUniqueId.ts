/** 
 * @fileName safeUniqueId
 * @type {uint32} (two's complement) max
 * @note more conservative than Number.MAX_SAFE_INTEGER
 * @export SAFE_MAX
 */

export const SAFE_MAX = 4_294_967_295;

const MAX = Number.MAX_SAFE_INTEGER;
let idCounter = Math.floor(Math.random() * MAX);

/**
 *
 * @function getUniqueId
 * @summary Gets an ID that is guaranteed to be unique so long as no more than
 * 4_294_967_295 (uint32 max) IDs are created, or the IDs are rapidly turned over.
 *
 * @returns The unique ID.
 */

export function getUniqueId(): number {
  idCounter = (idCounter + 1) % SAFE_MAX;
  return idCounter;
};
