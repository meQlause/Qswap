// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract TokenBalanceUpdater {

    function updateBalance(address tokenAdress, address fromAddress, address toAddress, uint256 amount) external {
        IERC20 token = IERC20(tokenAdress);
        uint256 scaledAmount = amount;
        require(token.transferFrom(fromAddress, toAddress, scaledAmount), "Transfer failed");
    }

    function getTokenBalance(address tokenAdress, address account) external view returns (uint256) {
        IERC20 token = IERC20(tokenAdress);
        return token.balanceOf(account);
    }
}