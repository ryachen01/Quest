import React, { Component } from "react";

import HashesContract from "../../contracts/Hashes.json";
import "./CreateAccount.css";


class CreateAccount extends Component{


  state = {web3: null, accounts: null, contract: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

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




      render() {
        return (



          <div className="form-group">

          <h1> Register Account </h1>

          <div className = "user-input">
                 <label for="username"><b>Username: </b></label>
                 <input type="text" placeholder="Enter Username" name="username" required/>

                 <p> </p>
                 <label for="username"><b>Display Name: </b></label>
                 <input type="text" placeholder="Enter Display Name" name="name" required/>
                 <p> </p>
                 <button type="submit" >Create Account</button>
               </div>
          </div>


        );
        }
    }
    export default CreateAccount;
