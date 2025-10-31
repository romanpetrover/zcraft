import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedGridSelection = await deploy("ZCraft", {
    from: deployer,
    log: true,
  });

  console.log(`ZCraft contract: `, deployedGridSelection.address);
};
export default func;
func.id = "deploy_ZCraft"; // id required to prevent reexecution
func.tags = ["ZCraft"];
