import React, { Component } from "react";
import "./PastPosts.css";
import like_button from './like.png';
import red_like_button from './redLike.png';
import HashesContract from "../../contracts/Hashes.json";


class PastPosts extends Component{


  state = {web3: null, accounts: null, contract: null, index: null, likedPhotos: null, address: null};

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
      this.setState({web3, accounts, contract: instance, index, likedPhotos, address}, this.runOnStart);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runOnStart = async () => {

    this.viewPosts();

  };

  viewPosts = async () => {


    const {contract, index, accounts, address} = this.state;
    const imageHash = await contract.methods.viewPhotos(address, 0).call();
    const imageCaption = await contract.methods.getCaption(index).call();
    const imageAddress = await contract.methods.getAddress(index).call();
    this.setState({ address: imageAddress});
    const numLikes = await contract.methods.totalVotesFor(imageAddress).call();
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = imageAddress.bold() + "  " + imageCaption;
    document.getElementById("Num-likes").innerHTML = numLikes + " Likes"
    const hasLiked = await contract.methods.likedPhoto(imageAddress, 0).call({from: accounts[0]});
    if (hasLiked === false){
      document.getElementById("likeButton").src = like_button;
    }else{
      document.getElementById("likeButton").src = red_like_button;
    }
    this.setState({ index: (index+1)});



  };

  likePost = async () => {

    const {contract, index, accounts, likedPhotos} = this.state;
    const imageAddress = await contract.methods.getAddress(index - 1).call();
    const hasLiked = await contract.methods.likedPhoto(imageAddress, 0).call({from: accounts[0]});
    if (hasLiked === false){
        document.getElementById("likeButton").src = red_like_button;
        likedPhotos.push(index - 1);
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
        return (
        <article className="Post" ref="Post">
            <header className = "Post-Header">
              <div className="Post-user">
                <div className="Post-user-nickname">
                  <span>Ryan</span>
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
                <h3 id = "Num-likes"> 0 Likes </h3>
                <input onClick = {this.saveLikes} className="Save-button" type="image" src = "https://www.clipartmax.com/png/middle/4-47145_save-button-svg-clip-arts-600-x-230-px-save-button-icon.png" height = "40" width = "80" alt ="save" />
                <button onClick = {this.viewPosts} className = "Post-Next" >Next</button>
              </div>
              <p id = "Caption" >Ryan</p>
            </div>
          </article>

        );
        }
    }
    export default PastPosts;
