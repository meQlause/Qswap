import { ethers } from "ethers";
import { parseUnits } from "ethers/utils";
import QswapProxy from "../../contracts/artifacts/contracts/swap/qswapProxy.sol/QswapProxy.json"

declare global {
    interface Window {
        ethereum: any;
    }
}
const proxyAbi = QswapProxy.abi;

const deployNewPool = async (proxyAddress: string, xAddress: string, xAmount: string, yAddress: string, yAmount: string, fee: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const proxy = new ethers.Contract(proxyAddress, proxyAbi, signer);

    const tx = await proxy.createPair(
        xAddress,
        parseUnits(xAmount, 18),
        yAddress,
        parseUnits(yAmount, 18),
        fee
    );

    const receipt = await tx.wait();
    console.log("Pair created:", receipt);
}

export default deployNewPool;