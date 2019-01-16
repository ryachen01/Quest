pragma solidity ^0.5.0;


import "../contracts/SafeMath.sol";
import "../contracts/ERC20.sol";

  contract Hashes1 {
    function returnWinnerAddress() public view returns (address);
    function returnTotalVotes() public view returns (uint);
    function returnTotalPhotos() public view returns (uint);
    function numActions(uint x) public view returns (uint);
    function numParticipants() public view returns (uint);
    function getParticipant(uint x) public view returns (address);
    function totalVotesFor(address x) public view returns(uint);

  }

  contract MyToken is ERC20{

      using SafeMath for uint256;

      string public symbol;
      string public  name;
      uint8 public decimals;
      uint public _totalSupply;
      mapping(address => uint) balances;
      mapping(address => mapping (address => uint256)) allowed;
      address payable public creator;
      Hashes1 public hashes;
      bool addressSet = false;



     constructor() public {
          symbol = "RAC";
          name = "My Token";
          decimals = 18;
          _totalSupply = 100000000000000000000000000;
          creator = msg.sender;
          balances[creator] = _totalSupply;

      }

      function setAddress(address _hashesAddress) external {
          require(!addressSet);
          addressSet = true;
          hashes = Hashes1(_hashesAddress);

      }

      function returnCreator() public view returns(address){
      	return creator;
      }

      function totalSupply() public view returns (uint) {
          return _totalSupply;
      }

      function balanceOf(address tokenOwner) public view returns (uint balance) {
          return balances[tokenOwner];
      }

      function transfer(address to, uint tokens) public{

          address tokenOwner = msg.sender;
          balances[tokenOwner] = balances[tokenOwner].sub(tokens);
          balances[to] = balances[to].add(tokens);
          emit Transfer(msg.sender, to, tokens);

      }

      function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
      }

      function approve(address spender, uint tokens) public{
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
      }

      function transferFrom(address from, address to, uint tokens) public{
       balances[from] = balances[from].sub(tokens);
       allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
       balances[to] = balances[to].add(tokens);
       emit Transfer(from, to, tokens);

      }

      function buy() public payable {

          creator.transfer(msg.value);
  	      uint tokens = msg.value * 500;
  	      balances[msg.sender] = balances[msg.sender].add(tokens);
  	      _totalSupply = _totalSupply.add(tokens);
          emit Transfer(address(0), msg.sender, tokens);

      }

      function winner() internal view returns (address){
          return hashes.returnWinnerAddress();
      }

      function precisionDiv(uint a, uint b, uint precision) internal pure returns (uint c) {
          require(b > 0);
          c = (a*precision) / b;
      }

      function activity() internal {
          uint total_votes = hashes.returnTotalVotes();
          uint total_photos = hashes.returnTotalPhotos();
          uint total_actions = total_votes + total_photos;
          for (uint i = 0; i < hashes.numParticipants(); i++){
            uint actions = hashes.numActions(i);
            if (actions > 0){
              uint reward = (precisionDiv(actions, total_actions, 100)).mul(1e20);
              getCoins(hashes.getParticipant(i), reward);
            }
          }
      }

      function getCoins(address tokenOwner, uint amount) internal{
          balances[tokenOwner] = balances[tokenOwner].add(amount);
          _totalSupply = _totalSupply.add(amount);
          emit Transfer(address(0), tokenOwner, amount);

      }

      function redeem() public{

          address roundWinner = winner();
          getCoins(roundWinner, 1e21);
          getCoins(msg.sender, 1e19);
          activity();

      }


  }
