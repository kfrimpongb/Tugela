////////////////////
// Import libs
////////////////////
const xrpl = require("xrpl")

async function main() {
    // Connect to the network Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // 1) Instantiate Wallets
    const wallet_1 = xrpl.Wallet.fromSeed("ssZwBk1BcT5opaZaHVoEX2Sz9JoG5") // address: rHHjeVBDP5dgY34X94mcUpGtWpoyRGTNuY
    const wallet_2 = xrpl.Wallet.fromSeed("spApFGEZoUcJbt7MPdaV1CUed4Ji8") // address: rwfCEKfzgsmgMuiqcB4WnMcs4VrGy8UF4M

    // 2) Prepare transaction
    console.log("===== Prepare Transaction ========")
    console.log("Preparing to send  22 drops from wallet_1 to wallet_2")
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": wallet_1.address, // wallet_1.address
        "Amount": xrpl.xrpToDrops("22"), // 
        "Destination": wallet_2.address // wallet_2 address
    })
    const max_ledger = prepared.LastLedgerSequence
    console.log("Prepared transaction instructions:", prepared)
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    console.log("Transaction expires after ledger:", max_ledger)

    // 3) Sign transaction
    const signed = wallet_1.sign(prepared)
    console.log("Identifying hash:", signed.hash)
    console.log("Signed blob:", signed.tx_blob)
    console.log("=================================")

    console.log('\n')

    // 4) Submit signed blob --------------------------------------------------------
    console.log("===== Submit Transaction ========")
    const tx = await client.submitAndWait(signed.tx_blob)

    // 5) Check transaction results
    console.log("Transaction result:", tx.result.meta.TransactionResult)
    console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
    console.log("=================================")


// Disconnect when done (If you omit this, Node.js won't end the process)
client.disconnect()
}

/////////////////////
// Run Code
/////////////////////
main()
























