const xrpl = require("xrpl");

async function main() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  console.log("1_GENERATING_WALLETS: Client and Freelancer");
  const [wallet1, wallet2] = await Promise.all([
    client.fundWallet(),
    client.fundWallet(),
  ]);

  console.log(" - client address:", wallet1.wallet.address);
  console.log(" - freelancer address:", wallet2.wallet.address);

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

  async function txCreateEscrow(client, wallet1, wallet2, contractualAgreement) {
    console.log("2_CREATING_ESCROW: Engagement Agreement between Client and Freelancer");

    const delta = await getTimes();
    const expiration = new Date((delta.cancelAfter + Date.UTC(2000, 0, 1, 0, 0, 0, 0)) * 1000);

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

  async function txFinishEscrow(client, wallet1, contractualAgreement, escrowState) {
    console.log("3_FINISHING_ESCROW: Client verifies and approves Freelancer's completed work");

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

  const memoType = "https://ga.com";
  const agreement = {
    engagementId: "ShXnShf92hfhgj",
    agreementSignedOn: "2023-06-23T10:34:24+00",
    agreementExpiresOn: "2023-12-27T10:34:24+00",
  };

  const contractualAgreement = await createMOU(memoType, agreement);
  const escrowState = await txCreateEscrow(client, wallet1, wallet2, contractualAgreement);

  console.log(" - Escrow-Create Transaction hash:", escrowState.createEscrowTxHash);
  console.log(" - Waiting for client to sign off on completed work according to the Engagement Agreement...");
  console.log(" - Escrow Expiration Datetime:", escrowState.expiration);
  console.log('\n');

  const finishEscrowResult = await txFinishEscrow(client, wallet1, contractualAgreement, escrowState);

  console.log(" - Escrow-Close Transaction hash:", finishEscrowResult.finishEscrowTxHash);
  console.log('\n');
  console.log("4_FINISHED: Confirm Freelancer received payment for completed services");

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
}

main();
