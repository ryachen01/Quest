import React from "react";
import HashesContract from "../../contracts/Hashes.json";
import "./Header.css";
import { withStyles } from '@material-ui/core/styles';
import home_button from './HomeButton.png';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Link } from 'react-router-dom'


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});


class Header extends React.Component{

  state = {web3: null, accounts: null, contract: null, reader: null, username: null, name: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const reader = new FileReader();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HashesContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HashesContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3, accounts, contract: instance, reader}, this.runOnStart);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runOnStart = async () => {
    const {contract, accounts} = this.state;

    const registered = await contract.methods.accountRegistered().call({from: accounts[0]});

    if (registered){

        document.getElementById("createButton").style.display = "none";
        const profileImage = await contract.methods.getProfileImage(accounts[0]).call();
        document.getElementById("profile").src = `https://ipfs.io/ipfs/${profileImage}`;

    }else{
      document.getElementById("myProfile").style.display = "none";
    }

    /*const winnerHash = await contract.methods.returnWinnerHash().call();*/


  };


openProfile = async () => {

  window.location.href = "/profile"

}

openFeed = async () => {

  window.location.href = "/following"

}

newAccount = async () => {

  window.location.href = "/new"

}

captureProfileUpload = async event => {

  this.state.reader.abort()

  event.stopPropagation()
  event.preventDefault()
  const myFile = event.target.files[0]

  this.state.reader.readAsArrayBuffer(myFile)

  setTimeout(() => {

      this.createProfile();
  },20);



}


    render(){

        const { classes, accounts} = this.props;
        return (

           <nav className="Nav">

           <div className ="Nav-menu">
               <div className="Nav-brand">
		             <h1> Ethereum Dapp</h1>
              </div>

              <div className="Nav-logo">
                 <a className="Nav-brand-logo" href="/">
                 </a>
              </div>

            </div>
            <input
              type = "file" id = "profileUpload" style={{display: "none"}}
              onChange = {this.captureProfileUpload}
            />
            <div className="Account-button">
            <Button id = "createButton" variant="contained" color="default" onClick = {this.newAccount}>
              Create Account
              <CloudUploadIcon className={classes.rightIcon}/>
            </Button>
            <Link id = "myProfile" onClick= {this.openProfile} to={{
              state: accounts[0],
              pathname: '/profile'
            }}> <input id = "profile" type="image" src={home_button} height = "60" width = "60" alt="Feed">
              </input>  <h3> My Profile</h3> </Link>
            </div>
            <div className="Feed-button">
            <Link onClick= {this.openFeed} to={{
              pathname: '/following'
            }}> <input  type="image" src={home_button} height = "60" width = "60" alt="Feed">
              </input>  <h3> My Feed</h3> </Link>
            </div>
           </nav>

       );
    }
}

export default withStyles(styles)(Header);
