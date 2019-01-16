var SafeMath = artifacts.require("./contracts/SafeMath.sol");
var ERC20 = artifacts.require("./contracts/ERC20.sol");
var ERC721 = artifacts.require("./contracts/ERC721.sol");
var Token = artifacts.require("./contracts/MyToken.sol");
var Hashes = artifacts.require("./contracts/Hashes.sol");
var Trophy = artifacts.require("./contracts/MyTrophy.sol");


module.exports = function(deployer) {
   

   deployer.deploy(Trophy);
   deployer.deploy(SafeMath);
   deployer.deploy(ERC20);
   deployer.deploy(ERC721);
   deployer.deploy(Token).then(function() {
	
    return deployer.deploy(Hashes, 1e15, Token.address, Trophy.address)

   });
	
};








