//imports
import React, { Component } from "react";
import TokenContract from "../../contracts/MyToken.json";
import "./Purchase.css"

class TokenPurchase extends Component{

  //initialize web3 to connect with smart contracts and wallets
  state = {web3: null, accounts: null, contract: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;
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

  buyCoins = async () => {
    //Purchase Tokens
    const { accounts, contract } = this.state;
    const amount = document.getElementById("Value").value;
    await contract.methods.buy().send({from: accounts[0], value: (1e18 * amount)});

  };

  updateValue = async () => {
    //Conversion between Ether to ERC20 Token
    const amount = document.getElementById("Value").value;
    const tokenValue = amount * 500;
    document.getElementById("Token Value").value = tokenValue;

  }

    render(){

        return (

        <div className = "Buy">


      <h1> Buy Tokens! </h1>

      Amount in Ether: <input type="text" onChange = {this.updateValue} id = "Value"></input>
      <button onClick = {this.buyCoins} id = "Buy" >Purchase Coins</button>
      <p> </p>
      Amount in Tokens: <input type="text" id = "Token Value" value = "0"></input>
      <p> </p>
        </div>

        );

      }

    }

export default TokenPurchase;
