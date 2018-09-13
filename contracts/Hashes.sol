pragma solidity ^0.4.24;
// We have to specify what version of compiler this code will compile with

import "Token.sol"


contract Hashes {







  //uint256 totalVotes;
  //address winnerAddress;
  //string winnerHash;

  struct hashes{
         string hash;
         address addr;
         uint index;
  }

  mapping (address => uint256) public votesReceived;
  mapping (address => hashes) public registry;
  address[] public participants;
  uint256 minTokens;
  Token myToken;

  function Hashes(uint256 _minTokens, address _myToken){
    minTokens = _minTokens;
    myToken = Token.at(_myToken);
  }

  //look into whether underscore notation is good form
  function addHash( string _ipfsHash, address _ipfsAddress) public {
         //need to add requirements
         require (myToken.balanceOf(tx.sender) > minTokens);
         hashes memory myHash;
         myHash.hash = _ipfsHash;
         myHash.addr = _ipfsAddress;
         myHash.index = participants.length;
         participants.push(tx.sender);
         registry[tx.sender] = myHash;
  }

  function voteForCandidate(address candidate) public {
  	require (keccak256(tx.sender) != keccak256(candidate));
  	votesReceived[candidate] += 1;
  	totalVotes += 1;
  }

  function getWinner() public {
  	uint random = uint((uint(keccak256(block.timestamp)) + block.number) % totalVotes);
  	uint num = 0;
  	uint winnerIndex = 0;
  	bool done = false;

  	for (uint i = 0; i < participants.length && !done; i++){
  		num += (votesReceived[list[i].add]);
  		if (num > random){
  			winnerIndex = i;
  			done = true;
      }
  	}
  	winnerHash = getList(winnerIndex);
  	winnerAddress = getAddress(winnerIndex);
  }

  function returnWinnerHash() constant returns (string){
  	return winnerHash;
  }
  
  function returnWinnerAddress() constant returns (address){
  	return winnerAddress;
  }

  function getList(uint256 x) constant returns (string){
  	return registry[participants[x]].hash;
  }

  function getAddress(uint256 x) constant returns (address){
  	return registry[participants[x]].addr;
  }

  function totalVotesFor(address x) constant returns(uint256){
  	return votesReceived[x];
  }

  function listLength() constant returns (uint256){
  	return participants.length;
  }

  function newRound() public {
    getWinner();
  }

}
