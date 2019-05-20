import React, { Component } from "react";
import "./Posts.css";
import like_button from './like.png';
import red_like_button from './redLike.png';
import save_button from './SaveButton.png';
import firebase from '../Firebase/index.js'
import HashesContract from "../../contracts/Hashes.json";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'


class Post extends Component{


  state = {web3: null, accounts: null, contract: null, index: null, likedPhotos: null, isLiking: false, listOrder: null, address: null, askedToReset: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

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
      this.setState({web3, accounts, contract: instance, index, likedPhotos}, this.runOnStart);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runOnStart = async () => {
    const {contract} = this.state;



    const winnerAddress = await contract.methods.returnWinnerAddress().call();
    const winnerHash = await contract.methods.returnWinnerHash().call();
    const winnerCaption = await contract.methods.returnWinnerCaption().call();

    if (winnerAddress != "" && winnerHash != ""){

    const numLikes = await contract.methods.totalVotesFor(winnerAddress).call();
    const name = await contract.methods.getProfileName(winnerAddress).call();
    const username = await contract.methods.getUserName(winnerAddress).call();
    const profileImage = await contract.methods.getProfileImage(winnerAddress).call();

    this.setState({ address: winnerAddress});

    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${winnerHash}`;

    document.getElementById("Caption").innerHTML = username.bold() + " Winning Post";

    document.getElementById("Name").innerHTML = name;

    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"

    document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;


    this.isFollowing(winnerAddress);
    }
    this.randomizeOrder();


  };

  randomizeOrder = async () => {
    const {contract } = this.state;
    const numPhotos = await contract.methods.listLength().call();
    var order = []
    for (var i = 0; i < numPhotos; i++){
      order.push(i);
    }
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = order[i];
      order[i] = order[j];
      order[j] = temp;
  }
    this.setState({ listOrder: order});
  }


  viewPosts = async () => {

    const {contract, index, accounts, listOrder, askedToReset} = this.state;
    const numPosts = await contract.methods.listLength().call();

    const timeLocked = await contract.methods.getTime().call();
    console.log(timeLocked)
    const registered = await contract.methods.accountRegistered().call({from: accounts[0]});

    if (registered && !askedToReset){

      if (timeLocked >= 6000 && timeLocked <= 7000){

        this.setState({ askedToReset: true});

        await contract.methods.newRound().send({from: accounts[0], gasPrice: 1e9});

      }

    }

    if (index < numPosts){
      var value = listOrder[index]

      const imageHash = await contract.methods.getList(value).call();
      const imageCaption = await contract.methods.getCaption(value).call();
      const imageAddress = await contract.methods.getAddress(value).call();
      this.setState({ address: imageAddress});
      if (imageAddress !== accounts[0]){

        this.isFollowing(imageAddress);
        const numLikes = await contract.methods.totalVotesFor(imageAddress).call();
        const name = await contract.methods.getProfileName(imageAddress).call();
        const username = await contract.methods.getUserName(imageAddress).call();
        const profileImage = await contract.methods.getProfileImage(imageAddress).call();
        document.getElementById("Name").innerHTML = name
        try {
          document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
        } catch (error){
          console.log(error);
        }

        document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
        document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
        console.log(`https://ipfs.io/ipfs/${profileImage}`)

        document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;


        const hasLiked = await contract.methods.likedPhoto(imageAddress).call({from: accounts[0]});
        if (hasLiked === false){
          this.setState({ isLiking: false})
          document.getElementById("likeButton").src = like_button;
        }else{
          this.setState({ isLiking: true})
          document.getElementById("likeButton").src = red_like_button;
        }
      }else{
        this.viewPosts();
      }

      this.setState({ index: (index + 1)});

  }




  };

  previousPost = async () => {


    const {contract, index, accounts, listOrder} = this.state;
    if ((index - 2) > -1){
      var value = listOrder[index - 2]

      const imageHash = await contract.methods.getList(value).call();
      const imageCaption = await contract.methods.getCaption(value).call();
      const imageAddress = await contract.methods.getAddress(value).call();
      if (imageAddress !== accounts[0]){
        this.isFollowing(imageAddress);
        this.setState({ address: imageAddress});
        const numLikes = await contract.methods.totalVotesFor(imageAddress).call();
        const name = await contract.methods.getProfileName(imageAddress).call();
        const username = await contract.methods.getUserName(imageAddress).call();
        const profileImage = await contract.methods.getProfileImage(imageAddress).call();
        document.getElementById("Name").innerHTML = name
        document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
        document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
        document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
        document.getElementById("profilePicture").src = `https://ipfs.io/ipfs/${profileImage}`;
        const hasLiked = await contract.methods.likedPhoto(imageAddress).call({from: accounts[0]});
        if (hasLiked === false){
          this.setState({ isLiking: false})
          document.getElementById("likeButton").src = like_button;
        }else{
          this.setState({ isLiking: true})
          document.getElementById("likeButton").src = red_like_button;
        }
      }else{
        this.viewPosts();
      }

      this.setState({ index: (index - 1)});
  }


  };

  likePost = async () => {

    const {contract, index, accounts, likedPhotos, isLiking} = this.state;
    const imageAddress = await contract.methods.getAddress(index - 1).call();
    const hasLiked = await contract.methods.likedPhoto(imageAddress).call({from: accounts[0]});
    if (imageAddress !== accounts[0]){
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
 }

  };

  saveLikes = async () => {

    const {contract, accounts, likedPhotos} = this.state;
    console.log(likedPhotos);
    if (likedPhotos.length > 0){
    await contract.methods.voteForListByIndex(likedPhotos).send({from: accounts[0], gasPrice: 1e9});
  }
  };

  openProfile = async () => {

    window.location.href = "/profile"

  }

  isFollowing = async (followerAddress) => {
    const {accounts} = this.state;
    let ref = firebase.database().ref('followers');
    var alreadyFollowing = false;
    ref.on('value', function(snapshot){

        snapshot.forEach(function(childSnapshot) {
          const childData = childSnapshot.val();
          const data = (childData[Object.keys(childData)[0]])
          if (Object.keys(childData)[0] === accounts[0]){

            if (typeof data == "string"){
              if (data === followerAddress){
                document.getElementById("followButton").innerHTML = "following"
                alreadyFollowing = true;
                return true;
              }
            }else{
            for (var i = 0; i < data.length; i++){
              if (data[i] === followerAddress){
                document.getElementById("followButton").innerHTML = "following"
                alreadyFollowing = true;
                return true;
              }
            }
          }


          };
        });
        if (!alreadyFollowing){
          document.getElementById("followButton").innerHTML = "follow"
      }

    });
  }


  follow = async () => {

    const {accounts, address, contract} = this.state;

    const myAddress = accounts[0];

    const followerAddress = address;

    if (myAddress === followerAddress){
      return false;
    }

    const registered = await contract.methods.accountRegistered().call({from: accounts[0]});
    if (!registered){
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
              if (data === followerAddress){
                done = true
                return false;
              }else{
              following.push(data)
              }
            }else{
            for (var i = 0; i < data.length; i++){
              if (data[i] === followerAddress){
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

        if (followerAddress in following){
          return false;
        }

        following.push(followerAddress)
        if(key !== ""){
          done = true;
          const follower = {
          }
          follower[myAddress] = following
          ref.child(key).update(follower);
          return true;
        }else{
          const follower = {
          }
          follower[myAddress] = followerAddress
          done = true
          ref.push(follower);
        }

      }

    });

  }

      render() {
        const {address} = this.state;
        return (
        <article className="Main-Post" ref="Post">
            <header className = "Post-Header">
              <div className="Top-margin">
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
                <div className = "Follow-button">
                  <Button className = "followButton" id = "followButton" onClick = {this.follow} variant="outlined"  >Follow</Button>
                </div>
              </div>
            </header>
            <div className="Post-Image">
              <div className="Post-image-bg">
                <img alt="Unavailable" src="https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg" id = "Ipfs-Image" />
              </div>
            </div>
            <div className="Post-caption" >
              <div className ="Bottom-margin" >
                <input id = "likeButton" onClick = {this.likePost} className="Like-button" type="image" src = {like_button} height = "40" width = "40" alt ="like" />
                <input onClick = {this.saveLikes} className="Save-button" type="image" src = {save_button} height = "40" width = "80" alt ="save" />
                <div className="post-buttons">
                <h3 id = "Num-likes"> 0 Likes </h3>
                <button onClick = {this.previousPost} className = "Post-Previous" >Previous</button>
                <button onClick = {this.viewPosts} className = "Post-Next" >Next</button>

                </div>
              </div>
              <p className = "CaptionText" id = "Caption" ></p>
            </div>
            <div className = "Post-like">

            </div>
          </article>

        );
        }
    }
    export default Post;
