const {XummSdk} = require('xumm-sdk')



const main = async () => {
    const fs = require('fs').promises;
    const path = require('path');

    const filePath = '../../../../private/xum_creds.json';
    const paymentFilePath = '../../../../private/payment_details.json';


    // Grab xum details
    async function getcreds(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const credentials = JSON.parse(data);
            const { xum_key, xum_secret } = credentials;
            return { xum_key, xum_secret };
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    }

    // Grab payment details
    async function getpaymentdetails(paymentFilePath) {
        try {
            const data = await fs.readFile(paymentFilePath, 'utf8');
            const paymentinfo = JSON.parse(data);
            const { user_token, payment_address } = paymentinfo;
            return { user_token, payment_address };
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    }


    try {
        const creds = await getcreds(filePath);
        console.log("xum_key:", creds.xum_key);
        console.log("xum_key:", creds.xum_secret);

        const paymentdetails = await getpaymentdetails(paymentFilePath);
        console.log("user_token:", paymentdetails.user_token);
        console.log("payment_address:", paymentdetails.payment_address);

        // Connect to xum
        const Sdk = new XummSdk(creds.xum_key, creds.xum_secret)

        const appInfo = await Sdk.ping()
        console.log(appInfo.application.name)

        const request = {
            "txjson": {
            "TransactionType": "Payment",
            "Destination": paymentdetails.payment_address,
            "Amount": "100"
            },
            "user_token": paymentdetails.user_token
        }

        const subscription = await Sdk.payload.createAndSubscribe(request, event => {
            console.log('New payload event:', event.data)

            // The event data contains a property 'signed' (true or false), return :)
            if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
            }
        })

        console.log('New payload created, URL:', subscription.created.next.always)
        console.log('  > Pushed:', subscription.created.pushed ? 'yes' : 'no')

        const resolveData = await subscription.resolved

        if (resolveData.signed === false) {
            console.log('The sign request was rejected :(')
        } else {
            console.log('Woohoo! The sign request was signed :)')
            /**
             * Let's fetch the full payload end result and check for
             * a transaction hash, to verify the transaction on ledger later.
             */
            const result = await Sdk.payload.get(resolveData.payload_uuidv4)
            console.log('On ledger TX hash:', result.response.txid)
        }  


        } catch (error) {
            console.error('Error:', error.message);
        }
}

main();
