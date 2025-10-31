import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { EncryptedGridSelection, EncryptedGridSelection__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("EncryptedGridSelection")) as EncryptedGridSelection__factory;
  const contract = (await factory.deploy()) as EncryptedGridSelection;
  const address = await contract.getAddress();
  return { contract, address };
}

function encodeCells(cells: number[]): number {
  return cells.reduce((mask, cell) => mask | (1 << (cell - 1)), 0);
}

describe("EncryptedGridSelection", function () {
  let signers: Signers;
  let contract: EncryptedGridSelection;
  let contractAddress: string;

  before(async function () {
    const accounts: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: accounts[0], alice: accounts[1], bob: accounts[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      this.skip();
    }
    ({ contract, address: contractAddress } = await deployFixture());
  });

  it("reverts when selection is missing", async function () {
    const queryAddress = signers.alice.address;
    await expect(contract.getSelection(queryAddress)).to.be.revertedWithCustomError(contract, "SelectionNotFound");
    const hasSelection = await contract.hasSelection(queryAddress);
    expect(hasSelection).to.equal(false);
  });

  it("saves and decrypts a selection", async function () {
    const { alice } = signers;
    const cells = [1, 5, 16];
    const expectedMask = encodeCells(cells);

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, alice.address)
      .add16(expectedMask)
      .encrypt();

    const tx = await contract.connect(alice).saveSelection(encryptedInput.handles[0], encryptedInput.inputProof);
    await tx.wait();

    const hasSelection = await contract.hasSelection(alice.address);
    expect(hasSelection).to.equal(true);

    const encryptedSelection = await contract.getSelection(alice.address);
    expect(encryptedSelection).to.not.equal(ethers.ZeroHash);

    const clearValue = await fhevm.userDecryptEuint(
      FhevmType.euint16,
      encryptedSelection,
      contractAddress,
      alice,
    );

    expect(clearValue).to.equal(expectedMask);
  });

  it("overwrites previous selection for the same user", async function () {
    const { alice } = signers;
    const firstMask = encodeCells([2, 3]);
    const secondMask = encodeCells([4, 8, 12]);

    const firstInput = await fhevm.createEncryptedInput(contractAddress, alice.address).add16(firstMask).encrypt();
    await (await contract.connect(alice).saveSelection(firstInput.handles[0], firstInput.inputProof)).wait();

    const secondInput = await fhevm.createEncryptedInput(contractAddress, alice.address).add16(secondMask).encrypt();
    await (await contract.connect(alice).saveSelection(secondInput.handles[0], secondInput.inputProof)).wait();

    const encryptedSelection = await contract.getSelection(alice.address);

    const clearValue = await fhevm.userDecryptEuint(
      FhevmType.euint16,
      encryptedSelection,
      contractAddress,
      alice,
    );

    expect(clearValue).to.equal(secondMask);
  });
});
