// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./qswapPair.sol";

contract QswapProxy {
    TokenBalanceUpdater private _tokenBalanceUpdaterContract;
    mapping(address => mapping(address => address)) public getPair;


    constructor() {
    _tokenBalanceUpdaterContract = new TokenBalanceUpdater();
    }

    function createPair(address tokenA, address tokenB, uint256 fee) external returns (address pair) {
        require(tokenA != tokenB, "SwapFactory: IDENTICAL_ADDRESSES");
        require(getPair[tokenA][tokenB] == address(0), "SwapFactory: PAIR_EXISTS");
    
        pair = address(new QswapConstantProductPair(tokenA, tokenB, fee, address(_tokenBalanceUpdaterContract)));
        
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair;  

        emit PairCreated(tokenA, tokenB, pair);
    }

    function swap(address tokenA, address tokenB, uint256 amount) external returns (bool isSuccess) {
        (bool isReverse, address pairToUse) = _setIsReverse(tokenA, tokenB);
        require(pairToUse != address(0), "SwapProxy: PAIR_DOES_NOT_EXIST");

        QswapConstantProductPair pairContract = QswapConstantProductPair(pairToUse);

        pairContract.swap(tokenA, amount, isReverse, msg.sender);
        
        return true;
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA ) external returns (bool isSuccess) {
        (bool isReverse, address pairToUse) = _setIsReverse(tokenA, tokenB);
        require(pairToUse != address(0), "SwapProxy: PAIR_DOES_NOT_EXIST");
        
        QswapConstantProductPair pairContract = QswapConstantProductPair(pairToUse);

        pairContract.addLiquidity(amountA, isReverse);
        
        return true;
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 liquidity) external returns (bool isSuccess) {
        // TO DO : implement removing liquidity logic
    }


    function _setIsReverse(address tokenA, address tokenB) private view returns (bool isReverse, address pairToUse) {
        
        if (getPair[tokenA][tokenB] != address(0)) {
            pairToUse = getPair[tokenA][tokenB];
            isReverse = false;
        } else if (getPair[tokenB][tokenA] != address(0)) {
            pairToUse = getPair[tokenB][tokenA];
            isReverse = true;
        }
        return (isReverse, pairToUse);
    }

    event PairCreated(address indexed tokenA, address indexed tokenB, address pair);
}

