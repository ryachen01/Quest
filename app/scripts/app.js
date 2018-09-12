import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';

import { default as contract } from 'truffle-contract'

var submitted = false

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

//import voting_artifacts from '../../build/contracts/Voting.json'
import hashing_artifacts from '../../build/contracts/Hashes.json'
import token_artifacts from '../../build/contracts/MyToken.json'

//var Voting = contract(voting_artifacts);
var Hashes = contract(hashing_artifacts);
var Token = contract(token_artifacts);
var index = 0;
var hashes = [];
var winner = 0;
var winnerAdd;
var winnerHash;




window.voteForPhoto = function(){


console.log(index);
try {
  $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
  $("#candidate").val("");

  /* Voting.deployed() returns an instance of the contract. Every call
   * in Truffle returns a promise which is why we have used then()
   * everywhere we have a transaction call
   */

  Hashes.deployed().then(function(contractInstance) {



    contractInstance.getAddress.call(index - 1).then(function(v){


       contractInstance.voteForCandidate(v, {gas: 300000, from: web3.eth.coinbase}).then(function() {

       });
    });




  });
} catch (err) {
  console.log(err);
}


}

function showWinner(){
  Hashes.deployed().then(function(contractInstance){

    contractInstance.returnWinnerAddress().then(function(v) {

      document.getElementById("winnerAddress").innerHTML = v.toString();


  });


  contractInstance.returnWinnerHash().then(function(v) {
    document.getElementById("winner").src = `https://ipfs.io/ipfs/${v.toString()}`;


});
});
}



window.getWinner = function(){


  Hashes.deployed().then(function(contractInstance){

    contractInstance.returnCreator().then(function(v){
      console.log(v.toString());
    });

    contractInstance.getWinnerAddress({gas: 300000, from: web3.eth.coinbase}).then(function() {



    });
    contractInstance.getWinnerHash({gas: 300000, from: web3.eth.coinbase}).then(function() {



    });




  });



}
window.newLists = function(){


  Hashes.deployed().then(function(contractInstance){


    contractInstance.newLists({gas: 300000, from: web3.eth.coinbase}).then(function(v){


    });


  });


}


function getHashList(){


  var length = 0;



  Hashes.deployed().then(function(contractInstance) {

      contractInstance.listLength.call().then(function(v) {
            length = parseInt(v);


            for (var i = 0; i < length; i++){


              contractInstance.getList.call(i).then(function(v) {


                hashes.push(v.toString());

            });


}



      });

    });


}





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

                Hashes.deployed().then(function(contractInstance) {
                contractInstance.addHash(hash, web3.eth.coinbase, {gas: 300000, from: web3.eth.coinbase}).then(function() {


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



window.transfer = function(){

  Token.deployed().then(function(contractInstance){
    contractInstance.balanceOf.call(0x77d3ca7C57684A274155878C7E738b13a83B5CF6).then(function(v) {
        console.log(v.toString());
    });
    contractInstance.transfer( 0x77d3ca7C57684A274155878C7E738b13a83B5CF6, 1000000000000000000000000, {gas: 300000, from: web3.eth.coinbase}).then(function() {


    });
  });

}


window.newround = function(){



        Hashes.deployed().then(function(contractInstance) {
          contractInstance.newRound({gas: 300000, from: web3.eth.coinbase}).then(function() {

          });
        });



}

window.viewPosts = function(){

  console.log(index);

  var length = 0;
  try {

      Hashes.deployed().then(function(contractInstance) {
        contractInstance.totalVotesFor.call(web3.eth.accounts[0]).then(function(v){
          console.log(v.toString());
        });

        contractInstance.listLength.call().then(function(v) {
           length = parseInt(v);
           console.log(length);
           if (index >= length){

             alert("You have viewed all photos. Please wait a couple minutes for more photos to be uploaded.")
           }
           if (index < length){


           contractInstance.getList.call(index).then(function(v) {

             let url = `https://ipfs.io/ipfs/${v.toString()}`
             document.getElementById("output").src = url;
           });
           index++;
         }
        });






      });


  } catch (err) {
    console.log(err);
  }


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


  Hashes.setProvider(web3.currentProvider);
  Token.setProvider(web3.currentProvider);



  getHashList();
  showWinner();




});
