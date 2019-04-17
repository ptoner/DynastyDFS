pragma solidity ^0.5.0;

contract League {

    address private commish;

    constructor() public {
        commish = msg.sender;
    }
    
}




