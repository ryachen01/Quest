import React, { Component } from "react";
import "./Posts.css";
import like_button from './like.png';
import red_like_button from './redLike.png';
import save_button from './SaveButton.png';
import HashesContract from "../../contracts/Hashes.json";
import { Link } from 'react-router-dom'


class Post extends Component{


  state = {web3: null, accounts: null, contract: null, index: null, likedPhotos: null, isLiking: false, address: null};

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
    const {contract } = this.state;

    /*const winnerHash = await contract.methods.returnWinnerHash().call();*/
    const winnerAddress = await contract.methods.returnWinnerAddress().call();

    document.getElementById("Ipfs-Image").src = `https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg`;
    document.getElementById("Caption").innerHTML = winnerAddress.bold() + " Winning Post";

  };

  viewPosts = async () => {




    const {contract, index, accounts} = this.state;
    const imageHash = await contract.methods.getList(index).call();
    const imageCaption = await contract.methods.getCaption(index).call();
    const imageAddress = await contract.methods.getAddress(index).call();
    this.setState({ address: imageAddress});
    const numLikes = await contract.methods.totalVotesFor(imageAddress).call();
    const name = await contract.methods.getProfielName(imageAddress).call();
    const username = await contract.methods.getUserName(imageAddress).call();
    document.getElementById("Name").innerHTML = name
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    const hasLiked = await contract.methods.likedPhoto(imageAddress, 0).call({from: accounts[0]});
    if (hasLiked === false){
      this.setState({ isLiking: false})
      document.getElementById("likeButton").src = like_button;
    }else{
      this.setState({ isLiking: true})
      document.getElementById("likeButton").src = red_like_button;
    }

    this.setState({ index: (index+1)});




  };

  previewPost = async () => {



    const {contract, index, accounts} = this.state;
    const imageHash = await contract.methods.getList(index - 1).call();
    const imageCaption = await contract.methods.getCaption(index - 1).call();
    const imageAddress = await contract.methods.getAddress(index - 1).call();
    this.setState({ address: imageAddress});
    const numLikes = await contract.methods.totalVotesFor(imageAddress).call();
    const name = await contract.methods.getProfielName(imageAddress).call();
    const username = await contract.methods.getUserName(imageAddress).call();
    document.getElementById("Name").innerHTML = name
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = username.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    const hasLiked = await contract.methods.likedPhoto(imageAddress, 0).call({from: accounts[0]});
    if (hasLiked === false){
      this.setState({ isLiking: false})
      document.getElementById("likeButton").src = like_button;
    }else{
      this.setState({ isLiking: true})
      document.getElementById("likeButton").src = red_like_button;
    }

    this.setState({ index: (index - 1)});




  };

  likePost = async () => {

    const {contract, index, accounts, likedPhotos, isLiking} = this.state;
    const imageAddress = await contract.methods.getAddress(index - 1).call();
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
    await contract.methods.voteForListByIndex(likedPhotos).send({from: accounts[0], gasPrice: 1e9});

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
                  <span id = "Name" >Ryan</span>
                </div>
              </div>
            </header>
            <div className="Post-image">
              <div className="Post-image-bg">
                <img alt="Unavailable" src="https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg" id = "Ipfs-Image" />
              </div>
            </div>
            <div className="Post-caption" >
              <div className ="Post-buttons" >
                <input id = "likeButton" onClick = {this.likePost} className="Like-button" type="image" src = {like_button} height = "40" width = "40" alt ="like" />
                <input onClick = {this.saveLikes} className="Save-button" type="image" src = {save_button} height = "40" width = "80" alt ="save" />
                <h3 id = "Num-likes"> 0 Likes </h3>
                <button onClick = {this.viewPosts} className = "Post-Next" >Next</button>
              </div>
              <p id = "Caption" >Ryan</p>
            </div>
            <div className = "Post-like">

            </div>
          </article>

        );
        }
    }
    export default Post;
