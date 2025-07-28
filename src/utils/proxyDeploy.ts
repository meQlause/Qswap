import { ethers } from "ethers";
import QswapProxy from "../../contracts/artifacts/contracts/swap/qswapProxy.sol/QswapProxy.json";

declare global {
    interface Window {
        ethereum: any;
    }
}

const deployProxyContract = async () => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to deploy tokens');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const factory = new ethers.ContractFactory(QswapProxy.abi, QswapProxy.bytecode, signer);

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const proxyAddress = await contract.getAddress();

    const proxy = new ethers.Contract(proxyAddress, QswapProxy.abi, signer);

    const updaterAddress: string = await proxy._tokenBalanceUpdaterContract();

    return {
        proxyAddress,
        updaterAddress,
    };
};

export default deployProxyContract;
