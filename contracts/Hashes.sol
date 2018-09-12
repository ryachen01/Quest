pragma solidity ^0.4.24;
// We have to specify what version of compiler this code will compile with



contract Hashes {



  struct hashes{
         string hash;
         address addr;
  }


  mapping (address => uint256) public votesReceived;
  uint256 totalVotes;
  address winnerAddress;
  string winnerHash;
  hashes[] public list;




  function addHash( string ipfsHash, address ipfsAddress) public returns (bool){

         hashes memory myHash;
         myHash.hash = ipfsHash;
         myHash.addr = ipfsAddress;
         list.push(myHash);

         return true;
  }
  function voteForCandidate(address candidate) public returns (bool) {
  	if (keccak256(msg.sender) != keccak256(candidate)){
  	votesReceived[candidate] += 1;
  	totalVotes += 1;
  	return true;
  	}
  	return false;
  }


  function getWinner() public returns (bool){


  	uint random = uint((uint(keccak256(block.timestamp)) + block.number) % totalVotes);
  	uint num = 0;
  	uint winnerIndex = 0;
  	bool done = false;
  	for (uint i = 0; i < list.length; i++){
  		num += (votesReceived[list[i].add]);
  		if (num > random && done == false){
  			winnerIndex = i;
  			done = true;
  }

  	}


  	winnerHash = getList(winnerIndex);
  	winnerAddress = getAddress(winnerIndex);
  	return true;
  }


  function returnWinnerHash() constant returns (string){
  	return winnerHash;
  }
  function returnWinnerAddress() constant returns (address){

  	return winnerAddress;
  }


  function getList(uint256 x) constant returns (string){

  	return list[x].hash;
  }

  function totalVotesFor(address x) constant returns(uint256){


  	return votesReceived[x];
  }



  function getAddress(uint256 x) constant returns (address){

  	return list[x].add;
  }

  function listLength() constant returns (uint256){
  	return list.length;
  }


  function newRound() public returns (bool){

  getWinner();


  return true;

  }



}
