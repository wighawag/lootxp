import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {constants} from 'ethers';
import {deployments} from 'hardhat';
const {AddressZero} = constants;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployer} = await hre.getNamedAccounts();
  const {deploy, execute, read} = hre.deployments;

  const YooLoot = await hre.deployments.get('YooLoot');
  const MLoot = await hre.deployments.get('MLoot');

  const receipt = await execute(
    'YooLoot',
    {from: deployer, log: true},
    'clone',
    MLoot.address,
    true,
    7 * 24 * 60 * 60
  );

  if (receipt.events) {
    const {
      loot,
      winnerGetLoot,
      periodLength,
      newYooLoot,
      authorizedAsXPSource,
    }: {
      loot: string;
      winnerGetLoot: boolean;
      periodLength: number;
      newYooLoot: string;
      authorizedAsXPSource: boolean;
    } = receipt.events[1].args;

    deployments.save('YooLoot_mloot', {
      address: newYooLoot,
      abi: YooLoot.abi,
    });
  }
};
export default func;
func.tags = ['YooLoot_mloot'];
func.dependencies = ['Loot', 'MLoot', 'YooLoot'];
