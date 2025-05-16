import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import { formatUnits } from "ethers/utils";
import { Token } from "../interfaces/Interfaces";

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function holderCount() view returns (uint256)",
];

export async function getTokenInfo(tokenAddress: string): Promise<Token | null> {
    try {
        const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        const totalSupplyRaw = await tokenContract.totalSupply();
        const totalSupply = formatUnits(totalSupplyRaw, decimals);
        const holders = await tokenContract.holderCount();
        return {
            name,
            symbol,
            totalSupply,
            holders: Number(holders),
            address: tokenAddress

        };
    } catch (err) {
        console.error("Failed to fetch token info:", err);
        return null
    }
}