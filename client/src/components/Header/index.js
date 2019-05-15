import React from "react";
import HashesContract from "../../contracts/Hashes.json";
import "./Header.css";
import { withStyles } from '@material-ui/core/styles';
import home_button from './HomeButton.png';
import firebase from '../Firebase/index.js'
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

  state = {web3: null, accounts: null, contract: null, reader: null, username: null, name: null, followingList: null, address1: null, address2: null, address3: null};

  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const reader = new FileReader();

      const address1 = "";

      const followingList = [];

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HashesContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HashesContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3, accounts, contract: instance, reader, followingList, address1}, this.runOnStart);
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

    this.getFollowing();

    const registered = await contract.methods.accountRegistered().call({from: accounts[0]});

    if (registered){

        document.getElementById("createButton").style.display = "none";
        const profileImage = await contract.methods.getProfileImage(accounts[0]).call();
        document.getElementById("profile").src = `https://ipfs.io/ipfs/${profileImage}`;
        document.getElementById("input-field").style.bottom = "15px";

    }else{
      document.getElementById("myProfile").style.display = "none";
    }

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
  },50);



}

getFollowing = async () => {
  // Declare variables
  const {accounts} = this.state;

  const myAddress = accounts[0];

  let ref = firebase.database().ref('followers');
  var following = [];
  ref.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const childData = childSnapshot.val();
        const data = (childData[Object.keys(childData)[0]])

        if (Object.keys(childData)[0] === myAddress){
          if (typeof data == "string"){

            following.push(data)

          }else{
          for (var i = 0; i < data.length; i++){

            following.push(data[i])

          }
        }


        }

      });

  });

  this.setState({followingList: following})

}

search = async () => {
  const {followingList, contract} = this.state;

  const input = document.getElementById('input-field').value;
  for (var i = 0; i < followingList.length; i++){
      var username = await contract.methods.getUserName(followingList[i]).call();

      if (username.includes(input.toString())){

        var id = "link" + (i+1).toString();
        document.getElementById(id).innerHTML = username;
        document.getElementById(id).style.display = "";

        if (i == 0){
          this.setState({address1: followingList[i]});
        }
        else if (i == 1){
          this.setState({address2: followingList[i]});
        }
        else if (i == 2){
          this.setState({address3: followingList[i]});
        }

      }
  }

}


    render(){

        const { classes, accounts} = this.props;

        const { address1, address2, address3} = this.state;

        return (

           <nav className="Nav">

           <div className ="Nav-menu">
               <div className="Nav-brand">
		             <h1> EtherGram </h1>
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
            <div >
            <Button className="Account-button" id = "createButton" variant="contained" color="default" onClick = {this.newAccount}>
              Create Account
              <CloudUploadIcon className={classes.rightIcon}/>
            </Button>
            <Link className="Profile-button" id = "myProfile" onClick= {this.openProfile} to={{
              state: accounts[0],
              pathname: '/profile'
            }}> <input id = "profile" type="image" src={home_button} height = "60" width = "60" alt="Feed">
              </input>  <h3> My Profile</h3> </Link>
            </div>

            <div className="dropdown">
              <input className = "inputField" id = "input-field" type="text" onKeyUp= {this.search} placeholder="Search for names.."/>
              <div className ="dropdown-content">
              <Link id = "link1" style={{display: "none"}} onClick= {this.openProfile} to={{
                pathname: '/profile',
                state: address1
              }}> Link 1</Link>
              <Link id = "link2" style={{display: "none"}} onClick= {this.openProfile} to={{
                pathname: '/profile',
                state: address2
              }}> Link 2</Link>
              <Link id = "link3" style={{display: "none"}} onClick= {this.openProfile} to={{
                pathname: '/profile',
                state: address3
              }}> Link 3</Link>
              </div>
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
