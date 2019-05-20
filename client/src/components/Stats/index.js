//imports
import React, { Component } from "react";
import HashesContract from "../../contracts/Hashes.json";
import "./Stats.css"

class Stats extends Component{

  //initialize web3 to connect with smart contracts and wallets
  state = {web3: null, accounts: null, contract: null, address: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const address = this.props.address;
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HashesContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HashesContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3, accounts, contract: instance, address}, this.runOnStart);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runOnStart = async () => {
    const {contract, address} = this.state;

    /*const winnerHash = await contract.methods.returnWinnerHash().call();*/
    const totalVotes = await contract.methods.totalVotesReceived(address).call();
    const totalPhotos = await contract.methods.totalPhotosPosted(address).call();
    document.getElementById("numPhotos").innerHTML = " Total Photos Posted: " + totalPhotos;
    document.getElementById("numVotes").innerHTML = " Total Votes Received: " + totalVotes;
    document.getElementById("address").innerHTML = " Address: " + address;
  };


    render(){

        return (

        <div className = "Stats">


      <h2> User Stats! </h2>

      <h3 id = "numPhotos">Total Photos Posted: 0</h3>
      <h3 id = "numVotes">Total Votes Received: 0</h3>
      <p id = "address">Address: </p>


      <p> </p>

        </div>

        );

      }

    }

export default Stats;
