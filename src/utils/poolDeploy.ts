import { ethers } from "ethers";
import { parseUnits } from "ethers/utils";
import QswapProxy from "../../contracts/artifacts/contracts/swap/qswapProxy.sol/QswapProxy.json"

declare global {
    interface Window {
        ethereum: any;
    }
}
const proxyAbi = QswapProxy.abi;
const abi = [
    "function createPair(address tokenX, uint256 amountTokenX, address tokenY, uint256 amountTokenY, uint256 fee) external returns (address pair)",
    "function approve(address spender, uint256 amount) public returns (bool)"
];

const deployNewPool = async (
    proxyAddress: string,
    xAddress: string,
    xAmount: string,
    yAddress: string,
    yAmount: string, 
    fee: number,
    onProgress?: (step: number) => void
) => {
    const balanceUpdater = localStorage.getItem("UpdaterAddress")

    if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to deploy pools');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const proxy = new ethers.Contract(proxyAddress, proxyAbi, signer);

    // Approve tokenX
    if (onProgress) onProgress(1);
    const tokenX = new ethers.Contract(xAddress, abi, signer);
    const approveTxX = await tokenX.approve(balanceUpdater, ethers.parseUnits(xAmount, 18));
    await approveTxX.wait();
    console.log("TokenX approved");

    // Approve tokenY
    if (onProgress) onProgress(2);
    const tokenY = new ethers.Contract(yAddress, abi, signer);
    const approveTxY = await tokenY.approve(balanceUpdater, ethers.parseUnits(yAmount, 18));
    await approveTxY.wait();
    console.log("TokenY approved");

    // Create Pair
    if (onProgress) onProgress(3);
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
        console.log("tokenX:", tokenX.target);
        console.log("tokenY:", tokenY.target);
    } else {
        throw new Error("No PairCreated event found")
    }
}

export default deployNewPool;