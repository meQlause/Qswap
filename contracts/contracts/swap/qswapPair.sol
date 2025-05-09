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
        = _getSwapOptions(amountToSwap, isReverse, addressTokenToswap);

        uint256 amountToGet = (k / (reserve2 + effectiveAmountToSwap)) - reserve2;

        _updateBalance(give, to, address(this), effectiveAmountToSwap);
        _updateBalance(get, address(this), to,  amountToGet);
        _updateReserves();
    
    }

    function addLiquidity(uint256 amount, bool isReverse) external {
        (
            uint256 x, uint256 y,
            address xAddress, address yAddress
        ) 
        = 
        _getLiquidityOptions(isReverse);
        uint256 amount_needed = (x * amount) / y;
        
        _updateBalance(xAddress, msg.sender, address(this), amount_needed);
        _updateBalance(yAddress, msg.sender, address(this), amount);
        _updateReserves();

    }

    function removeLiquidity(uint256 liquidity) external returns (uint256 amount0, uint256 amount1) {
        // TO DO : implement remove liquidity logic
    }

    function _updateBalance(address tokenAdress, address fromAddress, address toAddress, uint256 amount) private {
        _tokenBalanceUpdater.updateBalance(tokenAdress, fromAddress, toAddress, amount);
    }

    function _getSwapOptions(uint256 amountToSwap, bool isReverse, address addressTokenToswap) private view returns (uint256 k, uint256 reserve2, address give, address get, uint256 effectiveAmountToSwap) {
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

    function _getLiquidityOptions(bool isReverse) private view returns (uint256 x, uint256 y, address xAddress, address yAddress) {
        if (isReverse) {
            x = reserveX;
            y = reserveY;
            xAddress = tokenX;
            yAddress = tokenY;
        } else {
            x = reserveY;
            y = reserveX;
            xAddress = tokenY;
            yAddress = tokenX;
        }
        return (x, y, xAddress, yAddress);
    }
    function _updateReserves() private {
        reserveX = _tokenBalanceUpdater.getTokenBalance(tokenX, address(this));
        reserveY = _tokenBalanceUpdater.getTokenBalance(tokenY, address(this));
    }
}
