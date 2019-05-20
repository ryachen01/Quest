pragma solidity ^0.5.0;
// We have to specify what version of compiler this code will compile with

import "../contracts/Token.sol";
import "../contracts/Trophies.sol";

contract Hashes{

  uint16 totalVotes;
  uint16 totalPhotos;
  address winnerAddress;
  string winnerHash;
  string winnerCaption;

  struct hashes{
         string hash;
         string caption;
         address addr;
  }

  struct properties{
      uint16 votesReceived;
      uint16 actionsDone;
      uint16 photosPosted;
      string name;
      string profileName;
      string profileImage;
      hashes registry;
      bool participated;
      mapping(uint256 => hashes) allPosts;
      mapping(address => mapping (uint256 => bool)) votedFor;
  }

  mapping(address => properties) address_properties;
  mapping(string => bool) nameTaken;
  address[] public participants;
  address[] public all_participants;
  uint minTokens;
  MyToken token;
  //MyTrophy trophy;
  address payable token_address;
  uint pastBlockNumber;
  uint rewardScalar;





  constructor(uint _minTokens, address payable _myToken, address _myTrophy) public{
    minTokens = _minTokens;
    token = MyToken(_myToken);
    token_address = _myToken;
    token.setAddress(address(this));
    //trophy = MyTrophy(_myTrophy);
    //trophy.setAddress(address(this));
    pastBlockNumber = block.number;

  }

  function addHash(string memory _ipfsHash, string memory _caption, address _ipfsAddress) public enoughCoins validAccount{
     require (bytes(_ipfsHash).length == 46);
     require (bytes(_caption).length < 20);
     require (address_properties[msg.sender].registry.addr == address(0));
     hashes memory myHash;
     myHash.hash = _ipfsHash;
     myHash.addr = _ipfsAddress;
     myHash.caption = _caption;
     address_properties[msg.sender].registry = myHash;
     address_properties[msg.sender].allPosts[address_properties[msg.sender].photosPosted] = myHash;
     totalPhotos += 1;
     address_properties[msg.sender].photosPosted += 1;
     address_properties[msg.sender].actionsDone += 1;
     participants.push(msg.sender);
  }

  modifier enoughCoins() {
		if (!(token.balanceOf(msg.sender) > minTokens)) revert();
		_;
	}

  modifier validAccount() {
		if (!(address_properties[msg.sender].participated)) revert();
		_;
	}

  function voteForCandidate(address candidate) public enoughCoins validAccount{
  	require (keccak256(abi.encodePacked(msg.sender)) != keccak256(abi.encodePacked(candidate)));
    require (address_properties[msg.sender].votedFor[candidate][address_properties[candidate].photosPosted] == false);
    address_properties[msg.sender].votedFor[candidate][address_properties[candidate].photosPosted] = true;
    address_properties[candidate].votesReceived += 1;
    address_properties[msg.sender].actionsDone += 1;
  	totalVotes += 1;

  }

  function registerAccount(string memory _name, string memory _profileName, string memory _ipfsHash) public payable{
     require (!address_properties[msg.sender].participated);
     require (bytes(_name).length < 25);
     require (bytes(_profileName).length < 20);
     require (!nameTaken[_name]);
     //require (bytes(_ipfsHash).length == 46);
     address_properties[msg.sender].name = _name;
     address_properties[msg.sender].profileName = _profileName;
     address_properties[msg.sender].profileImage = _ipfsHash;
     nameTaken[_name] = true;
     address_properties[msg.sender].participated = true;
     all_participants.push(msg.sender);
     token.buy.value(msg.value)();
     token.transfer(msg.sender, msg.value*2000);

  }

  function accountRegistered() public view returns (bool){
    return (address_properties[msg.sender].participated);
  }

  function voteByIndex(uint candidate_index) public enoughCoins validAccount{
    require(candidate_index >= 0);
    require(candidate_index < participants.length);
  	voteForCandidate(participants[candidate_index]);
  }

  function voteForListByIndex(uint[] memory candidates_indexes) public enoughCoins validAccount{
    for (uint i = 0; i < candidates_indexes.length; i++){
        voteByIndex(candidates_indexes[i]);
    }
  }

  function bitSet(byte b, byte a) public returns (bool){
    return (b & a == a);
  }

  function voteForListByBitString(uint n, uint shift) public{
    require(shift >= 0);
    require(n >= 0);

    bytes32 byteArray = bytes32(n);
    for (uint i = 0; i < byteArray.length; i++){
        byte temp = byteArray[i];
        if (uint8(temp) != 0){
            for (uint j = 0; j < 8; j++){
              uint8 num = uint8(2 ** j);
              byte value = byte(num);
              if (bitSet(temp, value)){
                voteByIndex(8*(31 - i)+j+shift*256);
              }
            }
        }
    }
  }


  function getWinner() internal {
    uint random = uint((uint(keccak256(abi.encodePacked((block.timestamp)))) + block.number) % totalVotes);
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
    winnerCaption = getCaption(winnerIndex);

  }

  function returnWinnerHash() public view returns (string memory){
  	return winnerHash;
  }

  function returnWinnerAddress() public view returns (address){
  	return winnerAddress;
  }

  function returnWinnerCaption() public view returns (string memory){
  	return winnerCaption;
  }


  function getList(uint x) public view returns (string memory){
  	return address_properties[participants[x]].registry.hash;
  }

  function viewPhotos(address _owner, uint index) public view returns (string memory){
  	return address_properties[_owner].allPosts[index].hash;
  }

  function viewCaption(address _owner, uint index) public view returns (string memory){
    return address_properties[_owner].allPosts[index].caption;
  }

  function getListByAddress(address x) public view returns (string memory){
  	return address_properties[x].registry.hash;
  }

  function getCaption(uint x) public view returns (string memory){
    return address_properties[participants[x]].registry.caption;
  }

  function getAddress(uint x) public view returns (address){
  	return address_properties[participants[x]].registry.addr;
  }

  function returnTotalVotes() public view returns (uint){
    return totalVotes;
  }

  function returnTotalPhotos() public view returns (uint){
    return totalPhotos;
  }

  function totalVotesFor(address x) public view returns(uint){
  	return address_properties[x].votesReceived;
  }

  function listLength() public view returns (uint){
  	return participants.length;
  }

  function numParticipants() public view returns (uint){
    return all_participants.length;
  }

  function likedPhoto(address x) public view returns (bool){
    return address_properties[msg.sender].votedFor[x][address_properties[x].photosPosted];
  }

  function getParticipant(uint x) public view returns (address){
    return all_participants[x];
  }

  function numActions(uint x) public view returns (uint){
    return address_properties[all_participants[x]].actionsDone;
  }

  function totalVotesReceived(address x) public view returns(uint){
    return address_properties[x].votesReceived;
  }

  function totalPhotosPosted(address x) public view returns(uint){
    return address_properties[x].photosPosted;
  }

  /* function totalTrophies(address x) public view returns(uint){
    return trophy.balanceOf(x);
  } */

  function getUserName (address x) public view returns(string memory){
    return address_properties[x].name;
  }
  function getProfileName (address x) public view returns(string memory){
    return address_properties[x].profileName;
  }
  function getProfileImage (address x) public view returns(string memory){
    return address_properties[x].profileImage;
  }
  function isNameTaken (string memory _name) public view returns(bool){
    return (nameTaken[_name]);
  }
  function alreadyPosted (address x) public view returns(bool){
    return (address_properties[msg.sender].registry.addr == address(0));
  }

  function newRound() public{
    uint timeSince = getTime();

    require(timeSince >= 6000);
    require(timeSince <= 7000);

    getWinner();
    token.redeem();
    hashes memory myHash;
    for (uint i = 0; i < participants.length; i++){
      address_properties[participants[i]].registry = myHash;
    }
    participants.length = 0;
    pastBlockNumber = block.number;
  }

  function getTime() public view returns(uint){
    return (block.number - pastBlockNumber);
  }


}
