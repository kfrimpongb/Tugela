const express = require("express");
const app = express();
const xrpl = require("xrpl");

app.use(express.json());

// Dummy database to store escrow data
let escrows = [];
// Dummy database to store funded wallets
let fundedWallets = [];



///----------------------------------------------
// Endpoint to create and fund a wallet
///----------------------------------------------
app.post("/create_and_fund_wallet", async (req, res) => {
  try {
    const { client, wallet } = await createAndFundWallet();

    fundedWallets.push(wallet.wallet.address); // Store the wallet address in the dummy database

    res.status(201).json({ message: "Wallet created and funded successfully", walletAddress: wallet.wallet.address });
  } catch (error) {
    console.error("Error creating and funding wallet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  async function createAndFundWallet() {
    const xrpl = require("xrpl");
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();
  
   const wallet = await client.fundWallet(); // Use the fundWallet function directly
      
    return { client, wallet };
  }
});


///----------------------------------------------
// Endpoint to create an escrow
///----------------------------------------------
app.post("/create_escrow", async (req, res) => {

    const xrpl = require("xrpl");
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    try {
        // Parse the request body to extract "wallet1" and "wallet2"
        const { wallet11, wallet22 } = req.body;

        // // Check if "wallet1" and "wallet2" are provided in the request body
        // if (!wallet1 || !wallet2) {
        // return res.status(400).json({ error: "Missing wallet1 or wallet2 in request body" });
        // }

        // // Helper function to convert wallet input to XRPL wallet object
        // function formatWallet(walletInput) {
        // // Logic to format the wallet input if necessary (e.g., convert from string to XRPL wallet object)
        // return walletInput;
        // }

        // // Convert "wallet1" and "wallet2" to XRPL wallet objects or use them directly if already in correct format
        // const formattedWallet1 = formatWallet(wallet1);
        // const formattedWallet2 = formatWallet(wallet2);

        const memoType = "https://ga.com";

        /////// new
        const agreement = {
            engagementId: "ShXnShf92hfhgj",
            agreementSignedOn: "2023-06-23T10:34:24+00",
            agreementExpiresOn: "2023-12-27T10:34:24+00",
        };

        async function memoStringToHex(str) {
            const hex = Buffer.from(str, "utf8").toString("hex");
            return hex;
        }

        async function createMOU(memoType, agreement) {
        const agreementHex = await memoStringToHex(JSON.stringify(agreement));
        const memoTypeHex = await memoStringToHex(memoType);
        
            return {
                memoType: memoTypeHex,
                memo: agreementHex,
            };
        }

        const contractualAgreement = await createMOU(memoType, agreement);
        ///////

        async function txCreateEscrow(client, contractualAgreement) {
            console.log("2_CREATING_ESCROW: Engagement Agreement between Client and Freelancer");
            const [wallet1, wallet2] = await Promise.all([
                client.fundWallet(),
                client.fundWallet(),
              ]);

            async function toDateTime(secs) {
                var xrpl_epoch = Date.UTC(2000,  0, 1, 0, 0, 0, 0) // XRPL Epoch Jan 1, 2000 00:00
                _secs_after_xrpl_epoch = secs + xrpl_epoch/1000
              
                var t = new Date(1970, 0, 1); // Normal Epoch Jan 1, 1970
                t.setSeconds(_secs_after_xrpl_epoch);
                return t;
            }

            async function getTimes() {
                const now = new Date();
                const utcTimestamp = Date.UTC(
                  now.getUTCFullYear(),
                  now.getUTCMonth(),
                  now.getUTCDate(),
                  now.getUTCHours(),
                  now.getUTCMinutes(),
                  now.getUTCSeconds(),
                  now.getUTCMilliseconds()
                );
                const xrplEpoch = Date.UTC(2000, 0, 1, 0, 0, 0, 0);
                const deltaEpoch = Math.floor((utcTimestamp - xrplEpoch) / 1000);
            
                const finishAfter = deltaEpoch + 2;
                const cancelAfter = deltaEpoch + 60 * 10;
            
                return {
                  finishAfter,
                  cancelAfter,
                };
            }
        
            const delta = await getTimes();
            // const expiration = new Date((delta.cancelAfter + Date.UTC(2000, 0, 1, 0, 0, 0, 0)) * 1000);
            const expiration = await toDateTime(delta.cancelAfter)
        
            console.log("wallet1.wallet.address: ", wallet1.wallet.address);
            console.log("wallet2.wallet.address: ", wallet2.wallet.address);
        
            const createEscrow = await client.autofill({
              Account: wallet1.wallet.address,
              TransactionType: "EscrowCreate",
              Amount: xrpl.xrpToDrops("30"),
              Destination: wallet2.wallet.address,
              Memos: [
                {
                  Memo: {
                    MemoType: contractualAgreement.memoType,
                    MemoData: contractualAgreement.memo,
                  },
                },
              ],
              CancelAfter: delta.cancelAfter,
              FinishAfter: delta.finishAfter,
              DestinationTag: 23480,
              SourceTag: 11747,
            });
        
            const offerSequence = createEscrow.Sequence;
            const signedWallet1 = wallet1.wallet.sign(createEscrow);
            const tx = await client.submitAndWait(signedWallet1.tx_blob);
            const createEscrowTxHash = tx.result.hash;
        
            return { createEscrowTxHash, offerSequence, expiration };
          }

        ////////////////////////////
        // Create the escrow with the provided wallets
        const escrowState = await txCreateEscrow(client, contractualAgreement);

        // Log escrow creation details
        console.log(" - Escrow-Create Transaction hash:", escrowState.createEscrowTxHash);
        console.log(" - Waiting for client to sign off on completed work according to the Engagement Agreement...");
        console.log(" - Escrow Expiration Datetime:", escrowState.expiration);
        console.log('\n');

        // Store the escrow details in a dummy database
        escrows.push({ id: escrowState.createEscrowTxHash, status: 'created' });

        // Respond with success message and escrow ID
        res.status(201).json({ message: "Escrow created successfully", escrowId: escrowState.createEscrowTxHash });

    } catch (error) {
        console.error("Error creating escrow:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  

///----------------------------------------------
// Endpoint to close an escrow
///----------------------------------------------
app.post("/close_escrow", async (req, res) => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

  try {
    const { escrowId, createEscrowTxHash, offerSequence, expiration } = req.body;

    console.log("escrowId: ", escrowId);

    if (!escrowId) {
      return res.status(400).json({ error: "Missing escrowId field" });
    }

    const escrow = escrows.find(escrow => escrow.id === escrowId);

    // if (!escrow) {
    //   return res.status(404).json({ error: "Escrow not found" });
    // }

    ////////
    // const { client, wallet1, contractualAgreement } = await initialize();
    async function txFinishEscrow(client, contractualAgreement, escrowState) {
        console.log("3_FINISHING_ESCROW: Client verifies and approves Freelancer's completed work");
        const [wallet1, wallet2] = await Promise.all([
            client.fundWallet(),
            client.fundWallet(),
          ]);
    
        const finishEscrow = await client.autofill({
          Account: wallet1.wallet.address,
          TransactionType: "EscrowFinish",
          Owner: wallet1.wallet.address,
          OfferSequence: escrowState.offerSequence,
          Condition: contractualAgreement.offerCondition,
          Fulfillment: contractualAgreement.fulfillment,
          Memos: [
            {
              Memo: {
                MemoType: contractualAgreement.memoType,
                MemoData: contractualAgreement.memo,
              },
            },
          ],
        });
    
        const signedWallet1 = wallet1.wallet.sign(finishEscrow);
        const tx = await client.submitAndWait(signedWallet1.tx_blob);
        const finishEscrowTxHash = tx.result.hash;
    
        return { finishEscrowTxHash };
    }

    const [wallet1, wallet2] = await Promise.all([
        client.fundWallet(),
        client.fundWallet(),
    ]);

    ////////

    const memoType = "https://ga.com";
    const agreement = {
        engagementId: "ShXnShf92hfhgj",
        agreementSignedOn: "2023-06-23T10:34:24+00",
        agreementExpiresOn: "2023-12-27T10:34:24+00",
    };

    async function memoStringToHex(str) {
        const hex = Buffer.from(str, "utf8").toString("hex");
        return hex;
    }

    const agreementHex = await memoStringToHex(JSON.stringify(agreement));
    const memoTypeHex = await memoStringToHex(memoType);

    const contractualAgreement = {memoType: memoTypeHex, memo: agreementHex};

    const escrowState = { createEscrowTxHash, offerSequence, expiration };
    
    const finishEscrowResult = await txFinishEscrow(client, contractualAgreement, escrowState);

    console.log(" - Escrow-Close Transaction hash:", finishEscrowResult.finishEscrowTxHash);
    console.log("4_FINISHED: Confirm Freelancer received payment for completed services");

    escrows = escrows.filter(escrow => escrow.id !== escrowId); // Removing escrow from dummy database

    res.json({ message: "Escrow closed successfully" });

    const transactionResponse = await client.request({
        command: "tx",
        transaction: finishEscrowResult.finishEscrowTxHash,
      });
    
      if (transactionResponse.result.meta.TransactionResult === "tesSUCCESS") {
        console.log(" - Payment Result:", transactionResponse.result.meta.TransactionResult);
        console.log(" - Payment Successful");
        console.log(transactionResponse);
      } else {
        console.log(" - Payment Result:", transactionResponse.result.meta.TransactionResult);
        console.log(" - Payment Failed");
    }

    client.disconnect();

  } catch (error) {
    console.error("Error closing escrow:", error);
    res.status(500).json({ error: "Internal Server Error" });
    client.disconnect();
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
