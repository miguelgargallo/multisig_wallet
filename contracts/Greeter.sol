//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.13;

import "./console.sol";

contract Greeter {
    string private greeting;
    event NewGreeting(address sender, string newGreeting); 
    event InitGreeting(address sender, string newGreeting); 

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
        emit InitGreeting(msg.sender, _greeting);
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
        emit NewGreeting(msg.sender, _greeting);
    }
      fallback() external {
         console.log("fallback() called, msg.data=");
         console.logBytes(msg.data);
     }
}
