////////////////////
// Import libs
////////////////////
const xrpl = require("xrpl")

async function main() {
    // Connect to the network Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // 1) Instantiate Wallets
    // const wallet_1 = xrpl.Wallet.fromSeed("ssZwBk1BcT5opaZaHVoEX2Sz9JoG5") // address: rHHjeVBDP5dgY34X94mcUpGtWpoyRGTNuY
    const wallet_1 = xrpl.Wallet.fromSeed("sEd7LjFAGkFY26wdXaSAQf3ogu5X5SN") // address: rLWscJQb1RdB53MtzXwWTKBx5HgDZ3Qqdb
    const wallet_2 = xrpl.Wallet.fromSeed("sEdVRKp2ahhM4psqMmvj942uNxyxwds") // address: rN72AMEvYuFcdmp4D3z33ELU5typ5mcKeP
    const offerCondition = "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100"
    // const user_entitlement = "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963" // {"Institution":"Anamolo","Classification":"Professional","Access":["UTP","CTA"],"TS":"2022-02-25 15:30:00"}
    const user_entitlement = "687474703a2f2f6578616d706c652e636f6d" // http://www.quantfy.com/entitlements
    const _memo = "72656e74" // 2022-02-25 15:30:00 
    // const _memo = "7b22496e737469747574696f6e223a22416e616d6f6c6f222c22436c617373696669636174696f6e223a2250726f66657373696f6e616c222c22416363657373223a5b22555450222c22435441225d2c225453223a22323032322d30322d32352031353a33303a3030227d"

    ////////////////////////////////////////////////////////
    // Create Escrow
    ////////////////////////////////////////////////////////
    // 2) Prepare Escrow transaction
    console.log("===== wallet_1: Prepare Escrow Transaction ========")
    console.log("Wallet_1 creating an Escrow")
    const createEscrow = await client.autofill({
        "Account": wallet_1.address,
        "TransactionType": "EscrowCreate",
        "Amount": xrpl.xrpToDrops("30"),
        "Destination": wallet_2.address,
        "Memos": [
            {
                "Memo": {
                    "MemoType": user_entitlement,
                    "MemoData": _memo
                }
            }
        ],
        "CancelAfter": 699303960, // 699219060	2022-02-27 05:12:00 (EPOCH Jan 1, 2020 00:00 UTC), https://www.dcode.fr/timestamp-converter
        "FinishAfter": 699303660, // 699251160	2022-02-27 04:26:00
        "Condition": offerCondition,
        "DestinationTag": 23480,
        "SourceTag": 11747
    })
    const max_ledger = createEscrow.LastLedgerSequence
    // console.log("Prepared Escrow transaction instructions:", createEscrow)
    // console.log("Transaction cost:", xrpl.dropsToXrp(createEscrow.Fee), "XRP")
    // console.log("Transaction expires after ledger:", max_ledger)

    const offerSequence = createEscrow.Sequence
    console.log("Escrow Create Sequence:", offerSequence)
    

    // 3) Sign Create Escrow Transaction
    const signed_wallet_1 = wallet_1.sign(createEscrow)
    // console.log("Identifying hash:", signed_wallet_1.hash)
    // console.log("Signed blob:", signed_wallet_1.tx_blob)
    console.log("=================================")

    console.log('\n')

    // 4) Submit signed blob --------------------------------------------------------
    console.log("===== wallet_1: Submit Escrow Transaction ========")
    const tx = await client.submitAndWait(signed_wallet_1.tx_blob)

    // 5) Check Escrow transaction results
    // console.log("Transaction result:", tx.result.meta.TransactionResult)
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
    const createEscrow_txHash = tx.result.hash
    console.log("Escrow Transaction Hash:", createEscrow_txHash)
    console.log("=================================")
    console.log('\n')

    // ////////////////////////////////////////////////////////
    // // Finish Escrow
    // // can return memo with entitlements: https://xrpl.org/transaction-common-fields.html
    // ////////////////////////////////////////////////////////

    // // Retrieve the Last Sequence number of the Create Escrow Transaction
    // const offerSequence = 25636512


    // // 6) Recipient sending Escrow Finish Transaction
    // console.log("===== wallet_1: Prepare Escrow Finish Transaction ========")
    // const finishEscrow = await client.autofill({
    //     "Account": wallet_1.address,
    //     "TransactionType": "EscrowFinish",
    //     "Owner": wallet_1.address, // acct that funded the escrow
    //     "OfferSequence": offerSequence,
    //     "Condition": offerCondition,
    //     "Fulfillment": "A0028000",
    //     "Memos": [
    //         {
    //             "Memo": {
    //                 "MemoType": user_entitlement,
    //                 "MemoData": _memo
    //             }
    //         }
    //     ]
    // })
    // // const max_ledger_next = offerSequence
    // console.log("Prepared Finish Escrow transaction instructions:", finishEscrow)
    // // console.log("Transaction cost:", xrpl.dropsToXrp(finishEscrow.Fee), "XRP")
    // // console.log("Transaction expires after ledger:", max_ledger_next)
    // console.log("llS:", finishEscrow.LastLedgerSequence)

    // // 7) Sign Finish Escrow Transaction
    // // const signed_wallet_1 = wallet_1.sign(finishEscrow)
    // const signed_wallet_1a = wallet_1.sign(finishEscrow)
    // // console.log("Identifying hash:", signed_wallet_1a.hash)
    // // console.log("Signed blob:", signed_wallet_1a.tx_blob)
    // console.log("=================================")

    // console.log('\n')

    // // 8) Submit signed blob --------------------------------------------------------
    // console.log("===== wallet_1: Submit Finish Escrow Transaction ========")
    // const tx_next = await client.submitAndWait(signed_wallet_1a.tx_blob)

    // // 9) Check Escrow transaction results
    // // console.log("Transaction result:", tx_next.result.meta.TransactionResult)
    // // console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx_next.result.meta), null, 2))
    // const finishEscrow_txHash = tx_next.result.hash
    // console.log("Finish Escrow Transaction Hash:", finishEscrow_txHash)
    // console.log("=================================")
    // console.log('\n')
    

    // 10) View The Transaction Results, https://xrpl.org/websocket-api-tool.html#account_tx , address: rKDX93oN1DdiUbWhimi8YNFoVSuLSnMvNS, tx_hash: 45C9FC01B13349F1F2AC9C8B473F6491910C220AE99E2AEE152DBA957BDA5F74
    //     By tx_hash: https://xrpl.org/websocket-api-tool.html#tx, hash: 0098B5C2F15CDCD5D52B848A6FB3D6392F6E45C1A3AEDD6320C8FB2DCF8B0D1F

    // const user_entitlement = {
    //                             "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963", // 7b2249223a22416e616d6f6c6f222c2254223a2250222c2241223a2255545022207d is {"I":"Anamolo","T":"P","A":"UTP" }, https://codebeautify.org/string-hex-converter
    //                             "MemoData": "72656e74"
    //                         }

            
    // // Memo Example
    // {
    //     "TransactionType": "Payment",
    //     "Account": "rMmTCjGFRWPz8S2zAUUoNVSQHxtRQD4eCx",
    //     "Destination": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
    //     "Memos": [
    //         {
    //             "Memo": {
    //                 "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
    //                 "MemoData": "72656e74"
    //             }
    //         }
    //     ],
    //     "Amount": "1"
    // }


// Disconnect when done (If you omit this, Node.js won't end the process)
client.disconnect()
}

/////////////////////
// Run Code
// references: - failure codes: https://xrpl.org/tec-codes.html
//             - epoch since 2020-01-01 00:00 (UTC): https://www.dcode.fr/timestamp-converter
/////////////////////
main()
























