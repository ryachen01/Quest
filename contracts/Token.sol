pragma solidity ^0.4.24;



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
}


contract MyToken is SafeMath{
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;

    mapping(address => uint) balances;

    address public creator;


    function MyToken() public {
        symbol = "RAC";
        name = "My Token";
        decimals = 18;
        _totalSupply = 100000000000000000000000000;
        creator = msg.sender;
        balances[creator] = _totalSupply;


    }
    function returnCreator() constant returns(address){
    	return creator;
    }

    function totalSupply() public constant returns (uint) {
        return _totalSupply;
    }
    function balanceOf(address tokenOwner) public constant returns (uint) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) public returns (bool) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        return true;
    }

    function buy() public payable{

    creator.transfer(msg.value);
	  uint tokens = msg.value * 100;
	  balances[msg.sender] = safeAdd(balances[msg.sender], tokens);
	  _totalSupply = safeAdd(_totalSupply, tokens);


}

    function redeem(address tokenOwnner) internal{
    balances[tokenOwnner] = safeAdd(balances[tokenOwnner], 1e20);
    _totalSupply = safeAdd(_totalSupply, 1e20);

    }


}
