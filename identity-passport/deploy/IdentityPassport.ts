import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying IdentityPassport...");
  console.log("Deployer:", deployer);

  // Deploy the IdentityPassport contract
  const identityPassport = await deploy("IdentityPassport", {
    from: deployer,
    args: [hre.deployments.get('endpoint').then((d) => d.address), deployer], // [endpoint address, owner address]
    log: true,
    waitConfirmations: 1,
  });

  console.log("IdentityPassport deployed to:", identityPassport.address);
};

// Set the deployment tag
func.tags = ["IdentityPassport"];

export default func;