import React, { Component } from "react";
import TokenContract from "./contracts/MyToken.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";
import Upload from "./components/Upload"
import Posts from "./components/Posts"
import Header from "./components/Header"
import Purchase from "./components/Purchase"

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, reader: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

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
      this.setState({ web3, accounts, contract: instance, reader});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };



  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header web3 = {this.state.web3} accounts = {this.state.accounts}/>
      <div className ="App-Components">
        <Upload web3 = {this.state.web3} accounts = {this.state.accounts}/>
        <Posts web3 = {this.state.web3} accounts = {this.state.accounts}/>
        <Purchase web3 = {this.state.web3} accounts = {this.state.accounts}/>
      </div>
      </div>
    );
  }
}

export default (App);
