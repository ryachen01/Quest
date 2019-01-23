import React, { Component } from "react";
import TokenContract from "../../contracts/Token.json";
import "./Purchase.css"

class TokenPurchase extends Component{

  state = {web3: null, accounts: null, contract: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const reader = new FileReader();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TokenContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TokenContract.abi,
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

        <div className = "Buy">


      <h1> Buy Tokens! </h2>

      <button onClick = {this.uploadFile} className = "Buy" >Upload Photo</button>


      <p> </p>
        </div>

        );

      }

    }

export default TokenPurchase;
