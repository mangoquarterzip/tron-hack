// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Vault.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PoSTerminal is Ownable {
    function transferAndCall(
        address vaultAddress,
        address tokenAddress,
        uint256 amount,
        bytes memory signature,
        address target,
        bytes memory data
    ) public onlyOwner {
        Vault(vaultAddress).transfer(tokenAddress, amount, signature);

        (bool success, ) = target.call(data);
        require(success, "call not successful");
    }

    function call(
        address payable addr,
        bytes memory data
    ) public payable onlyOwner {
        (bool success, ) = addr.call{value: msg.value}(data);
        require(success, "call not successful");
    }
}
