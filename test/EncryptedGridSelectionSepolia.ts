import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { deployments, ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { EncryptedGridSelection } from "../types";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("EncryptedGridSelectionSepolia", function () {
  let signer: Signers;
  let contractAddress: string;
  let contract: EncryptedGridSelection;
  let step = 0;
  let steps = 0;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      this.skip();
    }

    try {
      const deployment = await deployments.get("EncryptedGridSelection");
      contractAddress = deployment.address;
      contract = await ethers.getContractAt("EncryptedGridSelection", deployment.address);
    } catch (error) {
      (error as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw error;
    }

    const [alice] = await ethers.getSigners();
    signer = { alice };
  });

  beforeEach(async function () {
    step = 0;
    steps = 0;
  });

  it("saves and decrypts a selection on Sepolia", async function () {
    this.timeout(4 * 40000);
    steps = 9;

    const selectionMask = (1 << 0) | (1 << 5) | (1 << 9);

    progress("Encrypting selection bitmask...");
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signer.alice.address)
      .add16(selectionMask)
      .encrypt();

    progress("Calling saveSelection on EncryptedGridSelection...");
    const tx = await contract.connect(signer.alice).saveSelection(encryptedInput.handles[0], encryptedInput.inputProof);
    await tx.wait();

    progress("Checking hasSelection...");
    const hasSelection = await contract.hasSelection(signer.alice.address);
    expect(hasSelection).to.equal(true);

    progress("Fetching encrypted selection...");
    const encryptedSelection = await contract.getSelection(signer.alice.address);
    expect(encryptedSelection).to.not.equal(ethers.ZeroHash);

    progress("Decrypting selection...");
    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint16,
      encryptedSelection,
      contractAddress,
      signer.alice,
    );

    progress(`Decrypted selection: ${decrypted}`);
    expect(decrypted).to.equal(selectionMask);
  });
});
