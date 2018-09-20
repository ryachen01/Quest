
var Token = artifacts.require("./contracts/MyToken.sol");
var Hashes = artifacts.require("./contracts/Hashes.sol");


console.log(Hashes.address);

module.exports = function(deployer) {
   deployer.deploy(Token).then(function() {
    return deployer.deploy(Hashes, 100000000000000, Token.address)
  });
};