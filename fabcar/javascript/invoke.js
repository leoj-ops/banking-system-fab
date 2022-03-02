/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // let trans= {
        //     accountno: '182003',
        //     otheraccountno: '182040',
        //     mode: 'send',
        //     balance: 1000,
        //     amount: 100,
        // }

        

        var questions = [
        {
            type: 'input',
            name: 'accountno',
            message: "Enter your Account No.:"
        }, {
            type: 'input',
            name: 'otheraccountno',
            message: "Enter the Other Account No:",
        }, {
            type: 'input',
            name: 'mode',
            message: "Enter the Mode:",
        }, {
            type: 'input',
            name: 'balance',
            message: "Enter the Balance:",
        }, {
            type: 'input',
            name: 'amount',
            message: "Enter the Amount:",
        }
        ];

        inquirer.prompt(questions).then(answers => {
        // console.log(JSON.stringify(answers));
        contract.submitTransaction('writeData',JSON.stringify(answers));
        console.log('Transaction has been submitted');
        });
    

        // await contract.submitTransaction('writeData',JSON.stringify(questions));
        // console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
