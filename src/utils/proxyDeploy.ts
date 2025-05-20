import { ethers } from "ethers";
import QswapProxy from "../../contracts/artifacts/contracts/swap/qswapProxy.sol/QswapProxy.json"

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

    const deployedAddress = await contract.getAddress();
    console.log("Contract deployed to address:", deployedAddress);
    console.log("Contract deployed successfully!");

    return deployedAddress;
};

export default deployProxyContract;
