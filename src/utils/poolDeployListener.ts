import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum: any;
    }
}

const abi = [
    "event PairCreated(address indexed tokenX, address indexed tokenY, address pair, address liquidityToken)",
];
export const listener = async (proxyAddress: string, cb: (tokenX: string, tokenY: string, pair: string, liquidityToken: string) => void) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const proxy = new ethers.Contract(proxyAddress, abi, signer);
    const handlePairCreated = (tokenX: string, tokenY: string, pair: string, liquidityToken: string) => {
        console.log("listen")
        cb(tokenX, tokenY, pair, liquidityToken)
        proxy.off("PairCreated", handlePairCreated);
    };

    proxy.on("PairCreated", handlePairCreated);
} 