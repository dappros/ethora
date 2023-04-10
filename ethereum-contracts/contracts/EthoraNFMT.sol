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

contract EthoraNFMT is ERC1155, Pausable, ERC1155Supply, ReentrancyGuard, ERC1155Burnable {
    string public name;
    string[] public urls;

    uint public maxId;

    address private _owner;
    address[] public beneficiaries;
    address public coinAddress;

    uint[] public splitPercents;
    uint[] public maxSupplies;
    uint[] public costs;

    mapping(address => uint) public balances;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    constructor(
        address owner_,
        string memory name_,
        string[] memory urls_,
        address[] memory beneficiaries_,
        uint[] memory splitPercents_,
        uint[] memory maxSupplies_,
        uint[] memory costs_
    ) ERC1155("") {
        require(beneficiaries_.length > 0 && beneficiaries_.length < 4, 'beneficiaries_.length');
        require(costs_.length == maxSupplies_.length, 'costs_.length == maxSupplies_.length');
        _transferOwnership(owner_);
        _owner = owner_;
        beneficiaries = beneficiaries_;
        splitPercents = splitPercents_;
        urls = urls_;
        maxSupplies = maxSupplies_;
        maxId = maxSupplies_.length;
        costs = costs_;
        name = name_;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(uint256 id, uint256 amount, address target) public payable {
        uint _totalSupply = totalSupply(id);
        require(id <= maxId, 'id <= maxId');

        uint index = id - 1;

        require(
            (_totalSupply + amount) < maxSupplies[index],
            '(_totalSupply + amount) < maxSupplies[id - 1]'
        );

        if (costs[index] == 0) {
            return _mint(target, id, amount, "");
        } else {
            uint totalCost = costs[index] * amount;

            require(msg.value >= totalCost, "msg.value >= totalCost");
            uint length = beneficiaries.length;
            for (uint i=0; i < length;) {
                uint benAmount = totalCost * splitPercents[i] / 1000;
                balances[beneficiaries[i]] += benAmount;
                unchecked {
                    ++i;
                }
            }
            return _mint(target, id, amount, "");
        }
    }

    function withdraw(address to_) public nonReentrant {
        require(balances[to_] != 0, "");
        payable(to_).transfer(balances[to_]);
        balances[to_] = 0;
        return;
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
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
