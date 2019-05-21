var SafeMath = artifacts.require("./contracts/SafeMath.sol");
var ERC20 = artifacts.require("./contracts/ERC20.sol");
var Token = artifacts.require("./contracts/MyToken.sol");
var Hashes = artifacts.require("./contracts/Hashes.sol");


module.exports = function(deployer) {
   

   deployer.deploy(SafeMath);
   deployer.deploy(ERC20);
   deployer.deploy(Token).then(function() {
	
    return deployer.deploy(Hashes, 1e14, Token.address)

   });
	
};








