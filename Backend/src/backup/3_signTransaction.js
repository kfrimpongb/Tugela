////////////////////
// Import libs
////////////////////
const xrpl = require("xrpl")

async function main() {
    // Connect to the network Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Wallet 1
    const wallet_1 = xrpl.Wallet.fromSeed("ssZwBk1BcT5opaZaHVoEX2Sz9JoG5")
    console.log(wallet_1.address)

    // Prepare transaction
    const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": "rHHjeVBDP5dgY34X94mcUpGtWpoyRGTNuY", // wallet_1.address
        "Amount": "20000", // xrpl.xrpToDrops("22")
        "Destination": "rwfCEKfzgsmgMuiqcB4WnMcs4VrGy8UF4M" // wallet_2 address
    })
    const max_ledger = prepared.LastLedgerSequence
    console.log("Prepared transaction instructions:", prepared)
    console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
    console.log("Transaction expires after ledger:", max_ledger)

    // Sign transaction -------------------------------------------------------
    const signed = wallet_1.sign(prepared)
    console.log("Identifying hash:", signed.hash)
    console.log("Signed blob:", signed.tx_blob)


// Disconnect when done (If you omit this, Node.js won't end the process)
client.disconnect()
}


/////////////////////
// Run Code
/////////////////////
main()























