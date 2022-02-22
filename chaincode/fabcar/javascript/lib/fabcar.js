/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {


    async initLedger(ctx){
        console.info('============= START : Initialize Ledger ===========');
        const trans = [
            {
                accountno: '182003',
                otheraccountno: '182040',
                mode: 'send',
                balance: 1000,
                amount: 100,
            },
            {
                accountno: '182040',
                otheraccountno: '182003',
                mode: 'receive',
                balance: 1100,
                amount: 100,
            },
            {
                accountno: '182058',
                otheraccountno: '182065',
                mode: 'send',
                balance: 900,
                amount: 100,
            },
            {
                accountno: '182065',
                otheraccountno: '182058',
                mode: 'receive',
                balance: 1000,
                amount: 100,
            },
            {
                accountno: '182003',
                otheraccountno: '182058',
                mode: 'send',
                balance: 900,
                amount: 100,
            },
            {
                accountno: '182058',
                otheraccountno: '182003',
                mode: 'receive',
                balance: 1100,
                amount: 100,
            }
        ];

        let transId = 1000;

        for (let i = 0; i < trans.length; i++, transId++) {
            await ctx.stub.putState('T '+transId, Buffer.from(JSON.stringify(trans[i])));
            console.info('Added <--> ', trans[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    
    async writeData(ctx, key, value){
        await ctx.stub.putState(key,value)
        return value;
    }

    async readData(ctx, key){
        var response = await ctx.stub.getState(key)
        return response.toString()
    }

    async queryAccountNo(ctx, accountno){

        let queryString = {}
        queryString.selector = {"accountno":accountno}
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = await this.getIterator(iterator)
        return JSON.stringify(result)
        // return (iterator)
    }

    async getIterator(iterator){

        let resultArray =[]
        while(true){
            let res = await iterator.next();
            let resJson = {}
            if(res.value && res.value.value.toString()){
                resJson.key = res.value.key;
                resJson.value = JSON.parse(res.value.value.toString('utf-8'))
                resultArray.push(resJson)
            }

            if(res.done){
                await iterator.close()
                return resultArray
            }
        }

    }

}

module.exports = FabCar;
