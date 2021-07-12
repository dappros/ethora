import {realm} from './allSchemas';
import * as schemaTypes from '../../constants/realmConstants';

function checkTransactionExist(transactionHash,callback){
        let transactionObject = realm.objects(schemaTypes.TRANSACTION_SCHEMA);
        if(Array.from(transactionObject.filtered(`transactionHash="${transactionHash}"`)).length>0){
            callback(true);
        }else callback(false);
}

export const insertTransaction = (data) => new Promise((resolve,reject)=>{

    data.map(item=>{

        const data={
            blockNumber:item.blockNumber?item.blockNumber:"N/A",
            from:item.from?item.from:'N/A',
            fromFirstName:item.fromFirstName?item.fromFirstName:'N/A',
            fromLastName:item.fromLastName?item.fromLastName:'N/A',
            toFirstName:item.toFirstName?item.toFirstName:'N/A',
            toLastName:item.toLastName?item.toLastName:'N/A',
            timestamp:item.timestamp?item.timestamp:'N/A',
            to:item.to?item.to:'N/A',
            tokenId:item.tokenId?item.tokenId:'N/A',
            tokenName:item.tokenName?item.tokenName:'N/A',
            transactionHash:item.transactionHash?item.transactionHash:'N/A',
            type:item.type?item.type:'N/A',
            value:item.value?item.value:'N/A'
        }
        checkTransactionExist(item.transactionHash,callback=>{
            if(!callback){
                const date = new Date(item.timestamp)
                item.timestamp = date;
                item.tokenId = item.tokenId===undefined?"Ether":item.tokenId;
                item.tokenName = !item.tokenName?"Ether":item.tokenName;
                realm.write(()=>{
                    realm.create(schemaTypes.TRANSACTION_SCHEMA, data)
                    resolve(true)
                });
            }
            else{
                return null;
            }
        })
    })
})

export const queryAllTransactions = (tokenName) => new Promise((resolve,reject)=>{
    let transactions = realm.objects(schemaTypes.TRANSACTION_SCHEMA).filtered(`tokenName="${tokenName}" SORT(timestamp ASC)`);
    resolve(Array.from(transactions));
})