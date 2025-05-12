// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./tokenBalanceUpdater.sol";
import "../libs/ABDKmath64x64.sol";


contract QswapConstantProductPair {
    using ABDKMath64x64 for int128;

    QswapTokenCreator public tokenX;
    QswapTokenCreator public tokenY;
    QswapTokenCreator public liquidityToken;
    uint256 public feePercentage; 
    uint256 public feeDenominator = 10000; 
    uint256 private _reserveX;
    uint256 private _reserveY;
    uint256 private _liquidityTokenReserve;
    TokenBalanceUpdater private _tokenBalanceUpdater;
    uint32 private blockTimestampLast;

    event RemoveLiquidity(address indexed sender, uint256 amount0, uint256 amount1, uint256 liquidity);
    event Sync(uint256 reserveX, uint256 reserveY);
    event LiquidityTokenCreated(address indexed tokenX, address indexed tokenY, address indexed liquidityToken);
    event Swap(address indexed sender, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event AddLiquidity(address indexed sender, uint256 amountX, uint256 amountY, uint256 liquidityMinted);
    event InsufficientLiquidityError(address indexed sender, string reason);
    event TransferError(address indexed sender, string reason);

    constructor(address _tokenX, uint256 _amountTokenX, address _tokenY, uint256 _amountTokenY, uint256 _fee, address tokenBalanceUpdater) {
        tokenX = QswapTokenCreator(_tokenX);
        tokenY = QswapTokenCreator(_tokenY);
        feePercentage = _fee;
        liquidityToken = new QswapTokenCreator(0, string(abi.encodePacked(tokenX.name(), tokenY.name())), "QSLT", true, true);
        emit LiquidityTokenCreated(address(tokenX), address(tokenY), address(liquidityToken));
        _tokenBalanceUpdater = TokenBalanceUpdater(tokenBalanceUpdater);

        uint256 liquidityTokenAmount = _initGetLiquidityTokenAmount(_amountTokenX, _amountTokenY);
        liquidityToken.mint(msg.sender, liquidityTokenAmount);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (_reserveX, _reserveY);
    }

    function swap(address addressTokenToswap, uint256 amountToSwap, bool isReverse, address to) external {
        require(amountToSwap > 0, "QswapPair: INSUFFICIENT_INPUT_AMOUNT");
        require(to != address(0), "QswapPair: INVALID_RECIPIENT");
        
        (
            uint256 k, uint256 reserve2, 
            address give, address get,
            uint256 effectiveAmountToSwap
        ) 
        = _getSwapOptions(amountToSwap, isReverse, addressTokenToswap);

        require(k > 0, "QswapPair: INSUFFICIENT_LIQUIDITY");
        uint256 amountToGet = reserve2 - (k / (reserve2 + effectiveAmountToSwap));
        require(amountToGet > 0, "QswapPair: INSUFFICIENT_OUTPUT_AMOUNT");

        bool success = _updateBalance(give, to, address(this), effectiveAmountToSwap);
        if (!success) {
            emit TransferError(msg.sender, "Input token transfer failed");
            revert("QswapPair: INPUT_TRANSFER_FAILED");
        }

        success = _updateBalance(get, address(this), to, amountToGet);
        if (!success) {
            emit TransferError(msg.sender, "Output token transfer failed");
            revert("QswapPair: OUTPUT_TRANSFER_FAILED");
        }

        _updateReserves();
        emit Swap(msg.sender, give, get, effectiveAmountToSwap, amountToGet);
    }

    function addLiquidity(uint256 amount, bool isReverse) external {
        require(amount > 0, "QswapPair: INSUFFICIENT_INPUT_AMOUNT");
        
        (
            uint256 x, uint256 y,
            address xAddress, address yAddress
        ) = _getLiquidityOptions(isReverse);
        
        require(x > 0 && y > 0, "QswapPair: INSUFFICIENT_LIQUIDITY");
        uint256 amount_needed = (x * amount) / y;
        require(amount_needed > 0, "QswapPair: INSUFFICIENT_LIQUIDITY_AMOUNT");

        bool success = _updateBalance(xAddress, msg.sender, address(this), amount_needed);
        if (!success) {
            emit TransferError(msg.sender, "First token transfer failed");
            revert("QswapPair: FIRST_TOKEN_TRANSFER_FAILED");
        }

        success = _updateBalance(yAddress, msg.sender, address(this), amount);
        if (!success) {
            emit TransferError(msg.sender, "Second token transfer failed");
            revert("QswapPair: SECOND_TOKEN_TRANSFER_FAILED");
        }

        uint256 liquidityBefore = liquidityToken.totalSupply();
        _mintLiquidityToken(msg.sender, amount_needed, amount, isReverse);
        uint256 liquidityMinted = liquidityToken.totalSupply() - liquidityBefore;
        _updateReserves();
        emit AddLiquidity(msg.sender, amount_needed, amount, liquidityMinted);
    }

    function removeLiquidity(uint256 liquidity) external {
        if (liquidity <= 0) {
            emit InsufficientLiquidityError(msg.sender, "INSUFFICIENT_LIQUIDITY_BURNED");
            revert("QswapPair: INSUFFICIENT_LIQUIDITY_BURNED");
        }
        if (liquidityToken.balanceOf(msg.sender) < liquidity) {
            emit InsufficientLiquidityError(msg.sender, "INSUFFICIENT_LIQUIDITY_BALANCE");
            revert("QswapPair: INSUFFICIENT_LIQUIDITY_BALANCE");
        }

        uint256 x = _reserveX;
        uint256 y = _reserveY;
        uint256 amount0;
        uint256 amount1;

        if (x == 0 || y == 0) {
            emit InsufficientLiquidityError(msg.sender, "INSUFFICIENT_LIQUIDITY");
            revert("QswapPair: INSUFFICIENT_LIQUIDITY");
        }

        amount0 = (x * liquidity) / _liquidityTokenReserve;
        amount1 = (y * liquidity) / _liquidityTokenReserve;
        
        if (amount0 == 0 || amount1 == 0) {
            emit InsufficientLiquidityError(msg.sender, "INSUFFICIENT_LIQUIDITY_BURNED");
            revert("QswapPair: INSUFFICIENT_LIQUIDITY_BURNED");
        }

        bool success = liquidityToken.transferFrom(msg.sender, address(this), liquidity);
        if (!success) {
            emit TransferError(msg.sender, "Liquidity token transfer failed");
            revert("QswapPair: TRANSFER_FAILED");
        }

        success = liquidityToken.burn(liquidity);
        if (!success) {
            emit TransferError(msg.sender, "Liquidity token burn failed");
            revert("QswapPair: BURN_FAILED");
        }

        _liquidityTokenReserve -= liquidity;

        success = _updateBalance(address(tokenX), address(this), msg.sender, amount0);
        if (!success) {
            emit TransferError(msg.sender, "First token transfer failed");
            revert("QswapPair: FIRST_TOKEN_TRANSFER_FAILED");
        }

        success = _updateBalance(address(tokenY), address(this), msg.sender, amount1);
        if (!success) {
            emit TransferError(msg.sender, "Second token transfer failed");
            revert("QswapPair: SECOND_TOKEN_TRANSFER_FAILED");
        }

        _updateReserves();
        emit RemoveLiquidity(msg.sender, amount0, amount1, liquidity);
        emit Sync(_reserveX, _reserveY);
    }

    function _updateBalance(address tokenAdress, address fromAddress, address toAddress, uint256 amount) private returns (bool) {
        try _tokenBalanceUpdater.updateBalance(tokenAdress, fromAddress, toAddress, amount) {
            return true;
        } catch {
            return false;
        }
    }

    function _getSwapOptions(uint256 amountToSwap, bool isReverse, address addressTokenToswap) private view returns (uint256 k, uint256 reserve2, address give, address get, uint256 effectiveAmountToSwap) {
        k = _reserveX * _reserveY;
        effectiveAmountToSwap = amountToSwap * 997 / 1000;

        if (isReverse) {
            reserve2 = _reserveX;
            give = addressTokenToswap;
            get = address(tokenY);
        } else {
            reserve2 = _reserveY;
            give = address(tokenX);
            get = addressTokenToswap;
        }
        return (k, reserve2, give, get, effectiveAmountToSwap);
    }

    function _getLiquidityOptions(bool isReverse) private view returns (uint256 x, uint256 y, address xAddress, address yAddress) {
        if (isReverse) {
            x = _reserveX;
            y = _reserveY;
            xAddress = address(tokenX);
            yAddress = address(tokenY);
        } else {
            x = _reserveY;
            y = _reserveX;
            xAddress = address(tokenY);
            yAddress = address(tokenX);
        }
        return (x, y, xAddress, yAddress);
    }

    function _updateReserves() private {
        _reserveX = _tokenBalanceUpdater.getTokenBalance(address(tokenX), address(this));
        _reserveY = _tokenBalanceUpdater.getTokenBalance(address(tokenY), address(this));
    }

    function _initGetLiquidityTokenAmount(uint256 xAmount, uint256 yAmount) private pure returns (uint256 amount) {
        require(xAmount > 0 && yAmount > 0, "Both amounts must be > 0");

        int128 x64 = ABDKMath64x64.fromUInt(xAmount);
        int128 y64 = ABDKMath64x64.fromUInt(yAmount);
        int128 product64 = x64.mul(y64);
        int128 sqrt64 = ABDKMath64x64.sqrt(product64);
        return ABDKMath64x64.toUInt(sqrt64);
    }

    function _mintLiquidityToken(address to, uint256 xAmount, uint256 yAmount, bool isReverse) private {
        uint256 xReserve;
        uint256 yReserve;
        
        if (!isReverse) {
            xReserve = _reserveX;
            yReserve = _reserveY;
        } else {
            xReserve = _reserveY;
            yReserve = _reserveX;
        }
        
        uint256 amount0 = (xAmount * _liquidityTokenReserve) / xReserve;
        uint256 amount1 = (yAmount * _liquidityTokenReserve) / yReserve;
        uint256 amount = _min(amount0, amount1);
        _liquidityTokenReserve += amount;
        liquidityToken.mint(to, amount);
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}
