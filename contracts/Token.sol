  pragma solidity ^0.4.20;


  contract SafeMath {
      function safeAdd(uint a, uint b) public pure returns (uint c) {
          c = a + b;
          require(c >= a);
      }
      function safeSub(uint a, uint b) public pure returns (uint c) {
          require(b <= a);
          c = a - b;
      }
      function safeMul(uint a, uint b) public pure returns (uint c) {
          c = a * b;
          require(a == 0 || c / a == b);
      }
      function safeDiv(uint a, uint b) public pure returns (uint c) {
          require(b > 0);
          c = a / b;
      }
      function precisionDiv(uint a, uint b, uint precision) public pure returns (uint c) {
          require(b > 0);
          c = (a*precision) / b;
      }
  }


  contract Hashes1 {
  function returnWinnerAddress() public constant returns (address) {}
  function returnTotalVotes() public constant returns (uint) {}
  function returnTotalPhotos() public constant returns (uint) {}
  function numActions(uint x) public constant returns (uint){}
  function numParticipants() public constant returns (uint){}
  function getParticipant(uint x) public constant returns (address){}
  }

  contract MyToken is SafeMath{
      string public symbol;
      string public  name;
      uint8 public decimals;
      uint public _totalSupply;
      mapping(address => uint) balances;
      address public creator;
      Hashes1 public hashes;
      bool addressSet = false;
      address hash_addr;


      function MyToken() public {
          symbol = "RAC";
          name = "My Token";
          decimals = 18;
          _totalSupply = 100000000000000000000000000;
          creator = tx.origin;
          balances[creator] = _totalSupply;

      }

      function setAddress(address _hashesAddress) public {
          require(!addressSet);
          addressSet = true;
          hashes = Hashes1(_hashesAddress);
          hash_addr = _hashesAddress;
      }

      function returnCreator() public constant returns(address){
      	return creator;
      }

      function totalSupply() public constant returns (uint) {
          return _totalSupply;
      }

      function balanceOf(address tokenOwner) public constant returns (uint) {
          return balances[tokenOwner];
      }

      function transfer(address to, uint tokens) public returns (bool) {
          balances[tx.origin] = safeSub(balances[tx.origin], tokens);
          balances[to] = safeAdd(balances[to], tokens);
          return true;
      }

      function buy() public payable{
          creator.transfer(msg.value);
  	      uint tokens = msg.value * 100;
  	      balances[tx.origin] = safeAdd(balances[tx.origin], tokens);
  	      _totalSupply = safeAdd(_totalSupply, tokens);
      }

      function winner() internal constant returns (address){
          return hashes.returnWinnerAddress();
      }

      function activity() internal {
          uint total_votes = hashes.returnTotalVotes();
          uint total_photos = hashes.returnTotalPhotos();
          uint total_actions = total_votes + total_photos;
          for (uint i = 0; i < hashes.numParticipants(); i++){
            uint actions = hashes.numActions(i);
            if (actions > 0){
              uint reward = safeMul(precisionDiv(actions, total_actions, 100), 1e19);
              getCoins(hashes.getParticipant(i), reward);
            }
          }
      }

      function getCoins(address tokenOwner, uint amount) internal{
          balances[tokenOwner] = safeAdd(balances[tokenOwner], amount);
          _totalSupply = safeAdd(_totalSupply, amount);

      }

      function redeem() public{

          address roundWinner = winner();
          getCoins(roundWinner, 1e21);
          getCoins(tx.origin, 1e19);
          activity();

      }


  }
