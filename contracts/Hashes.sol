pragma solidity ^0.4.20;
// We have to specify what version of compiler this code will compile with

import "Token.sol";
import "Trophies.sol";

contract Hashes{

  uint16 totalVotes;
  uint16 totalPhotos;
  address winnerAddress;
  string winnerHash;

  struct hashes{
         string hash;
         string caption;
         address addr;
  }

  struct properties{
      uint16 votesReceived;
      uint16 actionsDone;
      hashes registry;
      bool participated;
  }

  mapping(address => properties) address_properties;
  address[] public participants;
  address[] public all_participants;
  uint minTokens;
  MyToken token;
  MyTrophy trophy;





  function Hashes(uint _minTokens, address _myToken, address _myTrophy){
    minTokens = _minTokens;
    token = MyToken(_myToken);
    token.setAddress(address(this));
    trophy = MyTrophy(_myTrophy);
    trophy.setAddress(address(this));

  }

  function addHash(string _ipfsHash, string _caption, address _ipfsAddress) public enoughCoins{
     require (bytes(_ipfsHash).length == 46);
     require (bytes(_caption).length < 100);
     require (address_properties[msg.sender].registry.addr == address(0));
     hashes memory myHash;
     myHash.hash = _ipfsHash;
     myHash.addr = _ipfsAddress;
     myHash.caption = _caption;
     address_properties[msg.sender].registry = myHash;
     totalPhotos += 1;
     address_properties[msg.sender].actionsDone += 1;
     participants.push(msg.sender);
  }

  modifier enoughCoins() {
		if (!(token.balanceOf(msg.sender) > minTokens)) revert();
		_;
	}

  function voteForCandidate(address candidate) public enoughCoins{
  	require (keccak256(msg.sender) != keccak256(candidate));
    address_properties[candidate].votesReceived += 1;
    address_properties[msg.sender].actionsDone += 1;
  	totalVotes += 1;


  }

  function registerAccount() public {
     require (!address_properties[msg.sender].participated);
     address_properties[msg.sender].participated = true;
     all_participants.push(msg.sender);
     token.buy();
  }

  function accountRegistered() public constant returns (bool){
    return (address_properties[msg.sender].participated);
  }

  function voteByIndex(uint candidate_index) public enoughCoins{
  	voteForCandidate(participants[candidate_index]);
  }

  function voteForListByIndex(uint[] candidates_indexes){
    for (uint i = 0; i < candidates_indexes.length; i++){
        voteByIndex(candidates_indexes[i]);
    }
  }

  function getWinner() internal {
  	uint random = uint((uint(keccak256(block.timestamp)) + block.number) % totalVotes);
  	uint num = 0;
  	uint winnerIndex = 0;
  	bool done = false;

  	for (uint i = 0; i < participants.length && !done; i++){
  		num += (address_properties[participants[i]].votesReceived);
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
  	return address_properties[participants[x]].registry.hash;
  }
  function getListByAddress(address x) public constant returns (string){
  	return address_properties[x].registry.hash;
  }

  function getCaption(uint x) public constant returns (string){
    return address_properties[participants[x]].registry.caption;
  }

  function getAddress(uint x) public constant returns (address){
  	return address_properties[participants[x]].registry.addr;
  }

  function returnTotalVotes() public constant returns (uint){
    return totalVotes;
  }

  function returnTotalPhotos() public constant returns (uint){
    return totalPhotos;
  }

  function totalVotesFor(address x) public constant returns(uint){
  	return address_properties[x].votesReceived;
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
    return address_properties[all_participants[x]].actionsDone;
  }

  function newRound() public enoughCoins{
    getWinner();
    token.redeem();
  }

}
