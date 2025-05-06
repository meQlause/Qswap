// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QswapTokenCreator {
    string public name;
    string public symbol;
    bool public isMintable;
    bool public isBurnable;
    uint256 public totalSupply;
    uint8 public decimals = 18;  

    // Mapping of addresses to their balances
    mapping(address => uint256) public balanceOf;

    // Mapping to track allowances
    mapping(address => mapping(address => uint256)) public allowance;

    // Events to log the transfer of tokens, approval, and minting/burning
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    // Constructor to initialize token properties
    constructor(uint256 initialSupply, string memory _name, string memory _symbol, bool _isMintable, bool _isBurnable) {
        isMintable = _isMintable;
        isBurnable = _isBurnable;
        name = _name;  // Set the name of the token
        symbol = _symbol;  // Set the symbol of the token
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Set the total supply
        balanceOf[msg.sender] = totalSupply;  // Assign all the tokens to the contract deployer
    }

    // Transfer function to send tokens to another address
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // Approve function for token allowance
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // TransferFrom function to transfer tokens from an approved address
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(balanceOf[sender] >= amount, "Insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");

        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    // Mint function to create new tokens and add them to the total supply
    function mint(address to, uint256 amount) public returns (bool) {
        require(isMintable, "Minting is not allowed");
        require(to != address(0), "Cannot mint to the zero address");

        totalSupply += amount;  // Increase the total supply
        balanceOf[to] += amount;  // Add the minted tokens to the recipient's balance
        emit Mint(to, amount);  // Emit the mint event
        return true;
    }

    // Burn function to destroy tokens and decrease the total supply
    function burn(uint256 amount) public returns (bool) {
        require(isBurnable, "Burning is not allowed");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");

        totalSupply -= amount;  // Decrease the total supply
        balanceOf[msg.sender] -= amount;  // Reduce the balance of the sender
        emit Burn(msg.sender, amount);  // Emit the burn event
        return true;
    }
}
