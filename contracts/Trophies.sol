pragma solidity ^0.5.0;

import "../contracts/Token.sol";
import "../contracts/SafeMath.sol";
import "../contracts/ERC721.sol";

contract MyTrophy is ERC721{

  using SafeMath for uint256;

  string public symbol;
  string public  name;
  uint8 public decimals;
  uint public _totalSupply;
  address public creator;
  mapping(address => uint) balances;
  mapping(uint256 => address) tokenOwners;
  mapping(uint256 => bool) tokenExists;
  mapping(uint256 => string) tokenLinks;
  mapping(uint256 => uint) trophyValue;
  mapping (address => uint256[]) ownedTokens;
  mapping(address => mapping (uint256 => bool)) tokenRedeemed;
  Hashes1 public hashes;
  bool addressSet;


  constructor() public {
      symbol = "TRP";
      name = "My Trophy";
      decimals = 0;
      _totalSupply = 0;
      creator = msg.sender;
      balances[creator] = _totalSupply;
      addressSet = false;

  }

  function setAddress(address _hashesAddress) public {
      require(!addressSet);
      addressSet = true;
      hashes = Hashes1(_hashesAddress);

  }

  function totalSupply() public view returns (uint) {
      return _totalSupply;
  }

  function balanceOf(address _tokenOwner) public view returns (uint) {
      return balances[_tokenOwner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address owner) {
    require(tokenExists[_tokenId]);
    return tokenOwners[_tokenId];
  }

  function transfer(address _to, uint256 _tokenId) public{
    address currentOwner = msg.sender;
    address newOwner = _to;
    require(tokenExists[_tokenId]);
    require(currentOwner == ownerOf(_tokenId));
    require(currentOwner != newOwner);
    require(newOwner != address(0));
    balances[currentOwner] = balances[currentOwner].sub(1);
    tokenOwners[_tokenId] = newOwner;
    balances[newOwner] = balances[newOwner].add(1);

    emit Transfer(msg.sender, _to, _tokenId);

  }

  function tokenMetadata(uint256 _tokenId) public view returns (string memory infoUrl) {
    require(tokenExists[_tokenId]);
    return tokenLinks[_tokenId];
  }

  function tokenValue(uint256 _tokenId) public view returns (uint value) {
    require(tokenExists[_tokenId]);
    return trophyValue[_tokenId];
  }

  function tokensOfOwner(address _tokenOwner) public view returns (uint256[] memory tokenIds){
    return ownedTokens[_tokenOwner];
  }

  function createTrophy(string memory _trophyLink) public {

    address tokenOwner = msg.sender;
    address winner = hashes.returnWinnerAddress();
    require (keccak256(abi.encodePacked(tokenOwner)) == keccak256(abi.encodePacked(winner)));
    require (tokenRedeemed[winner][_totalSupply] == false);
    tokenRedeemed[winner][_totalSupply] = true;
    uint256 tokenIndex = _totalSupply.add(1);
    balances[tokenOwner] = balances[tokenOwner].add(1);
    tokenExists[tokenIndex] = true;
    tokenOwners[tokenIndex] = tokenOwner;
    tokenLinks[tokenIndex] = _trophyLink;
    ownedTokens[tokenOwner].push(tokenIndex);
    uint value = hashes.totalVotesFor(winner);
    trophyValue[tokenIndex] = value;
    emit Transfer(address(0), tokenOwner, tokenIndex);

  }

}
