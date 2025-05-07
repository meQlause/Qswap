// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./qswapPair.sol";



contract SwapFactory {

    mapping(address => mapping(address => address)) public getPair;

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "SwapFactory: IDENTICAL_ADDRESSES");
        
        require(getPair[tokenA][tokenB] == address(0), "SwapFactory: PAIR_EXISTS");

        pair = address(new QswapConstantProductPair(tokenA, tokenB));
        
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair;  

        emit PairCreated(tokenA, tokenB, pair);
    }


    event PairCreated(address indexed tokenA, address indexed tokenB, address pair);
}

