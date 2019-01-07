import "../styles/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';

import { default as contract } from 'truffle-contract'

var submitted = false


//import voting_artifacts from '../../build/contracts/Voting.json'
import hashing_artifacts from '../../build/contracts/Hashes.json'
import token_artifacts from '../../build/contracts/MyToken.json'
import trophy_artifacts from '../../build/contracts/MyTrophy.json'

//var Voting = contract(voting_artifacts);
var Hashes = contract(hashing_artifacts);
var Token = contract(token_artifacts);
var Trophy = contract(trophy_artifacts);

var index = 0;

var votes = []

window.voteForPhoto = function(){

console.log(index);
votes.push(index-1);
}
window.saveVotes = function(){

  console.log(votes)
  Hashes.deployed().then(function(contractInstance){



      contractInstance.voteForListByIndex(votes, {from: web3.eth.coinbase}).then(function(){

      });
      contractInstance.voteForListByBitString(31, {from: web3.eth.coinbase}).then(function(){

      });

  });
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

    contractInstance.getWinnerAddress({from: web3.eth.coinbase}).then(function() {



    });
    contractInstance.getWinnerHash({from: web3.eth.coinbase}).then(function() {



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
                contractInstance.addHash(hash, "My Photo", web3.eth.coinbase, {from: web3.eth.coinbase}).then(function() {


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




window.buyCoins = function(){

  Token.deployed().then(function(contractInstance){
    contractInstance.balanceOf.call(web3.eth.coinbase).then(function(v) {
        console.log(v.toString());
    });
    contractInstance.totalSupply.call().then(function(v) {
        console.log(v.toString());
    });

    contractInstance.buy({from: web3.eth.coinbase, value: 1000000000000000000}).then(function(){

    });

  });

}

window.transferCoins = function(){


  Token.deployed().then(function(contractInstance){
    var address = document.getElementById("address").value;
    var amount = document.getElementById("amount").value;

    console.log(parseFloat(amount) *1000000000000000000);
    contractInstance.transfer(address.toString(), (parseFloat(amount)*1000000000000000000), {from: web3.eth.coinbase}).then(function(){

    });

  });
}

window.newround = function(){

        Hashes.deployed().then(function(contractInstance) {
          contractInstance.newRound({from: web3.eth.coinbase});
        });
}

window.getTrophy = function(){



        Trophy.deployed().then(function(contractInstance) {
          contractInstance.createTrophy('QmXhxAmGxbX7HiotRxyuGCU6kJC2oW964pBoJ6TEAoQr6G', {from: web3.eth.coinbase});
        });
}


window.viewPosts = function(){


  var length = 0;
  try {

      Hashes.deployed().then(function(contractInstance) {
        contractInstance.totalVotesFor.call(web3.eth.coinbase).then(function(v){
          console.log(v.toString());
        });
        contractInstance.numActions.call(1).then(function(v){
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
           contractInstance.getCaption.call(index).then(function(v){
             document.getElementById("Caption").innerHTML = v.toString();
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

  Token.setProvider(web3.currentProvider);
  Trophy.setProvider(web3.currentProvider);
  Hashes.setProvider(web3.currentProvider);


  getHashList();
  showWinner();




});
