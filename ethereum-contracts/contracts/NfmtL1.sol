// ©️ 2022 Dappros Ltd, project by Taras Filatov, Borys Bordunov, Mykhaylo Mohilyuk
// 🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦 "Never Forget" Memory/Meme Token 🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺🇦
// 👋 open source - feel free to fork/copy/reuse this smart contract for your needs 👋
// 📖 learn more at https://github.com/dappros/nfmt/ 📖

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFMT_L1 is ERC1155, ERC1155Supply, ReentrancyGuard, ERC1155Burnable {
    string public name;
    string public symbol;
    string[] public urls;

    address private _owner;

    uint[] public maxSupplies;
    uint public maxId;

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string[] memory urls_,
        uint[] memory maxSupplies_
    ) ERC1155("") {
        name = name_;
        symbol = symbol_;
        _owner = msg.sender;
        urls = urls_;
        maxSupplies = maxSupplies_;
        maxId = maxSupplies_.length;
    }

    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        uint _totalSupply = totalSupply(id);
        require(id <= maxId, 'id <= maxId');

        uint index = id - 1;

        require(
            (_totalSupply + amount) < maxSupplies[index],
            '(_totalSupply + amount) < maxSupplies[id - 1]'
        );

        _mint(to, id, amount, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return urls[tokenId - 1];
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
