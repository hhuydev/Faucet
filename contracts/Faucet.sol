// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    uint public numOfFunders;
    mapping(uint => address) public lutFunders;
    mapping(address => bool) public funders;

    receive() external payable {}

    function addFunds() external payable {
        if(!funders[msg.sender]) {
            uint index = numOfFunders++;
            funders[msg.sender] = true;
            lutFunders[index] = msg.sender;
        }
    }

    function getFunderIndex(uint index) external view returns(address) {
        return lutFunders[index];
    }

    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for(uint i=0; i< numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function withDraw(uint withdrawAmount) external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    modifier limitWithdraw(uint withdrawAmount) {
        require(withdrawAmount <=1 * (10**18), "Cannot withdraw more than 1ETH");
        _;
    }
}