import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { EndpointId } from '@layerzerolabs/lz-definitions';

// LayerZero V2 Endpoint addresses with correct checksum
const ENDPOINTS = {
  [EndpointId.SEPOLIA_V2_TESTNET]: '0x0D7e906BD9cAFc86c967d8b82B7cC90C5114D57A', // Ethereum Sepolia - note the uppercase 'A' at the end
  [EndpointId.BASESEP_V2_TESTNET]: '0x6EDCE65403992e310A62460808c4b910D972f10f', // Base Sepolia
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying IdentityPassport...");
  console.log("Deployer:", deployer);
  
  // Get network EID from the network configuration
  const eid = network.config.eid;
  if (!eid) {
    throw new Error(`No EID configured for network: ${network.name}`);
  }
  
  // Get the appropriate endpoint address for this network
  const endpointAddress = ENDPOINTS[eid];
  if (!endpointAddress) {
    throw new Error(`No endpoint address configured for EID: ${eid}`);
  }
  
  console.log(`Using LayerZero Endpoint address: ${endpointAddress} for network: ${network.name}`);

  // Deploy the IdentityPassport contract
  const identityPassport = await deploy("IdentityPassport", {
    from: deployer,
    args: [endpointAddress, deployer], // [endpoint address, owner address]
    log: true,
    waitConfirmations: 1,
  });

  console.log("IdentityPassport deployed to:", identityPassport.address);
};

// Set the deployment tag
func.tags = ["IdentityPassport"];

export default func;