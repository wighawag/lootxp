import {wallet, flow, chain} from './wallet';
import {BaseStore} from '$lib/utils/stores';
import type { ChainStore, WalletStore } from 'web3w';
import { now } from './time';
import { YooLootContract } from '$lib/config';

const week = 7 * 24 * 60 * 60;

export type GameState = {
  phase: 'IDLE' | 'LOADING' | 'COMMIT' | 'REVEAL' | 'WINNER' | 'WITHDRAW';
  startTime?: number;
  timeLeftBeforeNextPhase?: number;
  winner?: string;
};

class GameStateStore extends BaseStore<GameState> {

  private timeout: NodeJS.Timeout | undefined;

  public constructor() {
    super({
      phase: 'IDLE'
    });
    wallet.subscribe(this.onWallet.bind(this));
    chain.subscribe(this.onChain.bind(this));
  }

  onWallet($wallet: WalletStore) {
    if (wallet.provider && wallet.contracts) {
      this.start()
    } else {
      this.stop();
    }
  }

  onChain($chain: ChainStore) {
    if (wallet.provider && wallet.contracts) {
      this.start()
    } else {
      this.stop();
    }
  }

  start() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.update();
  }

  async update() {
    if (!this.$store.startTime && wallet.provider) {

      const params = await wallet.contracts[YooLootContract].getParams();
      const {startTime} = params;
      this.setPartial({startTime});
    }

    const currentTime = now();
    const timePassed = currentTime - this.$store.startTime;
    if (timePassed > 3 * week) {
      this.setPartial({timeLeftBeforeNextPhase: 0, phase: 'WITHDRAW'})
      if (!this.$store.winner) {
        const winnerInfo = await wallet.contracts[YooLootContract].winner();
        this.setPartial({winner: winnerInfo.winnerAddress});
      }
    } else if (timePassed > 2 * week) {
      this.setPartial({timeLeftBeforeNextPhase: 3 * week - timePassed, phase: 'WINNER'});
      if (!this.$store.winner) {
        const winnerInfo = await wallet.contracts[YooLootContract].winner();
        this.setPartial({winner: winnerInfo.winnerAddress});
      }
    } else if (timePassed > 1 * week) {
      this.setPartial({timeLeftBeforeNextPhase: 2 * week - timePassed, phase: 'REVEAL'})
    } else {
      this.setPartial({timeLeftBeforeNextPhase: 1 * week - timePassed, phase: 'COMMIT'})
    }


    this.timeout = setTimeout(this.update.bind(this), 1000);
  }

  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.setPartial({phase: 'IDLE'});
  }


}

const gameState = new GameStateStore();

export default gameState;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as unknown as any).gameState = gameState;
}
