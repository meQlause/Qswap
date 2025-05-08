// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./tokenBalanceUpdater.sol";

contract QswapConstantProductPair {

    address public tokenX;
    address public tokenY;

    uint256 private reserveX;
    uint256 private reserveY;

    TokenBalanceUpdater private _tokenBalanceUpdater;

    uint256 public feePercentage; 
    uint32 private blockTimestampLast;
    uint256 public feeDenominator = 10000; 

    constructor(address _tokenX, address _tokenY, uint256 _fee, address tokenBalanceUpdater) {
        tokenX = _tokenX;
        tokenY = _tokenY;
        feePercentage = _fee;
        _tokenBalanceUpdater = TokenBalanceUpdater(tokenBalanceUpdater);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveX, reserveY);
    }

    function swap(address addressTokenToswap, uint256 amountToSwap, bool isReverse, address to) external {
        (
            uint256 k, uint256 reserve2, 
            address give, address get,
            uint256 effectiveAmountToSwap
        ) 
        = _getOptions(amountToSwap, isReverse, addressTokenToswap);

        uint256 amountToGet = (k / (reserve2 + effectiveAmountToSwap)) - reserve2;

        _updateBalance(give, to, address(this), effectiveAmountToSwap);
        _updateBalance(get, address(this), to,  amountToGet);
        _updateReserves();
    
    }

    function addLiquidity(uint256 amount0, uint256 amount1, bool isReverse) external {
        // TO DO : implement add liquidity logic
    }

    function removeLiquidity(uint256 liquidity) external returns (uint256 amount0, uint256 amount1) {
        // TO DO : implement remove liquidity logic
    }

    function _updateBalance(address tokenAdress, address fromAddress, address toAddress, uint256 amount) private {
        _tokenBalanceUpdater.updateBalance(tokenAdress, fromAddress, toAddress, amount);
    }

    function _getOptions(uint256 amountToSwap, bool isReverse, address addressTokenToswap) private view returns (uint256 k, uint256 reserve2, address give, address get, uint256 effectiveAmountToSwap) {
        k = reserveX * reserveY;
        effectiveAmountToSwap = amountToSwap * 997 / 1000;

        if (isReverse) {
            reserve2 = reserveX;
            give = addressTokenToswap;
            get = tokenY;
        } else {
            reserve2 = reserveY;
            give = tokenX;
            get = addressTokenToswap;
        }
        return (k, reserve2, give, get, effectiveAmountToSwap);
    }

    function _updateReserves() private {
        reserveX = _tokenBalanceUpdater.getTokenBalance(tokenX, address(this));
        reserveY = _tokenBalanceUpdater.getTokenBalance(tokenY, address(this));
    }
}
