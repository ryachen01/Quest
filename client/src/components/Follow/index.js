//imports
import React, { Component } from "react";
import firebase from '../Firebase/index.js'
import HashesContract from "../../contracts/Hashes.json";

class Follow extends Component{

  //initialize web3 to connect with smart contracts and wallets
  state = {web3: null, accounts: null, contract: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const address = this.props.address;

      const index = 0;

      const likedPhotos = [];

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


  follow = async () => {

    firebase.auth().signInWithEmailAndPassword(process.env.REACT_APP_EMAIL, process.env.REACT_APP_PASSWORD)

    let followerData = firebase.database().ref('followers');
    followerData.on("child_added", function(snapshot) {
      console.log(snapshot.val().ryachen);
    });

    // const follower = {
    //   ryachen: 'ryan cheng'
    // }
    // followerData.push(follower);

  }


    render(){

        return (

        <div className = "FollowButton">

          <button onClick = {this.follow} >Follow</button>

        </div>

        );

      }

    }

export default Follow;
