import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {constants} from 'ethers';
const {AddressZero} = constants;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy, execute, read, log} = hre.deployments;

  const Loot = await hre.deployments.get('Loot');

  const MLoot = await hre.deployments.get('MLoot');
  const LootForEveryone = await hre.deployments.getOrNull('LootForEveryone');

  const LootXPRegistry = await hre.deployments.get('LootXPRegistry');

  if (hre.network.name === 'mainnet') {
    if (!MLoot || !LootForEveryone) {
      throw new Error(`need MLoot and LootForEveryone`);
    }
  }

  const YooLoot = await deploy('YooLoot', {
    from: deployer,
    args: [
      LootXPRegistry.address,
      [
        Loot.address,
        MLoot?.address || AddressZero,
        LootForEveryone?.address || AddressZero,
      ],
      Loot.address,
      true,
      7 * 24 * 60 * 60,
    ],
    proxy:
      hre.network.name !== 'mainnet'
        ? {
            execute: {
              init: {
                methodName: 'freeFormInit',
                args: [Loot.address, true, 7 * 24 * 60 * 60],
              },
            },
          }
        : undefined,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const isSource = await read('LootXPRegistry', 'xpSource', YooLoot.address);
  if (!isSource) {
    const receipt = await execute(
      'LootXPRegistry',
      {from: deployer, log: true},
      'setSource',
      YooLoot.address,
      true
    );
    log({gasUsed: receipt.gasUsed.toString()});
  }

  // TODO decide
  const isGenerator = await read(
    'LootXPRegistry',
    'xpSourceAndSyncGenerator',
    YooLoot.address
  );
  if (!isGenerator) {
    const receipt = await execute(
      'LootXPRegistry',
      {from: deployer, log: true},
      'setGenerator',
      YooLoot.address,
      true
    );
    log({gasUsed: receipt.gasUsed.toString()});
  }
};
export default func;
func.tags = ['YooLoot'];
func.dependencies = ['Loot', 'LootXPRegistry'];
