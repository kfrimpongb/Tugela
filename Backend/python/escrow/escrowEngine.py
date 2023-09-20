import os
import uuid
import json
import time
import typing
import edgedb
import datetime
import dataclasses
from os import urandom
from cryptoconditions import PreimageSha256
from cryptography.fernet import Fernet

# Load environment variables from a .env file 
load_dotenv()

# Define environment variables
EDB_DATABASE = os.environ.get("edb_database")
EDB_HOST = os.environ.get("edb_host")
EDB_PORT = os.environ.get("edb_port")
EDB_USER = os.environ.get("edb_user")
EDB_PASSWORD = os.environ.get("edb_password")

SECRET_FULFILLMENT = os.environ.get("SECRET_FULFILLMENT")

# Connect to database
def connect():
    return edgedb.create_async_client(
        database=EDB_DATABASE,
        host=EDB_HOST,
        port=EDB_PORT,
        user=EDB_USER,
        password=EDB_PASSWORD,
        tls_security="insecure"  # Replace with proper TLS settings
    )

# Get the current time based on the Ripple Epoch time format
def rippleEpochNow():
    # Get the current time in milliseconds, convert it to seconds, and adjust for Ripple Epoch
    millis = int(time.time() * 1000)
    epochSecs = millis // 1000
    return epochSecs - 946684800

# Calculate the time when an escrow should be canceled
def calculateCancelAfter(deltaDays):
    # Calculate the number of seconds in the specified number of days and add to the current Ripple Epoch time
    seconds = deltaDays * 24 * 60 * 60
    return rippleEpochNow() + seconds

# Generate a condition and fulfillment for the escrow
def calculateCondition():
    secret = urandom(32)
    fulfillment = PreimageSha256(preimage=secret)

    # Get the condition and serialize the fulfillment
    condition = fulfillment.condition_binary.hex().upper()
    fulfillment = fulfillment.serialize_binary().hex().upper()

    # Encrypt the fulfillment with a secret key using Fernet
    fernet = Fernet(SECRET_FULFILLMENT)
    fulfillment_bytes = bytes(fulfillment, 'utf-8')
    fulfillment_encrypted = fernet.encrypt(fulfillment_bytes)

    return condition, fulfillment_encrypted.decode('utf-8')

# Define a data class to represent the result of saving an escrow quotation
@dataclasses.dataclass
class QuotationSaveEscrowResult(NoPydanticValidation):
    id: uuid.UUID

# Select a quotation for escrow
async def quotation_select_for_escrow(
    executor: edgedb.AsyncIOExecutor,
    *,
    client_id: uuid.UUID,
    quotation_id: uuid.UUID,
) -> typing.Optional[QuotationSelectForEscrowResult]:
    # Query the database to select a quotation for escrow based on the client_id and quotation_id
    return await executor.query_single(
        """\
        select default::Quotation {
          amount,
          lockUpdays,
          location : {
            public_address
          },
          engagement : {
            client : {
              id,
              public_address
            }
          },
          escrow_payload,
          escrow_wallet_payload_uuid,
          escrow_state
        } filter .engagement.client.id = <std::uuid> $client_id and
          .id = <std::uuid> $quotation_id\
        """,
        client_id=client_id, 
        quotation_id=quotation_id,
    )

# Create an escrow payload based on a quotation and user ID
async def createEscrowPayloadByQuotation(userId, quotationId):
    conn = connect()

    # Select the quotation for escrow based on user ID and quotation ID
    quotation = await quotationSelectForEscrow(conn, quotationId=quotationId, clientId=userId)

    if quotation != None :
        if quotation.escrowPayload != None:
            # If an escrow payload already exists, return it
            payload = json.loads(quotation.escrowPayload)
            return {
                "_action": "CachedEscrow",
                "tx": payload
            }
        else:
            # Create a builder for the escrow payload in JSON format
            escrowBuilder = EscrowCreatePayloadJsonBuilder(
                amount=quotation.totalAmount, 
                clientAddress=quotation.job.client.publicAddress, 
                destineAddress=quotation.destine.publicAddress,
                deltaDays=quotation.deltaDays
            )
            
            # Build the payload and get the fulfillment
            payload = escrowBuilder.build()
            fullfilment = escrowBuilder.getFullfilment()

            escrowPayload = json.dumps(payload)
            escrowFullfilment = str(fullfilment)
            
            # Save the escrow in the database
            conn = getConn()
            quotation = await quotationSaveEscrow(conn, 
                                                    clientId=userId,
                                                    quotationId=quotationId, 
                                                    escrowPayload=escrowPayload,
                                                    escrowFullfilment=escrowFullfilment)
        
            return {
                "_action": "NewEscrow",
                "tx": payload
            }
    else:
        return None

# Class to build an escrow payload in JSON format
class EscrowCreatePayloadJsonBuilder:
    
    def __init__(self, clientAddress, destineAddress, amount, deltaDays):
        self.account = clientAddress
        self.destination = destineAddress
        self.amount = str(int(amount*1000000)) # Amount in drops
        self.cancelAfter = calculateCancelAfter(deltaDays)
        
        condition, fullfilment = calculateCondition()
        self.condition = condition
        self.fullfilment = fullfilment

    def getFullfilment(self):
        # Get the escrow fulfillment
        return self.fullfilment
    
    def build(self):
        # Build and return the escrow payload
        return {
            "Account": self.account,
            "TransactionType": "EscrowCreate",
            "Amount": self.amount,
            "Destination": self.destination,
            "CancelAfter": self.cancelAfter,
            "Condition": self.condition,
            "DestinationTag": 1,
            "SourceTag": 1
        }
