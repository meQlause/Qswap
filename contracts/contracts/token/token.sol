// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract QswapTokenCreator is IERC20 {
    string public name;
    string public symbol;
    bool public isMintable;
    bool public isBurnable;
    uint256 public totalSupply;
    uint8 public decimals = 18;  

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    constructor(uint256 initialSupply, string memory _name, string memory _symbol, bool _isMintable, bool _isBurnable) {
        isMintable = _isMintable;
        isBurnable = _isBurnable;
        name = _name;  
        symbol = _symbol;  
        totalSupply = initialSupply * 10 ** uint256(decimals);  
        balanceOf[msg.sender] = totalSupply;  
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {        
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(balanceOf[sender] >= amount, "Insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");

        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(address to, uint256 amount) public returns (bool) {
        require(isMintable, "Minting is not allowed");
        require(to != address(0), "Cannot mint to the zero address");

        totalSupply += amount;  
        balanceOf[to] += amount;  
        emit Mint(to, amount);  
        return true;
    }

    function burn(uint256 amount) public returns (bool) {
        require(isBurnable, "Burning is not allowed");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");

        totalSupply -= amount;
        balanceOf[msg.sender] -= amount;  
        emit Burn(msg.sender, amount);  
        return true;
    }
}
