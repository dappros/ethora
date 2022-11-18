// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Doc {
    string[] public files;
    address payable public owner;
    address public admin;
    bool public isBurnable;
    bool public isTransferable;
    bool public isFilesMutableByAdmin;
    bool public isFilesMutableByOwner;
    bool public isSignable;
    bool public isSignatureRevocable;

    mapping(address => bool) public signers;

    constructor(
        string[] memory _files,
        address payable _owner,
        bool isBurnable_,
        bool isTransferable_,
        bool isFilesMutableByAdmin_,
        bool isFilesMutableByOwner_,
        bool isSignable_,
        bool isSignatureRevocable_
    ) {
        files = _files;
        owner = _owner;
        admin = msg.sender;
        isBurnable = isBurnable_;
        isTransferable = isTransferable_;
        isFilesMutableByAdmin = isFilesMutableByAdmin_;
        isFilesMutableByOwner = isFilesMutableByOwner_;
        isSignable = isSignable_;
        isSignatureRevocable = isSignatureRevocable_;
    }

    function changeFilesByAdmin(string[] memory _files) public {
        require(
            isFilesMutableByAdmin && msg.sender == admin,
            "changeFilesByAdmin require"
        );
        files = _files;
    }

    function transfer(address payable to) public {
        require(isTransferable, "contract is not transferrable ");
        require(msg.sender == owner, "only for owner");
        require(to != address(0), "");
        owner = to;
    }

    function burn() public {
        require(msg.sender == owner, "");
        selfdestruct(owner);
    }

    function changeFilesByOwner(string[] memory _files) public {
        require(
            isFilesMutableByOwner && msg.sender == owner,
            "changeFilesByOwner require"
        );
        files = _files;
    }

    function sign() public {
        require(isSignable, "contract is not signable");
        signers[msg.sender] = true;
    }

    function revokeSign() public {
        require(isSignatureRevocable, "revokeSign is not allowed");
        signers[msg.sender] = false;
    }

    function destruct(address payable to) public {
        require(msg.sender == owner, "only for owner");
        selfdestruct(to);
    }
}
