import { ethers } from "ethers";

const provider = new ethers.BrowserProvider(window.ethereum);


const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
];

export const getTokenBalance = async (tokenAddress: string): Promise<number> => {
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    const balance = await contract.balanceOf(signer.getAddress());
    const decimals = await contract.decimals();

    const formatted = ethers.formatUnits(balance, decimals);

    return Number(formatted);
}
