import {expect} from './chai-setup';
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from 'hardhat';
import {LootXP} from '../typechain';
import {setupUser, setupUsers, waitFor} from './utils';
const setup = deployments.createFixture(async () => {
  await deployments.fixture(['LootXP']);
  const contracts = {
    LootXP: <LootXP>await ethers.getContract('LootXP'),
  };
  const {deployer: deployerAddress, lootXPOwner: lootXPOwnerAddress} =
    await getNamedAccounts();
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  const deployer = await setupUser(deployerAddress, contracts);
  const lootXPOwner = await setupUser(lootXPOwnerAddress, contracts);
  return {
    ...contracts,
    users,
    deployer,
    lootXPOwner,
  };
});

describe('YooLoot', function () {
  it('cannot add xp without approval', async function () {
    const {users, LootXP} = await setup();
    const tokenId = 1;
    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.addXP(tokenId, 1000);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter);
  });

  it('cannot remove xp without approval', async function () {
    const {users, LootXP, lootXPOwner} = await setup();

    // add xp to remove later
    await lootXPOwner.LootXP.setSource(users[0].address, true);
    const tokenId = 1;
    await users[0].LootXP.addXP(tokenId, 1000);
    await lootXPOwner.LootXP.setSource(users[0].address, false);
    // -----

    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.removeXP(tokenId, 1000);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter);
  });

  it('can add xp after approval', async function () {
    const {users, LootXP, lootXPOwner} = await setup();
    await lootXPOwner.LootXP.setSource(users[0].address, true);
    const tokenId = 1;
    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.addXP(tokenId, 1000);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter.sub(1000));
  });

  it('cannot add xp after approval for sink', async function () {
    const {users, LootXP, lootXPOwner} = await setup();
    await lootXPOwner.LootXP.setSink(users[0].address, true);
    const tokenId = 1;
    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.addXP(tokenId, 1000);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter);
  });

  it('can remove xp after approval', async function () {
    const {users, LootXP, lootXPOwner} = await setup();

    // add xp to remove later
    await lootXPOwner.LootXP.setSource(users[0].address, true);
    const tokenId = 1;
    await users[0].LootXP.addXP(tokenId, 1000);
    await lootXPOwner.LootXP.setSource(users[0].address, false);
    // -----

    await lootXPOwner.LootXP.setSink(users[0].address, true);
    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.removeXP(tokenId, 1000);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter.add(1000));
  });

  it('cannot remove xp after approval for source', async function () {
    const {users, LootXP, lootXPOwner} = await setup();
    await lootXPOwner.LootXP.setSource(users[0].address, true);
    const tokenId = 1;
    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.removeXP(1, 1000);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter);
  });

  it('cannot set source without approval', async function () {
    const {users, lootXPOwner} = await setup();
    await expect(
      users[0].LootXP.setSource(users[1].address, true)
    ).to.be.revertedWith('NOT_ALLOWED');
  });

  it('cannot set sink without approval', async function () {
    const {users, lootXPOwner} = await setup();
    await expect(
      users[0].LootXP.setSource(users[1].address, true)
    ).to.be.revertedWith('NOT_ALLOWED');
  });

  it('cannot set generator without being owner', async function () {
    const {users, lootXPOwner} = await setup();
    await expect(
      users[0].LootXP.setGenerator(users[1].address, true)
    ).to.be.revertedWith('NOT_ALLOWED');
  });

  it('cannot set generator without being owner, even if allowed to add xp', async function () {
    const {users, lootXPOwner} = await setup();
    await lootXPOwner.LootXP.setSource(users[0].address, true);
    await expect(
      users[0].LootXP.setGenerator(users[1].address, true)
    ).to.be.revertedWith('NOT_ALLOWED');
  });

  it('cannot set generator without being owner, even if allowed to remove xp', async function () {
    const {users, lootXPOwner} = await setup();
    await lootXPOwner.LootXP.setSink(users[0].address, true);
    await expect(
      users[0].LootXP.setGenerator(users[1].address, true)
    ).to.be.revertedWith('NOT_ALLOWED');
  });

  it('can set sink if generator', async function () {
    const {users, lootXPOwner, LootXP} = await setup();
    await lootXPOwner.LootXP.setGenerator(users[0].address, true);
    const tokenId = 1;
    const xpBefore = await LootXP.callStatic.xp(tokenId);
    await users[0].LootXP.addXP(users[1].address, 1);
    const xpAfter = await LootXP.callStatic.xp(tokenId);
    expect(xpBefore).to.equal(xpAfter);
  });
});
