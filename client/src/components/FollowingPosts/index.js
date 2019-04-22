import React, { Component } from "react";
import "./FollowingPosts.css";
import like_button from './like.png';
import red_like_button from './redLike.png';
import save_button from './SaveButton.png';
import HashesContract from "../../contracts/Hashes.json";
import firebase from '../Firebase/index.js'
import { Link } from 'react-router-dom'

class FollowingPosts extends Component{


  state = {web3: null, accounts: null, contract: null, index: null, likedPhotos: null, address: null, postList:null, listSet:null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const index = 0;

      const likedPhotos = [];

      const postList = []

      const listSet = false;

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HashesContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HashesContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3, accounts, contract: instance, index, likedPhotos, postList, listSet}, this.runOnStart);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runOnStart = async () => {

    const {accounts} = this.state;

    const myAddress = accounts[0]
    //const followerAddress = await contract.methods.getAddress(index - 1).call();

    firebase.auth().signInWithEmailAndPassword(process.env.REACT_APP_EMAIL, process.env.REACT_APP_PASSWORD)
    let ref = firebase.database().ref('followers');
    var following = []
    ref.on('value', function(snapshot){

        snapshot.forEach(function(childSnapshot) {
          const childData = childSnapshot.val();
          const data = (childData[Object.keys(childData)[0]])
          if (Object.keys(childData)[0] === myAddress){

              following.push(data);

          };
        });

    });
    this.setState({ postList: following});
    setTimeout(() => {

      this.viewPosts();
  }, 1000);


  };


  randomizeList = async () => {

    const {postList} = this.state;
    if (typeof postList[0] == "string"){
      return false;
    }else{
      for (var i = postList[0].length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = postList[0][i];
        postList[0][i] = postList[0][j];
        postList[0][j] = temp;
    }
    }
    this.setState({ postList: postList});
    return postList

  }

  viewPosts = async () => {


    const {contract, index, accounts, postList, listSet} = this.state;
    var address;
    if (typeof postList[0] == "string"){
      address = postList[index];
    }else{
      try {
      address = postList[0][index];
    }catch {
      console.log("not following any accounts")
    }
    }

    if (address != null){

      if (!listSet){
        this.setState({ listSet: true});
        this.viewPosts();
      }

    }else{
        return false;
    }


    document.getElementById("Error").innerHTML = '';

    this.setState({ address: address});

    const imageHash = await contract.methods.viewPhotos(address, 0).call();
    const imageCaption = await contract.methods.viewCaption(address, 0).call();
    const name = await contract.methods.getProfileName(address).call();
    const numLikes = await contract.methods.totalVotesFor(address).call();
    const username = await contract.methods.getUserName(address).call();
    const profileImage = await contract.methods.getProfileImage(address).call();
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    document.getElementById("Name").innerHTML = name
    document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;
    const hasLiked = await contract.methods.likedPhoto(address, 0).call({from: accounts[0]});
    if (hasLiked === false){
      this.setState({ isLiking: false})
      document.getElementById("likeButton").src = like_button;
    }else{
      this.setState({ isLiking: true})
      document.getElementById("likeButton").src = red_like_button;
    }


    this.setState({ index: (index+1)});



  };

  previousPost = async () => {


    const {contract, index, accounts, postList} = this.state;
    var address;
    if (typeof postList[0] == "string"){
      address = postList[index - 2];
    }else{
      try {
      address = postList[0][index];
    }catch {
      console.log("not following any accounts")
    }
    }


    if (address == null){

        return false;
    }


    document.getElementById("Error").innerHTML = '';

    this.setState({ address: address});

    const imageHash = await contract.methods.viewPhotos(address, 0).call();
    const imageCaption = await contract.methods.viewCaption(address, 0).call();
    const name = await contract.methods.getProfileName(address).call();
    const numLikes = await contract.methods.totalVotesFor(address).call();
    const username = await contract.methods.getUserName(address).call();
    const profileImage = await contract.methods.getProfileImage(address).call();
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    document.getElementById("Name").innerHTML = name
    document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;
    const hasLiked = await contract.methods.likedPhoto(address, 0).call({from: accounts[0]});
    if (hasLiked === false){
      this.setState({ isLiking: false})
      document.getElementById("likeButton").src = like_button;
    }else{
      this.setState({ isLiking: true})
      document.getElementById("likeButton").src = red_like_button;
    }


    this.setState({ index: (index-1)});



  };

  likePost = async () => {

    const {contract, index, accounts, likedPhotos, isLiking, postList} = this.state;
    var imageAddress;
    if (typeof postList[0] == "string"){
      imageAddress = postList[index - 1];
    }else{
      imageAddress = postList[0][index - 1];
    }
    const hasLiked = await contract.methods.likedPhoto(imageAddress, 0).call({from: accounts[0]});
    if (hasLiked === false){
      if (!isLiking){
        document.getElementById("likeButton").src = red_like_button;
        likedPhotos.push(index - 1);
        this.setState({ isLiking: true})
      }else{
        document.getElementById("likeButton").src = like_button
        likedPhotos.splice(likedPhotos.indexOf(index - 1), 1 );
        this.setState({ isLiking: false})
      }
   }

  };

  saveLikes = async () => {

    const {contract, accounts, likedPhotos} = this.state;
    console.log(likedPhotos);
    await contract.methods.voteForListByIndex(likedPhotos).send({from: accounts[0]});

  };

  openProfile = async () => {

    window.location.href = "/profile"

  }

      render() {
        const {address} = this.state;
        return (
        <article className="Post" ref="Post">
            <header className = "Post-Header">
              <div className="Post-user">
              <div className="Post-user-avatar">
                <Link onClick= {this.openProfile} to={{
                  pathname: '/profile',
                  state: address
                    }}> <input id = "profilePicture" type="image" src="https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png" height = "40" width = "40" alt="Logo">
                  </input> </Link>
              </div>
              <div className="Post-user-nickname">
                <span id = "Name" ></span>
              </div>
              </div>
            </header>
            <div className="Post-image">
              <div className="Post-image-bg">
                <img alt="Unavailable"  id = "Ipfs-Image" />
              </div>
            </div>
            <div className="Post-caption" >
            <div className ="Post-buttons" >
              <input id = "likeButton" onClick = {this.likePost} className="Like-button" type="image" src = {like_button} height = "40" width = "40" alt ="like" />
              <input onClick = {this.saveLikes} className="Save-button" type="image" src = {save_button} height = "40" width = "80" alt ="save" />
              <h3 id = "Num-likes"> 0 Likes </h3>
              <button onClick = {this.viewPosts} className = "Post-Next" >Next</button>
              <button onClick = {this.previousPost} className = "Post-Previous" >Previous</button>
            </div>
              <p id = "Caption" ></p>
            </div>
            <p id = "Error"> Press next to view Photos. If no Photos are shown try following more accounts or connecting to a stronger WiFi Network.</p>
          </article>


        );
        }
    }
    export default FollowingPosts;
