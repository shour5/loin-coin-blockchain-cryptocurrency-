const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying Hippo Coin with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 Deployer ETH balance:", ethers.formatEther(balance));

  // Compile and deploy contract
  const HippoCoin = await ethers.getContractFactory("HippoCoin");
  const token = await HippoCoin.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ Hippo Coin deployed to:", address);

  // Check total supply
  const totalSupply = await token.totalSupply();
  console.log("🧾 Total Supply:", ethers.formatUnits(totalSupply, 18), "HIP");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
