# Bounce

Bounce offers P2P non-custodial NFC card payments with PoS (Point-of-Sale) terminals. Deployed and working on Tron Mainnet

## Structure

This monorepo contains 3 subrepos each playing a crucial role for the application to work:

- `contracts` - bootstrapped with tronbox. It is used to build the contracts and manage deployments on tron.
- `pos-terminal` - browser-dapp running on the PoS device to handle transaction payments for a retailer. It utilises TronWeb to emit transactions to the tron network
- `nfc-reading-server` - runs a local endpoint that feeds nfc cards read by a local reader to the pos-terminal dapp

## Contracts

- `Vault Contract`: [TSZWybZRCCYrJpbXKqgKofbtisuKjmhPkE](https://tronscan.org/#/contract/TSZWybZRCCYrJpbXKqgKofbtisuKjmhPkE)
  - Holds user funds and tokens can only be transferred out with valid ephemeral key on the nfc card and whitelisted PoSTerminal addresses
  - Instance of a vault contract deployed owned by a user
- `VaultFactory Contract`: [TLmXiZVLm4ckLutkTHVuEqEeeXWgCRqfvn](https://tronscan.org/#/contract/TLmXiZVLm4ckLutkTHVuEqEeeXWgCRqfvn)
  - Allows new users to deploy their own vaults.
  - Stores valid PoS Terminal addresses managed by owners
- `POSTerminal Contract`: = [TGCmHgLSjtyjg8qX3AJDYyPvfcTgjrESxk](https://tronscan.org/#/contract/TGCmHgLSjtyjg8qX3AJDYyPvfcTgjrESxk)
  - Contracts owned by approved retailers that can accept payments from Vault contracts through transactions approved with the ephemeral key
  - Programmable bundled transactions. Upon nfc card payments extra steps can be composed to do swaps on a DEX or integrate with any other on-chain contract

## Pre-requisites

- [Node 18+ and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- NFC card reader
- NFC cards

## Quick-Start

1. Deploying Contracts

   a. Navigate to `contracts` directory

   ```bash
   cd ./contracts
   ```

   b. Setup `.env` files with private key as shown in `.env.example`

   c. Install dependencies

   ```bash
   npm install
   ```

   d. Deploy `VaultFactory` & `POSTerminal` contracts with tronbox migrate

   ```bash
   npx tronbox migrate --network mainnet
   ```

   e. Call `deploy` function on `VaultFactory` to create an instance of `Vault` owned by EOA

2. Run `nfc-reading-server` in the background:
   a. Connect nfc card reader to the device
   b. Navigate to `nfc-reading-server`

   ```bash
   cd ../nfc-reading-server
   ```

   c. Install dependencies

   ```bash
   npm install
   ```

   d. run

   ```bash
   node index.js
   ```

3. Run `pos-terminal`:
   a. Navigate to `pos-terminal`
   b. Setup `.env` files with private key as shown in `.env.example`.

   ```bash
   cd ../pos-terminal
   ```

   c. Install dependencies

   ```bash
   npm install
   ```

   d. Run the application

   ```bash
   npm run dev
   ```
