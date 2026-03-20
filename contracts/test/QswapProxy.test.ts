import { expect } from "chai";
import { ethers } from "hardhat";
import { 
  QswapProxy, 
  QswapTokenCreator, 
  QswapConstantProductPair,
  TokenBalanceUpdater
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("QswapProxy", function () {
  let proxy: QswapProxy;
  let tokenX: QswapTokenCreator;
  let tokenY: QswapTokenCreator;
  let deployer: SignerWithAddress;
  let tokenBalanceUpdaterAddress: string;
  let pairAddress: string;
  let liquidityTokenAddress: string;
  let liquidityToken: QswapTokenCreator;

  const initialSupply = 1000000n;
  const amountX = ethers.parseUnits("1000", 18);
  const amountY = ethers.parseUnits("1000", 18);
  const fee = 300n;

  before(async function () {
    [deployer] = await ethers.getSigners();

    const TokenCreatorFactory = await ethers.getContractFactory("QswapTokenCreator");
    tokenX = (await TokenCreatorFactory.deploy(initialSupply, "TokenX", "TX", true, true)) as unknown as QswapTokenCreator;
    await tokenX.waitForDeployment();

    tokenY = (await TokenCreatorFactory.deploy(initialSupply, "TokenY", "TY", true, true)) as unknown as QswapTokenCreator;
    await tokenY.waitForDeployment();

    const QswapProxyFactory = await ethers.getContractFactory("QswapProxy");
    proxy = (await QswapProxyFactory.deploy()) as unknown as QswapProxy;
    await proxy.waitForDeployment();

    tokenBalanceUpdaterAddress = await proxy._tokenBalanceUpdaterContract();
  });

  describe("createPair", function () {
    it("Should create a new pair and mint initial liquidity", async function () {
      await tokenX.approve(tokenBalanceUpdaterAddress, amountX);
      await tokenY.approve(tokenBalanceUpdaterAddress, amountY);

      await expect(proxy.createPair(await tokenX.getAddress(), amountX, await tokenY.getAddress(), amountY, fee))
        .to.emit(proxy, "PairCreated");

      const pairInfo = await proxy.getPair(await tokenX.getAddress(), await tokenY.getAddress());
      pairAddress = pairInfo.pairAddress;
      expect(pairAddress).to.not.equal(ethers.ZeroAddress);

      const pairContract = await ethers.getContractAt("QswapConstantProductPair", pairAddress) as unknown as QswapConstantProductPair;
      liquidityTokenAddress = await pairContract.liquidityToken();
      expect(liquidityTokenAddress).to.not.equal(ethers.ZeroAddress);

      liquidityToken = await ethers.getContractAt("QswapTokenCreator", liquidityTokenAddress) as unknown as QswapTokenCreator;
      const liquidityBalance = await liquidityToken.balanceOf(deployer.address);
      expect(liquidityBalance).to.be.gt(0n);
    });
  });

  describe("addLiquidity", function () {
    it("Should add more liquidity to the pair", async function () {
      const addAmountX = ethers.parseUnits("100", 18);
      await tokenX.approve(tokenBalanceUpdaterAddress, addAmountX * 2n); 
      await tokenY.approve(tokenBalanceUpdaterAddress, addAmountX * 2n);

      const balanceBefore = await liquidityToken.balanceOf(deployer.address);
      await proxy.addLiquidity(await tokenX.getAddress(), await tokenY.getAddress(), addAmountX);
      const balanceAfter = await liquidityToken.balanceOf(deployer.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });

  describe("swap", function () {
    it("Should swap tokenX for tokenY", async function () {
      const swapAmount = ethers.parseUnits("10", 18);
      await tokenX.approve(tokenBalanceUpdaterAddress, swapAmount);

      const balanceYBefore = await tokenY.balanceOf(deployer.address);
      await proxy.swap(await tokenX.getAddress(), await tokenY.getAddress(), swapAmount);
      const balanceYAfter = await tokenY.balanceOf(deployer.address);

      expect(balanceYAfter).to.be.gt(balanceYBefore);
    });

    it("Should revert if swap amount is 0", async function () {
      await expect(proxy.swap(await tokenX.getAddress(), await tokenY.getAddress(), 0))
        .to.be.revertedWith("A0");
    });

    it("Should revert if the pair does not exist", async function () {
      await expect(proxy.swap(await tokenX.getAddress(), deployer.address, ethers.parseUnits("10", 18)))
        .to.be.revertedWith("D2");
    });

    it("Should revert if there is insufficient allowance", async function () {
      const swapAmount = ethers.parseUnits("10", 18);
      // Ensure allowance is 0
      await tokenX.approve(tokenBalanceUpdaterAddress, 0); 
      
      await expect(proxy.swap(await tokenX.getAddress(), await tokenY.getAddress(), swapAmount))
        .to.be.revertedWith("Allowance exceeded");
    });

    it("Should revert if sending swap output to the zero address", async function () {
        const pairProxy = await ethers.getContractAt("QswapConstantProductPair", pairAddress);
        await expect(pairProxy.swap(await tokenX.getAddress(), ethers.parseUnits("10", 18), false, ethers.ZeroAddress))
            .to.be.revertedWith("A1");
    });

    it("Should revert on extreme swap amounts due to math overflow", async function () {
        const extremeAmount = ethers.MaxUint256;
        await expect(
            proxy.swap(await tokenX.getAddress(), await tokenY.getAddress(), extremeAmount)
        ).to.be.reverted; 
    });
  });

  describe("removeLiquidity", function () {
    it("Should remove liquidity and return tokens", async function () {
      const liquidityBalance = await liquidityToken.balanceOf(deployer.address);
      await liquidityToken.approve(pairAddress, liquidityBalance);

      const balanceXBefore = await tokenX.balanceOf(deployer.address);
      const balanceYBefore = await tokenY.balanceOf(deployer.address);

      await proxy.removeLiquidity(liquidityTokenAddress, liquidityBalance);

      const balanceXAfter = await tokenX.balanceOf(deployer.address);
      const balanceYAfter = await tokenY.balanceOf(deployer.address);

      expect(balanceXAfter).to.be.gt(balanceXBefore);
      expect(balanceYAfter).to.be.gt(balanceYBefore);
      
      const liquidityBalanceAfter = await liquidityToken.balanceOf(deployer.address);
      expect(liquidityBalanceAfter).to.equal(0n);
    });
  });
});
