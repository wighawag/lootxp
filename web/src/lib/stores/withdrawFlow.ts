import {wallet, flow} from './wallet';
import {BaseStoreWithData} from '$lib/utils/stores';
import type { Deck } from './originalloot';
import { YooLootContract } from '$lib/config';

type Data = {
  lootId: string;
  deck?: Deck
};
export type WithdrawFlow = {
  step:
    | 'IDLE'
    | 'CONNECTING'
    | 'WAITING_FOR_SIGNATURE'
    | 'WAITING_TX'
    | 'SUCCESS';
  data?: Data;
};

class PurchaseFlowStore extends BaseStoreWithData<WithdrawFlow, Data> {
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


  async withdraw(lootId: string): Promise<void> {
    this.setPartial({step: 'CONNECTING'});
    flow.execute(async (contracts) => {
      this.setPartial({step: 'WAITING_TX'});
      await contracts[YooLootContract].withdrawAndGetXP(lootId);
      this.setPartial({step: 'SUCCESS'});
    });
  }



  private _reset() {
    this.setPartial({step: 'IDLE', data: undefined});
  }
}

export default new PurchaseFlowStore();
