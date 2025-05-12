async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TokenX = await ethers.getContractFactory("QswapTokenCreator");
  const tokenX = await TokenX.deploy(1000000, "TokenX", "TX", true, true);
  await tokenX.deployed();
  console.log("TokenX deployed to:", tokenX.address);

  const TokenY = await ethers.getContractFactory("QswapTokenCreator");
  const tokenY = await TokenY.deploy(1000000, "TokenY", "TY", true, true);
  await tokenY.deployed();
  console.log("TokenY deployed to:", tokenY.address);

  const Proxy = await ethers.getContractFactory("QswapProxy");
  const proxy = await Proxy.deploy();
  await proxy.deployed();
  console.log("Proxy contract deployed to:", proxy.address);

  const amountX = ethers.utils.parseUnits("1000", 18);
  const amountY = ethers.utils.parseUnits("1000", 18);
  const fee = 300;

  const tokenBalanceUpdaterAddress = await proxy._tokenBalanceUpdaterContract();
  console.log("TokenBalanceUpdater contract deployed to:", tokenBalanceUpdaterAddress);

  await tokenX.approve(tokenBalanceUpdaterAddress, amountX);
  await tokenY.approve(tokenBalanceUpdaterAddress, amountY);
  console.log("Approved proxy to spend tokens");

  const tx = await proxy.createPair(tokenX.address, amountX, tokenY.address, amountY, fee);
  await tx.wait();
  console.log("Pair created");
  
  const pairAddress = await proxy.getPair(tokenX.address, tokenY.address);
  console.log("Pair address:", pairAddress);

  const pairContract = await ethers.getContractAt("QswapConstantProductPair", pairAddress);
  const liquidityTokenAddress = await pairContract.liquidityToken();
  console.log("Liquidity token address:", liquidityTokenAddress);
  
  const liquidityTokenContract = await ethers.getContractAt("QswapTokenCreator", liquidityTokenAddress); // or use a generic ERC20 ABI if it's standard
  const BalanceX = await tokenX.balanceOf(deployer.address);
  const BalanceY = await tokenY.balanceOf(deployer.address);
  const liquidityTokenAmount = await liquidityTokenContract.balanceOf(deployer.address);  
  
  console.log("TokenX balance After Add Init Liquidity:", ethers.utils.formatUnits(BalanceX, 18));
  console.log("TokenY balance After Add Init Liquidity:", ethers.utils.formatUnits(BalanceY, 18));
  console.log("Liquidity token amount After Add Init Liquidity:", ethers.utils.formatUnits(liquidityTokenAmount, 18));
  
  
  const balanceX = await tokenX.balanceOf(deployer.address);
  console.log("TokenX balance of deployer:", ethers.utils.formatUnits(balanceX, 18));
  
  await tokenX.approve(tokenBalanceUpdaterAddress, ethers.utils.parseUnits("10000", 18)); 
  await tokenY.approve(tokenBalanceUpdaterAddress, ethers.utils.parseUnits("10000", 18)); 
  const addLiquidityTx = await proxy.addLiquidity(tokenX.address, tokenY.address, ethers.utils.parseUnits("100", 18));
  await addLiquidityTx.wait();
  console.log("Liquidity added");
  
  const BalanceX1 = await tokenX.balanceOf(deployer.address);
  const BalanceY1 = await tokenY.balanceOf(deployer.address);
  const liquidityTokenAmount1 = await liquidityTokenContract.balanceOf(deployer.address);
  
  console.log("TokenX balance After Add Liquidity:", ethers.utils.formatUnits(BalanceX1, 18));
  console.log("TokenY balance After Add Liquidity:", ethers.utils.formatUnits(BalanceY1, 18));
  console.log("Liquidity token amount After Add Liquidity:", ethers.utils.formatUnits(liquidityTokenAmount1, 18));
  
  const swapAmount = ethers.utils.parseUnits("10", 18);
  await tokenX.approve(tokenBalanceUpdaterAddress, ethers.utils.parseUnits("10000", 18)); 
  const swapTx = await proxy.swap(tokenX.address, tokenY.address, swapAmount);
  await swapTx.wait();
  console.log("Swap executed");
  
  const BalanceX2 = await tokenX.balanceOf(deployer.address);
  const BalanceY2 = await tokenY.balanceOf(deployer.address);
  const liquidityTokenAmount2 = await liquidityTokenContract.balanceOf(deployer.address);
  console.log("TokenX balance After Swap:", ethers.utils.formatUnits(BalanceX2, 18));
  console.log("TokenY balance After Swap:", ethers.utils.formatUnits(BalanceY2, 18));
  console.log("Liquidity token amount Before Remove Liquidity:", ethers.utils.formatUnits(liquidityTokenAmount2, 18));
  
  await liquidityTokenContract.approve(pairAddress, liquidityTokenAmount2); 
  const removeTx = await proxy.removeLiquidity(liquidityTokenAddress, liquidityTokenAmount2);
  await removeTx.wait();
  
  console.log("Liquidity removed");
  
  const finalBalanceX = await tokenX.balanceOf(deployer.address);
  const finalBalanceY = await tokenY.balanceOf(deployer.address);
  const FinalLiquidityTokenAmount = await liquidityTokenContract.balanceOf(deployer.address);
  console.log("Final TokenX balance:", ethers.utils.formatUnits(finalBalanceX, 18));
  console.log("Final TokenY balance:", ethers.utils.formatUnits(finalBalanceY, 18));
  console.log("Final Liquidity token amount:", ethers.utils.formatUnits(FinalLiquidityTokenAmount, 18));
  
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error("Error:", error);
  process.exit(1);
  });
