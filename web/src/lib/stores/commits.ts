import { writable } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';
import type { Deck } from './originalloot';

export type StoredAccountInfo = {
  commits: {deck: Deck, nonce: number, lootId: string}[];
}

const cache: Record<string, Writable<StoredAccountInfo>> = {};

export function commits(wallet: string, chainId: string, contract: string): Writable<StoredAccountInfo> {
  const id = `${wallet}:${chainId}:${contract}:`;
  let storeFromCache = cache[id];
  if (!storeFromCache) {
    storeFromCache = cache[id] = writable(id, {commits: []});
  }
  return storeFromCache;
}
