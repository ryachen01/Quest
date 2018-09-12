var Hashes = artifacts.require("./contracts/Hashes.sol");
var Accounts = artifacts.require("./contracts/Accounts.sol");
var Token = artifacts.require("./contracts/MyToken.sol");


module.exports = function(deployer) {
  deployer.deploy(Accounts,{gas: 4000000, from: web3.eth.accounts[0]});
  deployer.deploy(Hashes,{gas: 4000000, from: web3.eth.accounts[0]});
  deployer.deploy(Token,{gas: 4000000, from: web3.eth.accounts[0]});
  

};