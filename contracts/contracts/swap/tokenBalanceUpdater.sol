// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../token/token.sol";

contract TokenBalanceUpdater {

    function updateBalance(address tokenAdress, address fromAddress, address toAddress, uint256 amount) external {
        IERC20 token = IERC20(tokenAdress);
        require(token.transferFrom(fromAddress, toAddress, amount), "Transfer failed");
    }

    function getTokenBalance(address tokenAdress, address account) external view returns (uint256) {
        IERC20 token = IERC20(tokenAdress);
        return token.balanceOf(account);
    }
    
}