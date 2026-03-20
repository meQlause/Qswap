import { ethers, JsonRpcProvider } from "ethers";
import { RPC_URL } from "../config/rpc";

export const abi = [
    "function tokenX() view returns (address)",
    "function tokenY() view returns (address)",
    "function _reserveX() view returns (uint256)",
    "function _reserveY() view returns (uint256)",
    "function feePercentage() view returns (uint256)"
];

export const getPairInfo = async (pairAddress: string) => {
    try {
        const provider = new JsonRpcProvider(RPC_URL);
        const pairContract = new ethers.Contract(pairAddress, abi, provider);
        const tokenX = await pairContract.tokenX();
        const tokenY = await pairContract.tokenY();
        const reserveX = await pairContract._reserveX();
        const reserveY = await pairContract._reserveY();
        const fee = await pairContract.feePercentage();

        return {
            tokenX,
            tokenY,
            reserveX,
            reserveY,
            fee
        }
    } catch (err) {
        console.error("Failed to fetch token info:", err);
        return null
    }


};
