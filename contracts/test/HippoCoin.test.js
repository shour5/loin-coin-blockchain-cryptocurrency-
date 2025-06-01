const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HippoCoin", function () {
  let hippoCoin, owner, addr1, addr2, feeWallet;

  beforeEach(async function () {
    [owner, addr1, addr2, feeWallet] = await ethers.getSigners();

    const HippoCoin = await ethers.getContractFactory("HippoCoin");
    hippoCoin = await HippoCoin.deploy(feeWallet.address);
    await hippoCoin.waitForDeployment();
  });

  it("Should assign the total supply to the owner", async function () {
    const ownerBalance = await hippoCoin.balanceOf(owner.address);
    expect(await hippoCoin.totalSupply()).to.equal(ownerBalance);
  });

  it("Should allow minting by the owner", async function () {
    const mintAmount = ethers.parseUnits("1000", 18);
    await hippoCoin.mint(addr1.address, mintAmount);
    expect(await hippoCoin.balanceOf(addr1.address)).to.equal(mintAmount);
  });

  it("Should apply transfer fee on transfer", async function () {
    const transferAmount = ethers.parseUnits("100", 18); // 100 HIP
    await hippoCoin.transfer(addr1.address, transferAmount);

    // Addr1 sends 100 HIP to addr2
    await hippoCoin.connect(addr1).transfer(addr2.address, transferAmount);

    const expectedFee = transferAmount * 1n / 100n; // 1%
    const expectedReceived = transferAmount - expectedFee;

    expect(await hippoCoin.balanceOf(addr2.address)).to.equal(expectedReceived);
    expect(await hippoCoin.balanceOf(feeWallet.address)).to.equal(expectedFee);
  });

  it("Should pause and unpause transfers", async function () {
    await hippoCoin.pause();
    await expect(
      hippoCoin.transfer(addr1.address, ethers.parseUnits("10", 18))
    ).to.be.revertedWith("Pausable: paused");

    await hippoCoin.unpause();

    await expect(
      hippoCoin.transfer(addr1.address, ethers.parseUnits("10", 18))
    ).to.not.be.reverted;
  });

  it("Should only allow owner to change fee", async function () {
    await expect(
      hippoCoin.connect(addr1).setTransferFeePercent(2)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await hippoCoin.setTransferFeePercent(3);
    expect(await hippoCoin.transferFeePercent()).to.equal(3);
  });

  it("Should not allow setting invalid fee recipient", async function () {
    await expect(
      hippoCoin.setFeeRecipient(ethers.ZeroAddress)
    ).to.be.revertedWith("Invalid address");
  });
});
