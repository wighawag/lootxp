import {expect} from './chai-setup';
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from 'hardhat';
import {setupUser, setupUsers} from './utils';
import {Components} from '../typechain';
import {Wallet} from 'ethers';
import {isBytes} from 'ethers/lib/utils';

const setup = deployments.createFixture(async () => {
  const {deployer: deployerAddress} = await getNamedAccounts();

  await deployments.deploy('Components', {from: deployerAddress});
  const contracts = {
    Components: <Components>await ethers.getContract('Components'),
  };

  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  const deployer = await setupUser(deployerAddress, contracts);
  return {
    ...contracts,
    users,
    deployer,
  };
});

describe('Components', function () {
  it.skip('equal on any numbers', async function () {
    const {Components} = await setup();

    const tokenIds = [
      '1',
      '2',
      '3',
      '100',
      '7999',
      '8001',
      '0xFF672636363352778888f8f8f8e8a8a88c88e888',
      Wallet.createRandom().address,
      Wallet.createRandom().address,
      Wallet.createRandom().address,
    ];

    for (const tokenId of tokenIds) {
      const {loot, syntheticLoot} = await Components.test(tokenId);
      expect(loot).to.equals(syntheticLoot, `tokenId: ${tokenId} failed`);
    }
  });
});
