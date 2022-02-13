//SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

// Get the latest BNB/USD price from chainlink price feed
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FundMe is Ownable {    
    // mapping to store which address depositeded how much BNB
    mapping(address => uint256) public addressToAmountFunded;
    // array of addresses who deposited
    address[] public funders;
    // priceFeed to get how much USD it is for a certain amount of BNB
    AggregatorV3Interface internal priceFeed;
    
    // the first person to deploy the contract is
    // the owner
    constructor() {
        // mainnet: 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE
        priceFeed = AggregatorV3Interface(0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526); // BNB/USD testnet price feed address
    }
    
    function fund() public payable {
    	// 18 digit number to be compared with donated amount
        // because funder can input either wei | gwei | bnb
        uint256 minimumUSD = 1 * 10 ** 17; // minimum of 0.1 USD
        //is the donated amount less than 0.1USD?
        require(getConversionRate(msg.value) >= minimumUSD, "The minimum donation amount is 0.1USD!");
        //if not, add to mapping and funders array
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
    
    // This function returns price without processing it, which means the price will have 8 trailing zeroes
    function getLatestPrice() public view returns(uint256){
        // The price feed has decimals: 8
        // So 1 BNB -> price / (10 ** 8) USD
        (,int256 price,,,) = priceFeed.latestRoundData();
         return uint256(price * (10 ** 10)); // 18 digits
    }
    
    // This function processes the price and answer how many USD you get for x BNB
    function getConversionRate(uint256 bnbAmount) public view returns (uint256){
        uint256 bnbPrice = getLatestPrice();
        uint256 bnbAmountInUsd = (bnbAmount * bnbPrice) / (10 ** 18);
        // the actual BNB/USD conversation rate, after adjusting the extra 0s
        return bnbAmountInUsd;
    }
    
    function withdraw() payable onlyOwner public {    
	    // payable(msg.sender).transfer(address(this).balance);
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send!");

       
        //iterate through all the mappings and make them 0
        //since all the deposited amount has been withdrawn
        for (uint256 i = 0; i < funders.length; i++){
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        //funders array will be initialized to 0
        funders = new address[](0);
    }
}