////////////////////
// Import libs
////////////////////
const xrpl = require("xrpl")

///////////////////////////////////////////////////////////////////////////////////////////
// Generate seed to generate wallet and fund it with XRP
// Use link to generate credentials: https://xrpl.org/send-xrp.html#interactive-prepare
// Balance: 1,000 XRP
///////////////////////////////////////////////////////////////////////////////////////////


async function main() {
    // Connect to the network Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Wallet 1
    const wallet_1 = xrpl.Wallet.fromSeed("ssZwBk1BcT5opaZaHVoEX2Sz9JoG5")
    console.log('wallet_1 address: ', wallet_1.address) // rHHjeVBDP5dgY34X94mcUpGtWpoyRGTNuY

    console.log('\n')

    // Wallet 2
    const wallet_2 = xrpl.Wallet.fromSeed("spApFGEZoUcJbt7MPdaV1CUed4Ji8")
    console.log('wallet_2 address:', wallet_2.address) // rwfCEKfzgsmgMuiqcB4WnMcs4VrGy8UF4M

    console.log('\n')

    // Another Method
    const fund_result = await client.fundWallet()
    // const wallet_test = fund_result.wallet
    console.log(fund_result)
    console.log(fund_result.wallet.seed)

    client.disconnect()

}

/////////////////////
// Run Code
/////////////////////
main()
