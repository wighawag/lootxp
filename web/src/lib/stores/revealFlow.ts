import {wallet, flow} from './wallet';
import {BaseStoreWithData} from '$lib/utils/stores';
import {keccak256} from '@ethersproject/solidity';
import type { Deck } from './originalloot';
import { YooLootContract } from '$lib/config';

type Data = {
  lootId: string;
  deck: Deck
  nonce: number;
};
export type RevealFlow = {
  step:
  | 'IDLE'
  | 'CONNECTING'
  | 'GETTING_DATA'
  | 'NO_DECK_FOR_LOOT'
  | 'ALREADY_RESOLVED'
  | 'WAITING_FOR_SIGNATURE'
  | 'CREATING_TX'
  | 'WAITING_TX'
  | 'WAITING_FOR_ACKNOWLEDGMENT'
  | 'SUCCESS';
  data?: Data;
};

class PurchaseFlowStore extends BaseStoreWithData<RevealFlow, Data> {
  public constructor() {
    super({
      step: 'IDLE',
    });
  }

  async cancel(): Promise<void> {
    this._reset();
  }

  async acknownledgeSuccess(): Promise<void> {
    // TODO automatic ?
    this._reset();
  }


  async revealLootDeck(lootId: string, deck: Deck, nonce: number): Promise<void> {
    this.setPartial({step: 'CONNECTING'});
    this.setData({lootId, deck, nonce})
    flow.execute(async (contracts) => {
      this.setPartial({step: 'GETTING_DATA'});
      const deckHash = await contracts[YooLootContract].getDeckHash(lootId);
      if (deckHash === '0x0000000000000000000000000000000000000000000000000000000000000001') {
        this.setPartial({step: 'ALREADY_RESOLVED'});
        return;
      } else if (deckHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        this.setPartial({step: 'NO_DECK_FOR_LOOT'});
        return;
      }
      this.setPartial({step: 'WAITING_FOR_SIGNATURE'});
      const signature = await wallet.provider
      .getSigner()
      .signMessage(`Generate Yoolot Secret number : ${nonce}`);
      const secret = signature.slice(0, 66);

      this.setPartial({step: 'WAITING_TX'});
      await contracts[YooLootContract].revealLootDeck(lootId, deck, secret);
      this.setPartial({step: 'WAITING_FOR_ACKNOWLEDGMENT'});
    });
  }



  private _reset() {
    this.setPartial({step: 'IDLE', data: undefined});
  }
}

export default new PurchaseFlowStore();
