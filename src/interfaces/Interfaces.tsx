export interface ModalProps {
    isOpen: boolean;
    onClose?: any;
    type?: 'success' | 'error';
    title?: string;
    message: string;
    tokenAddress?: string;
}

export interface Token {
    id?: number;
    name: string;
    symbol: string;
    totalSupply: string;
    holders: number;
    address: string
}