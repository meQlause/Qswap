import { ethers } from "ethers";
import QswapTokenCreator from "../../contracts/artifacts/contracts/token/token.sol/QswapTokenCreator.json";

declare global {
    interface Window {
        ethereum: any;
    }
}

const createToken = async (initialSupply: number, name: string, symbol: string, isMintable: boolean, isBurnable: boolean) => {

    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to deploy tokens');
    }

    // Request account access
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factory = new ethers.ContractFactory(QswapTokenCreator.abi, QswapTokenCreator.bytecode, signer);

    const contract = await factory.deploy(
        initialSupply,
        name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        symbol.toUpperCase(),
        isMintable,
        isBurnable);

    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();
    console.log("Contract deployed to address:", deployedAddress);
    console.log("Contract deployed successfully!");

    return deployedAddress;
};

export default createToken;
