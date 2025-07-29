// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./qswapPair.sol";

contract QswapProxy {
    TokenBalanceUpdater public _tokenBalanceUpdaterContract;
    mapping(address => address) public getLTPair;
    mapping(address => mapping(address => address)) public getPair;


    constructor() {
    _tokenBalanceUpdaterContract = new TokenBalanceUpdater();
    }

    function createPair(address tokenX, uint256 amountTokenX, address tokenY, uint256 amountTokenY, uint256 fee) external returns (address pair) {
        require(tokenX != tokenY, "D0");
        require(getPair[tokenX][tokenY] == address(0), "D1");
        address liquidityToken = address(new QswapTokenCreator(0, string(abi.encodePacked(QswapTokenCreator(tokenX).name(), QswapTokenCreator(tokenY).name())), "QSLT", true, true));
        pair = address(new QswapConstantProductPair(tokenX, amountTokenX, tokenY, amountTokenY, fee, address(_tokenBalanceUpdaterContract), liquidityToken));
        getPair[tokenX][tokenY] = pair;
        getPair[tokenY][tokenX] = pair;
        getLTPair[liquidityToken] = pair;

        emit PairCreated(tokenX, tokenY, pair, liquidityToken);
    }

    function swap(address tokenX, address tokenY, uint256 amount) external returns (bool isSuccess) {
        (bool isReverse, address pairToUse) = _setIsReverse(tokenX, tokenY);
        require(pairToUse != address(0), "D2");

        QswapConstantProductPair pairContract = QswapConstantProductPair(pairToUse);
        pairContract.swap(tokenX, amount, isReverse, msg.sender);
        return true;
    }

    function addLiquidity(address tokenX, address tokenY, uint256 amountA) external returns (bool isSuccess) {
        (bool isReverse, address pairToUse) = _setIsReverse(tokenX, tokenY);
        require(pairToUse != address(0), "D2");
        
        QswapConstantProductPair pairContract = QswapConstantProductPair(pairToUse);
        pairContract.addLiquidity(amountA, isReverse);
        return true;
    }

    function removeLiquidity(address liquidityTokenAddress, uint256 amount) external returns (bool isSuccess) {
        QswapConstantProductPair pairContract = QswapConstantProductPair(getLTPair[liquidityTokenAddress]);
        pairContract.removeLiquidity(amount);
        return true;
    }

    function _setIsReverse(address tokenX, address tokenY) private view returns (bool isReverse, address pairToUse) {
        
        if (getPair[tokenX][tokenY] != address(0)) {
            pairToUse = getPair[tokenX][tokenY];
            isReverse = false;
        } else if (getPair[tokenY][tokenX] != address(0)) {
            pairToUse = getPair[tokenY][tokenX];
            isReverse = true;
        }
        return (isReverse, pairToUse);
    }

    event PairCreated(address indexed tokenX, address indexed tokenY, address pair, address liquidityToken);
}

