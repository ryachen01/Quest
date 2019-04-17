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
      this.setState({web3, accounts, contract: instance, reader});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  getInput = async () => {


  const { accounts, contract } = this.state;

  var createAccount = window.confirm ("You have not created an account yet. Would you like to do so? ")

  if (createAccount){

  var username = prompt("Please enter an username: ", "e.g. joesmith1234");


  const nameTaken = await contract.methods.isNameTaken(username).call();
  if (username != null && !nameTaken) {
      var name = prompt("Please enter a name: ", "Ryan");
      if (name != null){
        this.setState({ username: username});
        this.setState({ name: name});

        var x = window.confirm("Please Upload A Profile Photo");

        if (x){
          console.log('clicked')
        document.getElementById("profileUpload").click()

        }


    }
  }
  else{
    this.getInput();
  }
}
}
createProfile = async () => {

  const { accounts, contract, username, name, } = this.state;
  var ipfsAPI = require('ipfs-api')

  // connect to ipfs daemon API server
  var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
  // Connect to IPFS

  const buf = Buffer.from(this.state.reader.result) // Convert data into buffer
  ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
  if(err) {
    console.error(err)
    return
  }
  let url = `https://ipfs.io/ipfs/${result[0].hash}`

  let hash = result[0].hash;

  console.log(hash)

  console.log(username)

  console.log(name)

  contract.methods.registerAccount(username, name, hash).send({from: accounts[0], value: 1e17, gasPrice: 1e9});

})

}
openProfile = async () => {

  window.location.href = "/following"

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

        const { classes} = this.props;
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
            <Button variant="contained" color="default" onClick = {this.getInput}>
              Create Account
              <CloudUploadIcon className={classes.rightIcon}/>
            </Button>
            </div>
            <div className="Feed-button">
            <Link onClick= {this.openProfile} to={{
              pathname: '/following'
            }}> <input  type="image" src={home_button} height = "60" width = "60" alt="Feed">
              </input>  <h2> My Feed</h2> </Link>
            </div>
           </nav>

       );
    }
}

export default withStyles(styles)(Header);
