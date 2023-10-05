// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./VaultFactory.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Vault is Ownable {
    using ECDSA for bytes32;

    event Transfer(address indexed token, address indexed to, uint256 amount);
    VaultFactory private factory;

    address temporaryKey;

    function updateKey(address _key) public onlyOwner {
        _updateKey(_key);
    }

    function _updateKey(address _key) private {
        temporaryKey = _key;
    }

    constructor(address _key, address owner) {
        temporaryKey = _key;
        _transferOwnership(owner);
        factory = VaultFactory(msg.sender);
    }

    function getFactory() public view returns (address) {
        return address(factory);
    }

    function transfer(
        address addr,
        uint256 amount,
        bytes memory signature
    ) public payable {
        require(factory.isTerminal(msg.sender), "unauthorized");
        bytes32 signedMessageHash = keccak256(abi.encodePacked(addr, amount))
            .toEthSignedMessageHash();

        require(
            signedMessageHash.recover(signature) == temporaryKey,
            "invalid signature"
        );
        _updateKey(address(0));

        IERC20(addr).transfer(msg.sender, amount);
        emit Transfer(addr, msg.sender, amount);
    }

    function call(
        address payable addr,
        bytes memory data,
        bytes memory signature,
        address tokenAddress,
        uint256 amount
    ) public payable {
        require(factory.isTerminal(msg.sender), "unauthorized");

        bytes32 signedMessageHash = keccak256(
            abi.encodePacked(addr, msg.value, data)
        ).toEthSignedMessageHash();

        require(
            signedMessageHash.recover(signature) == temporaryKey,
            "invalid signature"
        );
        _updateKey(address(0));

        // You can send ether and specify a custom gas amount
        (bool success, ) = addr.call{value: msg.value}(data);
        require(success, "call not successful");
        emit Transfer(tokenAddress, msg.sender, amount);
    }
}
