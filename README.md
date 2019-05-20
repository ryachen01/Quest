# EtherGram

This project is essentially an Instagram clone built on top of the ethereum blockchain
which uses an Erc20 token to incentivize users to be active.

Built using React Js and Solidity

## Local Installation

### Step 1:

Download Node Js, React Js, and Truffle

### Step 2:

Change directories to client then run

```sh
cd client, npm run start
```

The file should open at localhost:3000

# How To Use

## Part 1: Create Account

### Step 1:

Install the Metamask Chrome Extension (https://metamask.io)

### Step 2:

Get Testnet Ether from the Ropsten faucet (https://faucet.metamask.io)

### Step 3:

Press the Create Account button and follow the steps to create an account

## Part 2: Navigation

The main page is the explore page which shows all posts. The first post is the most popular photo of the previous day

Pressing the My Feed buttons brings you to a page which only shows photos from accounts you follow

Pressing the My Profile button brings you to your profile page

Pressing the Profile Photo of any account will bring you to their profile page

## Part 3: Blockchain Features

To like a photo simply press the heart button

In order to allow users to bulk like the likes aren't uploaded to the blockchain until the Save Button is pressed

When creating an account you automatically purchase a minimum of 1 EtherGram Token

Everytime you like a picture you are sending the creator more EtherGram Tokens

The exchange rate between EGT and Ethereum is a fixed rate of 0.0005 Ether to EGT (One way transfer only)

You can follow other accounts for free if you have created an account

This information is stored on Firebase not the blockchain.

By paying a small fee for every transaction users can ensure a decentralized, private, and add free user experience
