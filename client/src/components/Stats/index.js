//imports
import React, { Component } from "react";
import TokenContract from "../../contracts/MyToken.json";
import "./Stats.css"

class HashesContract extends Component{

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
      this.setState({web3, accounts, contract: instance});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


    render(){

        return (

        <div className = "Stats">


      <h1> User Stats! </h1>

      <h3> Total Photos</h3>

      Amount in Tokens: <input type="text" id = "Token Value" defaultValue = "0" onChange = {this.getEthAmount}></input>
      <p> </p>
        </div>

        );

      }

    }

export default TokenPurchase;
