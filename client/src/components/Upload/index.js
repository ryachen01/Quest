import React, { Component } from "react";
import HashesContract from "../../contracts/Hashes.json";
import "./Upload.css"
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'


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

  state = {web3: null, accounts: null, contract: null, reader: null, username: null, name: null,
    image: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 4 / 3,
    croppedAreaPixels: null,
    croppedImage: null
  };

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
  console.log(myFile)

  this.state.reader.readAsDataURL(myFile)


  setTimeout(() => {
      this.setState({image: this.state.reader.result})
      document.getElementById("cropperTool").style.display = ""
      document.getElementById("uploadPostButton").style.display = ""


  }, 50);


};





    uploadFile = async () => {


        const { accounts, contract} = this.state;

        var ipfsAPI = require('ipfs-api')

        // connect to ipfs daemon API server
        var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
        // Connect to IPFS

        console.log(this.state.reader.result)

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

        let caption = window.prompt("Please enter a caption for your post")

        if (caption === ""){
          return false
        }else{
          contract.methods.addHash(hash, caption, accounts[0]).send({from: accounts[0], gasPrice: 1e9});
          document.getElementById("cropperTool").style.display = "none"
          document.getElementById("uploadPostButton").style.display = "none"

        }




      })

    }



    triggerInput = async () => {
      document.getElementById("fileUpload").click()
    }

    onCropChange = crop => {
        this.setState({ crop })
      }

    onCropComplete = (croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels)
      this.setState({ croppedAreaPixels })
    }

    onZoomChange = zoom => {
      this.setState({ zoom })
    }

    showCroppedImage = async () => {
    console.log(this.state.image)
    const croppedImage = await getCroppedImg(
      this.state.image,
      this.state.croppedAreaPixels
    )

    console.log(typeof croppedImage)
    this.state.reader.readAsArrayBuffer(croppedImage)
    setTimeout(() => {
      console.log(this.state.reader.result)
      this.uploadFile();
    },100);

  }



    render(props){

        const { classes} = this.props;

        return (

        <div className = "upload" >

      <h2> Upload Photo </h2>

      <input
        type = "file" id = "fileUpload" style={{display: "none"}}
        onChange = {this.captureFile}
      />

      <Button className = "newPost" variant="contained" color="primary" onClick = {this.triggerInput}>
        New Post
        <CloudUploadIcon className={classes.rightIcon} />

      </Button>

      <p> </p>

      <div style={{display: "none"}} id = "cropperTool"  className="crop-container">
      <Cropper
        image={this.state.image}
        crop={this.state.crop}
        zoom={this.state.zoom}
        aspect={this.state.aspect}
        onCropChange={this.onCropChange}
        onCropComplete={this.onCropComplete}
        onZoomChange={this.onZoomChange}
      />
      </div>

      <p> </p>

      <div className = "upload-div">
      <Button variant = "contained" id = "uploadPostButton" style={{display: "none"}} onClick = {this.showCroppedImage} type="submit" className ="uploadButton"> Post Photo</Button>
      </div>


        </div>

        );

      }





    }


export default withStyles(styles)(ImageUpload);
