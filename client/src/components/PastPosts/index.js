import React, { Component } from "react";
import "./PastPosts.css";
import HashesContract from "../../contracts/Hashes.json";
import Button from '@material-ui/core/Button';
import firebase from '../Firebase/index.js'


class PastPosts extends Component{


  state = {web3: null, accounts: null, contract: null, index: null, likedPhotos: null, isFollowing:null, address: null};

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
      this.setState({web3, accounts, contract: instance, index, likedPhotos, isFollowing: false, address}, this.runOnStart);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runOnStart = async () => {

    const {address} = this.state;
    this.isFollowing(address);
    this.viewPosts();

  };

  viewPosts = async () => {


    const {contract, index, address} = this.state;

    const photosPosted = await contract.methods.totalPhotosPosted(address).call();

    if (index < photosPosted){
    const imageHash = await contract.methods.viewPhotos(address, index).call();
    const imageCaption = await contract.methods.viewCaption(address, index).call();
    const name = await contract.methods.getProfileName(address).call();
    const numLikes = await contract.methods.totalVotesFor(address).call();
    const username = await contract.methods.getUserName(address).call();
    const profileImage = await contract.methods.getProfileImage(address).call();
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    document.getElementById("Name").innerHTML = name
    document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;


    this.setState({ index: (index+1)});

  }};

  previousPost = async () => {



    const {contract, index, address} = this.state;

    console.log(index)

    const photosPosted = await contract.methods.totalPhotosPosted(address).call();

    if (index > 0){
    const imageHash = await contract.methods.viewPhotos(address, index - 2).call();
    const imageCaption = await contract.methods.viewCaption(address, index - 2).call();
    const name = await contract.methods.getProfileName(address).call();
    const numLikes = await contract.methods.totalVotesFor(address).call();
    const username = await contract.methods.getUserName(address).call();
    const profileImage = await contract.methods.getProfileImage(address).call();
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    document.getElementById("Name").innerHTML = name
    document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;


    this.setState({ index: (index - 1)});

  }

}

  follow = async () => {

    const {accounts, address} = this.state;

    const myAddress = accounts[0]

    if (address === myAddress){
      return false;
    }

    firebase.auth().signInWithEmailAndPassword(process.env.REACT_APP_EMAIL, process.env.REACT_APP_PASSWORD)

    let ref = firebase.database().ref('followers');
    var following = []
    var key = ""
    var done = false;
    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          const childData = childSnapshot.val();
          const data = (childData[Object.keys(childData)[0]])
          if (Object.keys(childData)[0] === myAddress){
            if (typeof data == "string"){
              if (data === address){
                done = true
                return false;
              }else{
              following.push(data)
              }
            }else{
            for (var i = 0; i < data.length; i++){
              if (data[i] === address){
                done = true
                return false;
              }else{
              following.push(data[i])
            }
            }
          }

            key = childSnapshot.key;
          }

        });

        if (!done){

          console.log("a")
        if (address in following){
          console.log("b")
          return false;
        }

        following.push(address)
        console.log(following)
        if(key !== ""){
          done = true;
          const follower = {
          }
          follower[myAddress] = following
          ref.child(key).update(follower);
          return true;
        }else{
          console.log("a")
          const follower = {
          }
          follower[myAddress] = address
          done = true
          ref.push(follower);
        }

      }

    });

  }

  unfollow = async () => {

    const {accounts, address} = this.state;

    const myAddress = accounts[0]



    firebase.auth().signInWithEmailAndPassword(process.env.REACT_APP_EMAIL, process.env.REACT_APP_PASSWORD)

    let ref = firebase.database().ref('followers');
    var following = []
    var isFollowing = false;
    var key = ""
    var done = false;
    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          const childData = childSnapshot.val();
          const data = (childData[Object.keys(childData)[0]])
          if (Object.keys(childData)[0] === myAddress){
              if (typeof data == "string"){
                if (data === address){
                  isFollowing = true;
                }else{
                following.push(data)
                }
              }else{
              for (var i = 0; i < data.length; i++){
                if (data[i] === address){
                  isFollowing = true;
                }else{
                following.push(data[i])
              }
              }
            }

              key = childSnapshot.key;
          }

        });

        if (!done){
        if (isFollowing){

          const follower = {
          }
          follower[myAddress] = following
          done = true;
          isFollowing = true;
          ref.child(key).update(follower);
          return true;
        }

      }
    }

    );

  }

  isFollowing = async (followerAddress) => {
    const {accounts} = this.state;
    let ref = firebase.database().ref('followers');

    ref.on('value', function(snapshot){

        snapshot.forEach(function(childSnapshot) {
          const childData = childSnapshot.val();
          const data = (childData[Object.keys(childData)[0]])
          if (Object.keys(childData)[0] === accounts[0]){

            if (typeof data == "string"){
              if (data === followerAddress){
                document.getElementById("followButton").innerHTML = "unfollow"

              }
            }else{
            for (var i = 0; i < data.length; i++){
              if (data[i] === followerAddress){
                document.getElementById("followButton").innerHTML = "unfollow"

              }
            }
          }


          };
        });


    });

    document.getElementById("followButton").innerHTML = "follow"

  }

  followingStatus = async () => {

    if (document.getElementById("followButton").innerHTML === "follow"){
      this.follow();
    }else{
      this.unfollow();
      this.isFollowing();
    }


  }


  saveLikes = async () => {

    const {contract, accounts, likedPhotos} = this.state;
    console.log(likedPhotos);
    await contract.methods.voteForListByIndex(likedPhotos).send({from: accounts[0]});

  };

  openProfile = async () => {

    window.location.href = "/profile"

  }

      render() {
        return (
        <article className="Post" ref="Post">
            <header className = "Post-Header">
            <div className="Post-user">
              <img id = "profilePicture" src="https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png" height = "40" width = "40" alt="Logo"/>
              <div className="Post-user-nickname">
                <span id = "Name"></span>
              </div>
              <div className = "Follow-button">
                <Button id = "followButton" onClick = {this.followingStatus} variant="outlined">Unfollow</Button>
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
                <h3 id = "Num-likes"> 0 Likes </h3>
                <button onClick = {this.viewPosts} className = "Post-Next" >Next</button>
                <button onClick = {this.previousPost} className = "Post-Previous" >Previous</button>
              </div>
              <p id = "Caption" >Ryan</p>
            </div>
          </article>

        );
        }
    }
    export default PastPosts;
