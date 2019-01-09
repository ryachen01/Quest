import "../styles/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';

import { default as contract } from 'truffle-contract'



//import voting_artifacts from '../../build/contracts/Voting.json'
import hashing_artifacts from '../../build/contracts/Hashes.json'
import token_artifacts from '../../build/contracts/MyToken.json'
import trophy_artifacts from '../../build/contracts/MyTrophy.json'

//var Voting = contract(voting_artifacts);
var Hashes = contract(hashing_artifacts);
var Token = contract(token_artifacts);
var Trophy = contract(trophy_artifacts);



window.uploadFile = function() {


  const reader = new FileReader();
        reader.onloadend = function() {
          var ipfsAPI = require('ipfs-api')

          // connect to ipfs daemon API server
      var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
          // Connect to IPFS
          const buf = Buffer.from(reader.result) // Convert data into buffer
          ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
            if(err) {
              console.error(err)
              return
            }
            let url = `https://ipfs.io/ipfs/${result[0].hash}`
            console.log(`Url --> ${url}`)
            //document.getElementById("output").src = url
            let hash = result[0].hash;

            try {

                Trophy.deployed().then(function(contractInstance) {
                  contractInstance.createTrophy(hash, {from: web3.eth.coinbase}).then(function() {


                });




              });

            } catch (err) {
              console.log(err);
            }

          })
        }
        const photo = document.getElementById("file");
        reader.readAsArrayBuffer(file.files[0]);


}




window.getTrophy = function(){



        Trophy.deployed().then(function(contractInstance) {
          contractInstance.createTrophy('QmXhxAmGxbX7HiotRxyuGCU6kJC2oW964pBoJ6TEAoQr6G', {from: web3.eth.coinbase});
        });
}





$( document ).ready(function() {


  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Token.setProvider(web3.currentProvider);
  Trophy.setProvider(web3.currentProvider);
  Hashes.setProvider(web3.currentProvider);




});
