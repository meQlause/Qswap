import { ethers } from "ethers";
import { parseUnits } from "ethers/utils";
import QswapProxy from "../../contracts/artifacts/contracts/swap/qswapProxy.sol/QswapProxy.json"

declare global {
    interface Window {
        ethereum: any;
    }
}
const proxyAbi = QswapProxy.abi;
const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)"
];

const deployNewPool = async (
    proxyAddress: string,
    xAddress: string,
    xAmount: string,
    yAddress: string,
    yAmount: string, fee: number): Promise<[string, string]> => {
    const balanceUpdater = localStorage.getItem("UpdaterAddress")

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const proxy = new ethers.Contract(proxyAddress, proxyAbi, signer);

    // Approve tokenX
    const tokenX = new ethers.Contract(xAddress, erc20Abi, signer);
    const approveTxX = await tokenX.approve(balanceUpdater, ethers.parseUnits(xAmount, 18));
    await approveTxX.wait();
    console.log("TokenX approved");

    // Approve tokenY
    const tokenY = new ethers.Contract(yAddress, erc20Abi, signer);
    const approveTxY = await tokenY.approve(balanceUpdater, ethers.parseUnits(yAmount, 18));
    await approveTxY.wait();
    console.log("TokenY approved");

    const tx = await proxy.createPair(
        xAddress,
        parseUnits(xAmount, 18),
        yAddress,
        parseUnits(yAmount, 18),
        fee
    );

    const receipt = await tx.wait();

    if (receipt) {
        console.log("Pair created:");
        console.log("tokenX:", tokenX);
        console.log("tokenY:", tokenY);
        return [xAddress, yAddress]
    } else {
        throw new Error("No PairCreated event found")
    }
}

export default deployNewPool;