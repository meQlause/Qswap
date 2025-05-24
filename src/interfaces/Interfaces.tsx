export interface ModalProps {
    isOpen: boolean;
    onClose?: any;
    type?: 'success' | 'error';
    title?: string;
    message: string;
    tokenAddress?: string;
}

export interface Pool {
    id: number;
    pair: string;
    fee: string;
    tvl: string;
    tokenX: string;
    tokenY: string;
}

export interface Token {
    id?: number;
    name: string;
    symbol: string;
    totalSupply: string;
    holders: number;
    address: string
}
export interface TokenSelection {
    token: Token | null;
    amount: number;
    dropdownOpen: boolean;
}
export interface handleTabChange { handleTabChange: (tab: "pools" | "my-pools") => void }