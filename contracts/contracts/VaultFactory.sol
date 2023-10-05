// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./Vault.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract VaultFactory is Ownable {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;

    // Declare a set state variable
    EnumerableSet.AddressSet private terminals;

    // vault owners. One per owner
    mapping(address => address) private vaults;

    function deploy(address key) public {
        require(vaults[msg.sender] == address(0), "vault already exists");
        Vault vault = new Vault(key, msg.sender);
        vaults[msg.sender] = address(vault);
    }

    function addTerminal(address terminal) public onlyOwner {
        terminals.add(terminal);
    }

    function remove(address terminal) public onlyOwner {
        terminals.remove(terminal);
    }

    function isTerminal(address terminal) public view returns (bool) {
        return terminals.contains(terminal);
    }

    function getVault(address owner) public view returns (address) {
        return vaults[owner];
    }
}
