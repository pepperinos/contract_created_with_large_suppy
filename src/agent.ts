import { 
  TransactionEvent, 
  Finding, 
  HandleTransaction, 
  FindingSeverity, 
  FindingType,
  createTransactionEvent,
  getJsonRpcUrl

} from 'forta-agent'
import Web3 from 'web3';
import iTokenRespponse from './iTokenResponse';
import axios from "axios"

const abi = require('erc-20-abi')



let TOP_SYMBOLS: string[] = []

const web3 = new Web3(getJsonRpcUrl())
const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  if (!txEvent.to || txEvent.to==="" ){

      if (txEvent.receipt.contractAddress) {
         let total = 0
         const contract = new web3.eth.Contract(abi,txEvent.receipt.contractAddress)
         try{
           total = await contract.methods.totalSupply().call()
         } catch {
           total=0
         }
         if (total > 1000000000000000000000){
             findings.push(
            Finding.fromObject({
              name: "ContractCreated",
              description: `Created contract ${txEvent.receipt.contractAddress}.`,
              alertId: "FORTA-200",
              severity: FindingSeverity.High,
              type: FindingType.Exploit,
              metadata: {
                address: txEvent.receipt.contractAddress,
                total: `${total}`,
              },
            })
           )

         }
        

         
       
          
      }
    

    }
    
    

  return findings;
}

export default {
  handleTransaction
}