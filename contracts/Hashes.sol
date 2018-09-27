pragma solidity ^0.4.20;
// We have to specify what version of compiler this code will compile with

import "contracts/Token.sol";


contract Hashes{

  uint totalVotes;
  uint totalPhotos;
  address winnerAddress;
  string winnerHash;

  struct hashes{
         string hash;
         string caption;
         address addr;

  }


  mapping (address => uint) public votesReceived;
  mapping (address => uint) public actionsDone;
  mapping (address => hashes) public registry;
  mapping (address => bool) public participated;
  address[] public participants;
  address[] public all_participants;
  uint minTokens;
  MyToken token;
  address _tokenAddress;


  function Hashes(uint _minTokens, address _myToken){
    minTokens = _minTokens;
    token = MyToken(_myToken);
    token.setAddress(address(this));
    _tokenAddress = _myToken;

  }

  function addHash(string _ipfsHash, string _caption, address _ipfsAddress) public enoughCoins{
         require (bytes(_ipfsHash).length == 46);
         require (bytes(_caption).length < 100);
         hashes memory myHash;
         myHash.hash = _ipfsHash;
         myHash.addr = _ipfsAddress;
         myHash.caption = _caption;
         registry[tx.origin] = myHash;
         totalPhotos += 1;
         actionsDone[tx.origin] += 1;
         participants.push(tx.origin);
         if (!participated[tx.origin]){
            participated[tx.origin] = true;
            all_participants.push(tx.origin);
         }

  }

  modifier enoughCoins() {
		if (!(token.balanceOf(tx.origin) > minTokens)) revert();
		_;
	}

  function sender() public constant returns (address){
      return tx.origin;
  }

  function voteForCandidate(address candidate) public enoughCoins{
  	require (keccak256(tx.origin) != keccak256(candidate));
  	votesReceived[candidate] += 1;
  	totalVotes += 1;
    actionsDone[tx.origin] += 1;
    if (!participated[tx.origin]){
       participated[tx.origin] = true;
       all_participants.push(tx.origin);
    }
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

  function getList(uint x) public constant returns (string){
  	return registry[participants[x]].hash;
  }

  function getCaption(uint x) public constant returns (string){
    return registry[participants[x]].caption;
  }

  function getAddress(uint x) public constant returns (address){
  	return registry[participants[x]].addr;
  }

  function returnTotalVotes() public constant returns (uint){
    return totalVotes;
  }

  function returnTotalPhotos() public constant returns (uint){
    return totalPhotos;
  }

  function totalVotesFor(address x) public constant returns(uint){
  	return votesReceived[x];
  }

  function listLength() public constant returns (uint){
  	return participants.length;
  }

  function numParticipants() public constant returns (uint){
    return all_participants.length;
  }

  function getParticipant(uint x) public constant returns (address){
    return all_participants[x];
  }

  function numActions(uint x) public constant returns (uint){
    return actionsDone[all_participants[x]];
  }

  function newRound() public enoughCoins{
    getWinner();
    token.redeem();
  }

}
