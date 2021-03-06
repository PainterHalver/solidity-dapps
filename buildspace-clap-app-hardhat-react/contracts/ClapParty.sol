// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ClapParty {
    mapping(address => uint256) clapCount;
    address[] public clappers;
    mapping(address => bool) clapped; // to avoid clappers having duplicate
    uint256 totalClaps;
    mapping(address => uint256) lastClappedAt;

    event NewClap(address indexed from, uint256 timestamp, string message);

    struct Clap {
        address clapper;
        uint256 timestamp;
        string message;
    }

    Clap[] claps;

    uint256 seed;

    constructor() payable {
        console.log("Hardhat is so cool we can use console.log here :D");
        seed = (block.difficulty + block.timestamp) % 100;
    }

    function clap(string memory _message) public {
        require(lastClappedAt[msg.sender] + 3 minutes < block.timestamp, "You can only clap once every 3 minutes");
        lastClappedAt[msg.sender] = block.timestamp;

        clapCount[msg.sender] += 1;
        totalClaps += 1;
        if (!clapped[msg.sender]) {
            clappers.push(msg.sender);
        }
        claps.push(Clap(msg.sender, block.timestamp, _message));
        console.log("%s has clapped with message %s", msg.sender, _message);
        emit NewClap(msg.sender, block.timestamp, _message);

        // Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;
        uint256 prizeAmount = 0.0001 ether;        
        if ((totalClaps % 5 == 0 || seed < 30) && prizeAmount < address(this).balance) {
            // No money no prize :D
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to send money from contract!");
        }
    }

    function getAllClaps() public view returns(Clap[] memory) {
        return claps;
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