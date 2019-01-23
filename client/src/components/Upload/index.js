import React, { Component } from "react";
import HashesContract from "../../contracts/Hashes.json";
import "./Upload.css"

class ImageUpload extends Component{

  state = {web3: null, accounts: null, contract: null, reader: null};

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
    const { accounts, contract } = this.state;

    const response = await contract.methods.returnTotalPhotos().call();

    console.log(response);

    const registered = await contract.methods.accountRegistered().call({from: accounts[0]});

    if (!registered) {

      await contract.methods.registerAccount().send({from: accounts[0]});

    }
  };


    captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        const myFile = event.target.files[0]
        this.state.reader.readAsArrayBuffer(myFile)
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

        contract.methods.addHash(hash, "My Photo", accounts[0]).send({from: accounts[0]});


      })

    }


    render(){

        return (

        <div>


      <h2> Choose photo to upload </h2>
      <input
        type = "file" id = "fileUpload"
        onChange = {this.captureFile}
      />
      <button onClick = {this.uploadFile} className = "Upload" >Upload Photo</button>


      <p> </p>
        </div>

        );

      }

    }

export default ImageUpload;
