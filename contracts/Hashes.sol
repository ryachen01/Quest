pragma solidity ^0.4.20;
// We have to specify what version of compiler this code will compile with

import "contracts/Token.sol";

contract Hashes {

  uint totalVotes;
  address winnerAddress;
  string winnerHash;

  struct hashes{
         string hash;
         address addr;
         uint index;
  }

  // uint timestamp

  mapping (address => uint256) public votesReceived;
  mapping (address => hashes) public registry;
  address[] public participants;
  uint256 minTokens;
  MyToken token;
  address _tokenAddress;

  function Hashes(uint256 _minTokens, address _myToken){
    minTokens = _minTokens;
    token = MyToken(_myToken);
    _tokenAddress = _myToken;
    //timestamp = block.height + 6000;
  }

  //look into whether underscore notation is good form
  function addHash(string _ipfsHash, address _ipfsAddress) public enoughCoins{
         hashes memory myHash;
         myHash.hash = _ipfsHash;
         myHash.addr = _ipfsAddress;
         myHash.index = participants.length;
         participants.push(msg.sender);
         registry[msg.sender] = myHash;
  }

  modifier enoughCoins() {
		if (!(token.balanceOf(msg.sender) > minTokens)) revert();
		_;
	}

  function total() public returns (uint) {
      return token.totalSupply();
  }

  function tokenAddress() public returns (address) {
      return _tokenAddress;
  }
  function getBalance() public constant returns (uint) {
      return token.balanceOf(msg.sender);
  }
  function sender() public constant returns (address){
      return msg.sender;
  }

  function voteForCandidate(address candidate) public enoughCoins{
  	require (keccak256(msg.sender) != keccak256(candidate));
  	votesReceived[candidate] += 1;
  	totalVotes += 1;
  }

  function getWinner() internal {
  	uint random = uint((uint(keccak256(block.timestamp)) + block.number) % totalVotes);
  	uint num = 0;
  	uint winnerIndex = 0;
  	bool done = false;

  	for (uint i = 0; i < participants.length && !done; i++){
  		num += (votesReceived[participants[i]]);
  		if (num > random){
  			winnerIndex = i;
  			done = true;
      }
  	}
  	winnerHash = getList(winnerIndex);
  	winnerAddress = getAddress(winnerIndex);
  }

  function returnWinnerHash() public constant returns (string){
  	return winnerHash;
  }

  function returnWinnerAddress() public constant returns (address){
  	return winnerAddress;
  }

  function getList(uint256 x) public constant returns (string){
  	return registry[participants[x]].hash;
  }

  function getAddress(uint256 x) public constant returns (address){
  	return registry[participants[x]].addr;
  }

  function totalVotesFor(address x) public constant returns(uint256){
  	return votesReceived[x];
  }

  function listLength() public constant returns (uint256){
  	return participants.length;
  }

  function newRound() public enoughCoins{
    //require(block.height > timestamp);
    getWinner();
    //timestamp = timestamp + 6000;
  }

}
