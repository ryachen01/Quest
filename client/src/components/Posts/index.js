import React, { Component } from "react";
import "./Posts.css";
import HashesContract from "../../contracts/Hashes.json";
class Post extends Component{

  state = {web3: null, accounts: null, contract: null, index: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const index = 0;

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HashesContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HashesContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3, accounts, contract: instance, index}, this.runOnStart);
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

    const winnerHash = await contract.methods.returnWinnerHash().call();
    const winnerAddress = await contract.methods.returnWinnerAddress().call();

  document.getElementById("Ipfs-Image").src = `https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg`;
  document.getElementById("Caption").innerHTML = winnerAddress.bold() + " Winning Post";

  };

  viewPosts = async () => {

    const {contract, index} = this.state;
    const imageHash = await contract.methods.getList(index).call();
    const imageCaption = await contract.methods.getCaption(index).call();
    const imageAddress = await contract.methods.getAddress(index).call();
    document.getElementById("Ipfs-Image").src = `https://ipfs.io/ipfs/${imageHash}`;
    document.getElementById("Caption").innerHTML = imageAddress.bold() + "  " + imageCaption;

  };
      render() {
        return (
        <article className="Post" ref="Post">
            <header className = "Post-Header">
              <div className="Post-user">
                <div className="Post-user-avatar">
                  <img src="https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png" alt="Chris" />
                </div>
                <div className="Post-user-nickname">
                  <span>Ryan</span>
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
                <input className="Like-button" type="image" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bot%C3%B3n_Me_gusta.svg/1200px-Bot%C3%B3n_Me_gusta.svg.png" height = "40" width = "40" alt ="like" />
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
