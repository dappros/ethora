// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EthoraCoin is ERC20, ERC20Burnable, Ownable {
    // init claim 5 Ethora Coins
    uint public maxClaim = 5000000000000000000;
    // init coefficient 1 Matic = 100 Ethora Coin
    uint public coefficient = 100;

    mapping (address => bool) public hadClaimed;

    constructor(string memory name, string memory symbol, uint amount) ERC20(name, symbol) {
        _mint(msg.sender, amount * 10 ** decimals());
    }

    function mintOwner(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function setCoefficient(uint newCoefficient) public onlyOwner {
        coefficient = newCoefficient;
    }

    function setClaim(uint amount) public onlyOwner {
        maxClaim = amount;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function mint(address to) payable public {
        require(msg.value != 0, "msg.value != 0");
        uint amout = msg.value * coefficient;
        _mint(to, amout);
    }

    function claim() public {
        require(hadClaimed[msg.sender] == false && maxClaim > 0, 'hadClaimed[msg.sender] == false && maxClaim > 0');
        _mint(msg.sender, 5000000000000000000);
        hadClaimed[msg.sender] = true;
    }
}