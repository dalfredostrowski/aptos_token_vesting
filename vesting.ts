import dotenv from "dotenv";
dotenv.config();

//import { AptosClient, AptosAccount, CoinClient, FaucetClient } from "aptos";
import { NODE_URL, FAUCET_URL } from "./common";

import { AptosClient, AptosAccount, FaucetClient, } from "aptos";
//URLS
//const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
//const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

//clients
const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
////Accounts
// sender Account
const account1 = new AptosAccount();
// receiver Account
const account2 = new AptosAccount();

console.log("=== Addresses ===");
console.log(`account1: ${account1.address()}`);
console.log(`account2: ${account2.address()}`);
console.log("");



//token vesting program id
const pid="0x86c0477879e133d970eec70a64f9a1bbc1b7eab2efe8a3471b6e36ce8b370e2c";
//Token Vesting Smart Contract
// describe("Token Vesting", () => {
 // it ("Creating Vesting", async () => {

(async () => {

  await faucetClient.fundAccount(account1.address(), 1000000000);//Airdropping
    //Time and Amounts
    const now = Math.floor(Date.now() / 1000)
    //Any discrete amount and corresponding time
    //can be provided to get variety of payment schedules
    const release_amount =[10000, 50000, 10000, 30000];
    //    const release_amount =[10000, 50000, 10000, 30000];
    //100 000
    //    const release_amount =[5000, 25000, 5000, 15000];
    //50 000
    // const release_amount =[2500, 12500, 2500, 7500];
    //25 0000

    const release_time_increment =[ 3, 20, 30];
    var release_time:BigInt[]=[BigInt(now)]
    release_time_increment.forEach((item) => {
      let val=BigInt(now+item);
      release_time.push(val);
    });
    const create_vesting_payloads = {
      type: "entry_function_payload",
      function: pid+"::vesting::create_vesting",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account2.address(),release_amount,release_time,100000,"xyz"],
    };
    let txnRequest = await client.generateTransaction(account1.address(), create_vesting_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account1, txnRequest);
    let x = await client.submitSignedBCSTransaction(bcsTxn);
    console.log(x);
})();
  //Function
//  it ("Get Funds", async () => {

(async () => {
 
  await faucetClient.fundAccount(account2.address(), 1000000000);//Airdropping
    //the receiver gets allocated fund as required
  const create_getfunds_payloads = {
      type: "entry_function_payload",
      function: pid+"::vesting::release_fund",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account1.address(),"xyz"],
    };
    let txnRequest = await client.generateTransaction(account2.address(), create_getfunds_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account2, txnRequest);
    let x=await client.submitSignedBCSTransaction(bcsTxn);
    console.log(x);


})();

