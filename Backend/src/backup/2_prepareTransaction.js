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

    // Prepare transaction -------------------------------------------------------
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


// Disconnect when done (If you omit this, Node.js won't end the process)
client.disconnect()
}


/////////////////////
// Run Code
/////////////////////
main()