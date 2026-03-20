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
    "function swap(address tokenX, address tokenY, uint256 amount) external returns(bool isSuccess)",
    "function approve(address spender, uint256 amount) public returns (bool)"
];

export const swapToken = async (
    proxyAddress: string,
    xAddress: string,
    yAddress: string,
    xAmount: string,
    onProgress?: (step: number) => void
) => {
    const balanceUpdater = localStorage.getItem("UpdaterAddress")
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to swap tokens');
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

    // Swap
    if (onProgress) onProgress(2);
    const tx = await proxy.swap(
        xAddress,
        yAddress,
        parseUnits(xAmount, 18),
    );

    const receipt = await tx.wait();

    if (receipt) {
        console.log("message:", receipt);
    } else {
        throw new Error("No PairCreated event found")
    }
}
