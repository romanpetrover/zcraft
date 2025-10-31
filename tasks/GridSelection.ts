import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const CONTRACT_NAME = "EncryptedGridSelection";

task("task:address", "Prints the EncryptedGridSelection address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;
  const contract = await deployments.get(CONTRACT_NAME);
  console.log(`${CONTRACT_NAME} address is ${contract.address}`);
});

const MIN_CELL_ID = 1;
const MAX_CELL_ID = 16;

function parseCellsArgument(cellsArgument: string): number {
  const cells = cellsArgument
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (cells.length === 0) {
    throw new Error("Provide at least one cell id");
  }

  let bitmask = 0;
  for (const entry of cells) {
    const id = Number(entry);
    if (!Number.isInteger(id)) {
      throw new Error(`Cell id "${entry}" is not an integer`);
    }
    if (id < MIN_CELL_ID || id > MAX_CELL_ID) {
      throw new Error(`Cell id "${id}" must be between ${MIN_CELL_ID} and ${MAX_CELL_ID}`);
    }

    const position = id - 1;
    const flag = 1 << position;
    if ((bitmask & flag) !== 0) {
      throw new Error(`Cell id "${id}" is duplicated`);
    }
    bitmask |= flag;
  }
  return bitmask;
}

task("task:save-selection", "Saves an encrypted grid selection")
  .addOptionalParam("address", "Optionally specify the EncryptedGridSelection contract address")
  .addParam("cells", "Comma separated list of cell ids (1-16)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { deployments, ethers, fhevm } = hre;

    const bitmask = parseCellsArgument(taskArguments.cells);

    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address ? { address: taskArguments.address } : await deployments.get(CONTRACT_NAME);
    console.log(`${CONTRACT_NAME}: ${deployment.address}`);

    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt(CONTRACT_NAME, deployment.address);

    const encryptedInput = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add16(bitmask)
      .encrypt();

    const tx = await contract.connect(signer).saveSelection(encryptedInput.handles[0], encryptedInput.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);
    console.log(`Saved selection for ${signer.address} with bitmask ${bitmask}`);
  });

task("task:decrypt-selection", "Decrypts the stored selection for the active signer or provided address")
  .addOptionalParam("address", "Optionally specify the EncryptedGridSelection contract address")
  .addOptionalParam("user", "Optionally specify the target user address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { deployments, ethers, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const deployment = taskArguments.address ? { address: taskArguments.address } : await deployments.get(CONTRACT_NAME);
    console.log(`${CONTRACT_NAME}: ${deployment.address}`);

    const signers = await ethers.getSigners();
    const activeSigner = signers[0];
    const targetAddress = taskArguments.user ?? activeSigner.address;

    const contract = await ethers.getContractAt(CONTRACT_NAME, deployment.address);
    const hasSelection = await contract.hasSelection(targetAddress);
    if (!hasSelection) {
      console.log(`No selection stored for ${targetAddress}`);
      return;
    }

    const encryptedSelection = await contract.getSelection(targetAddress);
    if (encryptedSelection === ethers.ZeroHash) {
      console.log(`Stored selection for ${targetAddress} is empty`);
      return;
    }

    const clearValue = await fhevm.userDecryptEuint(
      FhevmType.euint16,
      encryptedSelection,
      deployment.address,
      activeSigner,
    );

    const selectedCells: number[] = [];
    for (let id = MIN_CELL_ID; id <= MAX_CELL_ID; id += 1) {
      const mask = 1 << (id - 1);
      if ((clearValue & mask) !== 0) {
        selectedCells.push(id);
      }
    }

    console.log(`Encrypted selection: ${encryptedSelection}`);
    console.log(`Clear value: ${clearValue}`);
    console.log(`Selected cells: ${selectedCells.join(", ") || "none"}`);
  });
