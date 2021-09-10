import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {constants} from 'ethers';
const {AddressZero} = constants;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy, execute, read} = hre.deployments;

  // const LootForEveryone = await hre.deployments.get('LootForEveryone');

  // const receipt = await execute(
  //   'YooLoot',
  //   {from: deployer, log: true},
  //   'clone',
  //   LootForEveryone.address,
  //   true,
  //   7 * 24 * 60 * 60
  // );
  // console.log({gasUsed: receipt.gasUsed});

  // console.log(receipt.events);
};
export default func;
func.tags = ['YooLoot_lfe'];
func.dependencies = ['Loot', 'LootForEveryone', 'YooLoot'];
