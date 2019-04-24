import React, { Component } from "react";
import HashesContract from "../../contracts/Hashes.json";
import "./Upload.css"
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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



class ImageUpload extends Component{

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







captureFile = async event => {

  this.state.reader.abort()

  event.stopPropagation()
  event.preventDefault()
  const myFile = event.target.files[0]


  this.state.reader.readAsDataURL(myFile)


  setTimeout(() => {

      document.getElementById("preview").style.display = ""
      document.getElementById("preview").src = this.state.reader.result
      document.getElementById("upload").style.display = ""
      this.state.reader.readAsArrayBuffer(myFile)

  }, 25);


};



    uploadFile = async () => {


        const { accounts, contract } = this.state;

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
        console.log(`Url --> ${url}`)
        //document.getElementById("output").src = url
        let hash = result[0].hash;

        contract.methods.addHash(hash, "My Photo", accounts[0]).send({from: accounts[0], gasPrice: 1e9});

        document.getElementById("preview").style.display = "none"
        document.getElementById("upload").style.display = "none"


      })

    }

    triggerInput = async () => {
      document.getElementById("fileUpload").click()
    }





    render(props){

        const { classes} = this.props;

        return (

        <div>

      <h1> Upload Photo </h1>

      <input
        type = "file" id = "fileUpload" style={{display: "none"}}
        onChange = {this.captureFile}
      />

      <Button variant="contained" color="primary" onClick = {this.triggerInput}>
        New Post
        <CloudUploadIcon className={classes.rightIcon} />

      </Button>

      <p> </p>

      <img alt="Unavailable" style={{display: "none"}} id = "preview" height = "200" width = "200"/>

      <p> </p>

      <div>
      <Button variant = "contained" id = "upload" style={{display: "none"}} onClick = {this.uploadFile} type="submit" className ="uploadButton"> Post Photo</Button>
      </div>


        </div>

        );

      }





    }


export default withStyles(styles)(ImageUpload);
