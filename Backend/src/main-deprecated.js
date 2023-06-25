////////////////////
// Import libs
// npm install xrpl
////////////////////
const xrpl = require("xrpl")

async function main() {
    // Connect to the network Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
    
    console.log("1_GENERATING_WALLETS: Client and Freelancer")
    const fund_result_1 = await client.fundWallet()
    const fund_result_2 = await client.fundWallet()
    const wallet_1_seed = fund_result_1.wallet.seed
    const wallet_2_seed = fund_result_2.wallet.seed
    const wallet_1 = xrpl.Wallet.fromSeed(wallet_1_seed)
    const wallet_2 = xrpl.Wallet.fromSeed(wallet_2_seed)

    // console.log("wallet_1_seed:", wallet_1_seed)
    // console.log("wallet_2_seed:", wallet_2_seed)

    console.log(" - client address:", wallet_1.address)
    console.log(" - freelancer address:", wallet_2.address)

    /////////////////////////////////////
    // memoType String to Hex 
    /////////////////////////////////////
    async function memoType_to_hex(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n ++) {
            var hex = Number(str.charCodeAt(n)).toString(16)
            arr1.push(hex);}

        const out = arr1.join('')
        return { out }
      }

    /////////////////////////////////////
    // memo String to Hex 
    /////////////////////////////////////
    async function memo_to_hex(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n ++) {
            var hex = Number(str.charCodeAt(n)).toString(16)
            arr1.push(hex);}

        const out = arr1.join('')
        return { out }
      }

    /////////////////////////////////////
    // Generate Times 
    /////////////////////////////////////
    async function getTimes() {
        var now = new Date;
        var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),
                                    now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds(),now.getUTCMilliseconds())
        var xrpl_epoch    = Date.UTC(2000,  0, 1, 0, 0, 0, 0)
        var delta_epoch   = Math.floor( (utc_timestamp - xrpl_epoch) / 1000 )
    
        // Seconds past epoch Jan 1, 2000 00:00 (UTC).  Must be in seconds: https://www.dcode.fr/timestamp-converter
        FinishAfter_s = delta_epoch + 2      // Escrow must be created within seconds after script is ran. 
        CancelAfter_s = delta_epoch + 60*10  // Escrow will expire 10 minutes after it was created
        return { FinishAfter_s, CancelAfter_s }
    }
    
    /////////////////////////////////////
    // Create MOU
    /////////////////////////////////////
    async function createMOU(memoType_str, agreement) {
        // Convert json obj and string inputs to hex

        // original
        agreement_hex = memo_to_hex(JSON.stringify(agreement))

        memoType_hex = memoType_to_hex(memoType_str)

        // const offerCondition = "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100" // Don't modify this yet
        const _memoType      = memoType_hex.out    // http://example.com: https://string-functions.com/hex-string.aspx
        const _memo          = agreement_hex.out  // entitlement details: https://string-functions.com/hex-string.aspx

        // Crypto Conditions /////////////
        const cc = require('five-bells-condition')
        const crypto = require('crypto')

        const preimageData = crypto.randomBytes(32)
        const myFulfillment = new cc.PreimageSha256()
        myFulfillment.setPreimage(preimageData)

        const offerCondition = myFulfillment.getConditionBinary().toString('hex').toUpperCase()
        console.log(' - Condition:', offerCondition)
        // (Random hexadecimal, 72 chars in length)

        // keep secret until you want to finish executing the held payment:
        const fulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase()
        console.log(' - Fulfillment:', fulfillment)
        console.log('\n')


        return { offerCondition, _memoType, _memo, fulfillment }
    }

    /////////////////////////////////////
    // Escrow Expiration Date
    /////////////////////////////////////
    async function toDateTime(secs) {
        var xrpl_epoch = Date.UTC(2000,  0, 1, 0, 0, 0, 0) // XRPL Epoch Jan 1, 2000 00:00
        _secs_after_xrpl_epoch = secs + xrpl_epoch/1000
      
        var t = new Date(1970, 0, 1); // Normal Epoch Jan 1, 1970
        t.setSeconds(_secs_after_xrpl_epoch);
        return t;
      }

    /////////////////////////////////////
    // Transaction: Create Escrow 
    /////////////////////////////////////
    async function txCreateEscrow(xrpl, client, wallet_1, wallet_2, contractual_agreement) {
        console.log("2_CREATING_ESCROW: Engagement Agreement between Client and Freelancer")

        // Generate FinsihAfter and CancelAfter times
        delta = await getTimes()
        expiration = await toDateTime(delta.CancelAfter_s)

        const createEscrow = await client.autofill({
                "Account": wallet_1.address,
                "TransactionType": "EscrowCreate",
                "Amount": xrpl.xrpToDrops("30"),     // 30 drops to fund the transaction.
                "Destination": wallet_2.address,
                "Memos": [
                    {
                        "Memo": {
                            "MemoType": contractual_agreement._memoType,
                            "MemoData": contractual_agreement._memo
                        }
                    }
                ],
                "CancelAfter": delta.CancelAfter_s, // 750219060	2022-02-27 05:12:00 (EPOCH Jan 1, 2020 00:00 UTC), https://www.dcode.fr/timestamp-converter
                "FinishAfter": delta.FinishAfter_s, // 752219060	2022-02-27 04:26:00
                "Condition": contractual_agreement.offerCondition,
                "DestinationTag": 23480,
                "SourceTag": 11747})
        
        offerSequence = createEscrow.Sequence

        const signed_wallet_1 = wallet_1.sign(createEscrow)
        const tx = await client.submitAndWait(signed_wallet_1.tx_blob)
        const createEscrow_txHash = tx.result.hash

        return { createEscrow_txHash, offerSequence, expiration }
    }

    /////////////////////////////////////
    // Transaction: Finish Escrow 
    /////////////////////////////////////
    async function txFinishEscrow(client, wallet_1, contractual_agreement, escrowState) {
        console.log("3_FINISHING_ESCROW: Client verifies and approves Freelancers completed work")
        const finishEscrow = await client.autofill({
        "Account": wallet_1.address,
        "TransactionType": "EscrowFinish",
        "Owner": wallet_1.address, // acct that funded the escrow
        "OfferSequence": escrowState.offerSequence,
        "Condition": contractual_agreement.offerCondition,
        "Fulfillment": contractual_agreement.fulfillment, // "A0028000"
        "Memos": [
                    {
                    "Memo": {
                            "MemoType": contractual_agreement._memoType,
                            "MemoData": contractual_agreement._memo
                            }
                    }
                ]
            })

        const signed_wallet_1 = wallet_1.sign(finishEscrow)
        const tx = await client.submitAndWait(signed_wallet_1.tx_blob)
        // console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
        const finishEscrow_txHash = tx.result.hash
        
        return { finishEscrow_txHash }
    }


    //////////////////////////////////////////////////////
    // Call relevant functions
    //////////////////////////////////////////////////////

    // Step 1)
    var memoType_str = "https://ga.com"
    var agreement = {
                        "engagementId":"ShXnShf92hfhgj",
                        "agreementSignedOn":"2023-06-23T10:34:24+00",
                        "agreementExpiresOn":"2023-12-27T10:34:24+00"
                    }

    et = createMOU(memoType_str, agreement)
    contractual_agreement = et
    // contractual_agreement = process.binding('util').getPromiseDetails(et)[1]

    // Step 2)
    const escrowState = await txCreateEscrow(xrpl, client, wallet_1, wallet_2, contractual_agreement)
    console.log(" - Escrow-Create Transaction hash:", escrowState.createEscrow_txHash)
    console.log(" - Waiting for client to sign off on completed work according to the Engagmenet Agreement...")
    console.log(" - Escrow Expiration Datetime:", escrowState.expiration)
    console.log('\n')

    // Step 3)
    const results = await txFinishEscrow(client, wallet_1, contractual_agreement, escrowState)
    console.log(" - Escrow-Close Transaction hash:", results.finishEscrow_txHash)
    console.log('\n')
    console.log("4_FINISHED: Confirm Freelancer received payment for completed services")

    // Commond line to look up transaction on testnet
    // curl -H 'Content-Type: application/json' -d '{"method":"tx","params":[{"transaction":"28AF161265EAF4143AD6B2F96147A5931D9C8FA6C7D65271FB6F6E5E1C018929","binary":false}]}' https://s.altnet.rippletest.net:51234/


    let response = await client.request({
        "command": "ledger",
        "ledger_index": "validated",
        "transactions" : true
    })

    let transaction_id = results.finishEscrow_txHash
    let transaction_response = await client.request({
        "command" : "tx",
        "transaction" : transaction_id
    });

    // console.log(transaction_response)
    // console.log(transaction_response.result["validated"])
    // console.log(" - Payment Confirmed?:", transaction_response.result["meta"]["TransactionResult"])
    
    if (transaction_response.result["meta"]["TransactionResult"] == "tesSUCCESS") {
        console.log(" - Payment Result:", transaction_response.result["meta"]["TransactionResult"])
        console.log(" - Payment Successful")
        console.log(transaction_response)
    } else {
        console.log(" - Payment Result:", transaction_response.result["meta"]["TransactionResult"])
        console.log(" - Payment Failed")
    }

    
    client.disconnect()
    }

/////////////////////
// Run Code
///////////////////// 
main()



























