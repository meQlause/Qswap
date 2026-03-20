import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy tokens (optional: you can remove this if you only want to deploy the proxy and updater)
  const initialSupply = 1000000n;
  const TokenCreatorFactory = await ethers.getContractFactory("QswapTokenCreator");
  
  console.log("Deploying TokenX...");
  const tokenX = await TokenCreatorFactory.deploy(initialSupply, "TokenX", "TX", true, true);
  await tokenX.waitForDeployment();
  const tokenXAddress = await tokenX.getAddress();
  console.log("TokenX deployed to:", tokenXAddress);

  console.log("Deploying TokenY...");
  const tokenY = await TokenCreatorFactory.deploy(initialSupply, "TokenY", "TY", true, true);
  await tokenY.waitForDeployment();
  const tokenYAddress = await tokenY.getAddress();
  console.log("TokenY deployed to:", tokenYAddress);

  // Deploy Proxy
  console.log("Deploying QswapProxy...");
  const QswapProxyFactory = await ethers.getContractFactory("QswapProxy");
  const proxy = await QswapProxyFactory.deploy();
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("Proxy contract deployed to:", proxyAddress);

  const tokenBalanceUpdaterAddress = await proxy._tokenBalanceUpdaterContract();
  console.log("TokenBalanceUpdater logically deployed to:", tokenBalanceUpdaterAddress);

  // Optional: create the initial pair (Comment this section out if you only want to deploy)
  const amountX = ethers.parseUnits("1000", 18);
  const amountY = ethers.parseUnits("1000", 18);
  const fee = 300n;

  console.log("Approving token balance updater to spend TokenX...");
  let tx = await tokenX.approve(tokenBalanceUpdaterAddress, amountX);
  await tx.wait();

  console.log("Approving token balance updater to spend TokenY...");
  tx = await tokenY.approve(tokenBalanceUpdaterAddress, amountY);
  await tx.wait();

  console.log("Creating initial pair TokenX/TokenY...");
  tx = await proxy.createPair(tokenXAddress, amountX, tokenYAddress, amountY, fee);
  await tx.wait();
  
  const pairInfo = await proxy.getPair(tokenXAddress, tokenYAddress);
  console.log("Pair created successfully at address:", pairInfo.pairAddress);
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
