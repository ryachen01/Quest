pragma solidity ^0.4.24;



contract Accounts{

address[] public accounts;
mapping(address => bool) created;



function accounts() public returns (uint){

    return accounts.length;


}
function createAccount() public {

	accounts.push(msg.sender);
	created[msg.sender] = true;


}

function getAccount(uint x) public returns (address){

	return accounts[x];
}
function isAccount(address tokenOwner) public returns (bool){

	return created[tokenOwner];

}


}
