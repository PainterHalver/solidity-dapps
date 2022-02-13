// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ClapParty {
    mapping(address => uint256) clapCount;
    address[] public clappers;
    mapping(address => bool) clapped; // to avoid clappers having duplicate
    uint256 totalClaps;

    constructor() {
        console.log("Hardhat is so cool we can use console.log here :D");
    }

    function clap() public {
        clapCount[msg.sender] += 1;
        totalClaps += 1;
        if (!clapped[msg.sender]) {
            clappers.push(msg.sender);
        }
        console.log("%s has clapped!", msg.sender);
    }

    function getTotalClaps() public view returns (uint256) {
        console.log("We have %d total claps!", totalClaps);
        return totalClaps;
    }

    function getClapGod() public view returns (address, uint256) {
        // If same amount of claps, clap god will be the first address
        address clapGod = clappers[0];
        uint256 maxClaps = clapCount[clapGod];
        for (uint i = 0; i < clappers.length; ++i) {
            if (clapCount[clappers[i]] > maxClaps) {
                clapGod = clappers[i];
                maxClaps = clapCount[clapGod];
            }
        }
        return (clapGod, maxClaps);
    }
}