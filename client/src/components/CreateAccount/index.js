import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import HashesContract from "../../contracts/Hashes.json";
import Button from '@material-ui/core/Button';
import "./CreateAccount.css";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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


class CreateAccount extends Component{


  state = {web3: null, accounts: null, contract: null, reader: null};


  componentDidMount = async () => {

    try {

      const web3 = this.props.web3;

      const accounts = this.props.accounts;

      const reader = new FileReader();

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
    const {accounts} = this.state;

    /*const winnerHash = await contract.methods.returnWinnerHash().call();*/
    document.getElementById("initialMessage").innerHTML = `This account will be linked to the addresss: ${accounts[0]}`;
    console.log(accounts[0])

  };

  triggerInput = async () => {
    document.getElementById("fileUpload").click()
  }

  captureFile = async event => {

    this.state.reader.abort()

    event.stopPropagation()
    event.preventDefault()
    const myFile = event.target.files[0]


    this.state.reader.readAsDataURL(myFile)


    setTimeout(() => {

        document.getElementById("preview").style.display = ""
        document.getElementById("preview").src = this.state.reader.result
        document.getElementById("create-button").style.display = ""
        this.state.reader.readAsArrayBuffer(myFile)

    }, 25);


  };

  createProfile = async () => {

    const { accounts, contract} = this.state;
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

    let hash = result[0].hash;

    const username = document.getElementById('username-input').value;

    const name = document.getElementById('name-input').value;

    console.log(username)

    const usernameTaken = contract.methods.isNameTaken(username).call().then(function(result) {
      console.log(result)
      if (result){
        window.alert("Please choose a different username")
        return false
      }
      if (username === "" || name === "" || hash === ""){
        window.alert("Please fill in all forms")
        return false;
      }else{
        var confirmed = window.confirm("Are you sure you would like to create this account?")
        if (confirmed){
          contract.methods.registerAccount(username, name, hash).send({from: accounts[0], value: 1e17, gasPrice: 1e9});
        }else{
          return false;
        }
      }
    });;







  })

  }



      render() {

        const {contract, accounts} = this.state;
        const {classes} = this.props;

        return (



          <div className="form-group">

          <h1> Register Account </h1>

          <p id = "initialMessage">  </p>

          <div className = "user-input">
                 <label htmlFor="username"><b>Username:  </b></label>
                 <input id = "username-input" className = "get-input" type="text" placeholder="Enter Username" />

                 <p> </p>
                 <label htmlFor="username"><b>Display Name:  </b></label>
                 <input id = "name-input" className = "get-input" type="text" placeholder="Enter Display Name" />
                 <p> </p>
                 <div className = "submit-button">
                 <Button variant="contained" color="primary" onClick = {this.triggerInput}>
                   Choose Profile Picture
                   <CloudUploadIcon className={classes.rightIcon}/>

                 </Button>

                 <p> </p>

                 <input
                   type = "file" id = "fileUpload" style={{display: "none"}}
                   onChange = {this.captureFile}
                 />

                 <img alt="Unavailable" style={{display: "none"}} id = "preview" height = "200" width = "200"/>

                 <p> </p>
                 <button type="submit" id = "create-button" onClick = {this.createProfile} style={{display: "none"}} className = "create-button"> Create Account</button>

                 </div>
               </div>
          </div>


        );
        }
    }
    export default withStyles(styles)(CreateAccount);