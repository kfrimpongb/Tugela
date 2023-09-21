import os
import uuid
import json
import secrets
import logging
from os import urandom
from datetime import datetime, timedelta
from xrpl.clients import JsonRpcClient
from xrpl.models import EscrowCreate
from xrpl.transaction import submit_and_wait
from xrpl.utils import datetime_to_ripple_time, xrp_to_drops
from xrpl.wallet import generate_faucet_wallet

from cryptography.fernet import Fernet
from cryptoconditions import PreimageSha256
from google.cloud import secretmanager
import mysql.connector


########################
# Initialize Logging 
########################
logger = logging.getLogger("escrowProcess")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
logger.addHandler(handler)

########################
# Escrow Process
########################
class escrowProcess():
    def __init__(self):
        self.db = "TUGELA"
        self.table = "profiles"
        self.client = JsonRpcClient("https://s.altnet.rippletest.net:51234") 
        os.environ['GOOGLE_APP_CREDENTIALS'] = os.getcwd() + '../../config/tugela-dev_api.json'
        self.SECRET_FULFILLMENT = os.environ.get("SECRET_FULFILLMENT")
        self._client  = secretmanager.SecretManagerServiceClient()
        self.response = self._client.access_secret_version(request={"name" : "projects/56372958347/secrets/api/versions/latest"})
        self.payload  = response.payload.data.decode("UTF-8")
        self.secrets  = json.loads(payload)
        self.connectionFailed = True

    def getSecret(self, secret):
        return self.secrets[secret]

    ### Connect to MySQL
    def connect(self):
        self.conn = mysql.connector.connect(
             host = getSecret('mysql_endpoint'),
             port = getSecret('mysql_port'),
             user = getSecret('mysql_username'),
             password = getSecret('mysql_password'),
             db = getSecret(self.db)
        )

    ### Close db connection
    def closeConnection(self):
        if self.connectionFailed == False:
            self.conn.close()

    ### Generate an escrow condition
    def generateCondition(self, params):
        simulate = params["simulate"]

        if simulate == True:
            self.condition = "A02580205A0E9E4018BE1A6E0F51D39B483122EFDF1DDEF3A4BE83BE71522F9E8CDAB179810120"
            self.fulfillment = ""
        else:
            secret = secrets.token_bytes(32)  # Use secrets module for cryptographically secure random bytes

            # Create a PreimageSha256 fulfillment
            fulfillment = PreimageSha256(preimage=secret)
            self.condition = fulfillment.condition_uri  # Get the condition as a URI string
            fulfillment_str = fulfillment.serialize_uri()  # Get the serialized fulfillment as a URI string

            fernet = Fernet(self.SECRET_FULFILLMENT)
            self.fulfillment = fernet.encrypt(bytes(fulfillment_str, 'utf-8')).decode('utf-8')

    def restoreFulfillment(self, fulfillment_encrypted):
        fernet = Fernet(self.SECRET_FULFILLMENT)
        fulfillment_bytes = fernet.decrypt(fulfillment_encrypted.encode('utf-8')).decode('utf-8')
        
        # Deserialize the fulfillment
        fulfillment = PreimageSha256.from_uri(fulfillment_bytes)

        return fulfillment.preimage.hex()

    ### Create the terms of the engagement
    def createEscrowDetails(self, params, engagementLength, freelancerAddress, amount):
        simulate = params["simulate"]

        if simulate == True:
            self.claim_date   = datetime_to_ripple_time(datetime.now() + timedelta(days=3))
            self.expiry_date  = datetime_to_ripple_time(datetime.now() + timedelta(days=5))
            self.patronWallet = generate_faucet_wallet(client=self.client)

            # Generates condition and fulfillment
            self.generateCondition(params)
        else:
            self.claim_date = datetime_to_ripple_time(datetime.now() + timedelta(days=engagementLength))
            self.expiry_date = datetime_to_ripple_time(datetime.now() + timedelta(days=engagementLength) + timedelta(days=7))
            ## Create code to generate wallet from seed and replace faucet
            # self.patronWallet = ""
            self.patronWallet = generate_faucet_wallet(client=self.client)

            # push data to database
            db = self.db
            table = self.table

            # Connect to database
            try:
                self.connect()
                self.connectionFailed = False
            except Exception as error:
                self.connectionFailed = True
                logger.error("UNABLE_TO_CONNECT_TO_DB: {0}".format(error))

            escrowId = str(uuid.uuid4())
            condition = self.condition
            patronAddress = self.patronWallet.address
            creationDatetime = datetime.now()
            
            try:
                self.query = "INSERT INTO {0}.{1} (escrowId, condition, amount, patronAddress, freelancerAddress, self.claim_date, self.expiry_date, datetime) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);".format(db, table)
                
                obj = (escrowId, condition, amount, patronAddress, freelancerAddress, creationDatetime)
                mysql_statement = self.conn.cursor()
                mysql_statement.execute(self.query, obj)
                self.conn.commit()

                logger.info("SUCCESSFULLY_INSERTED_ESCROW_DETAILS_TO_DB")
                self.closeConnection()
            except Exception as error:
                logger.error("FAILED_TO_INSERT_ESCROW_DETAILS_TO_DB: {0}".format(error))
                self.closeConnection()
    
    ### Retrieve escrow details from db
    def getEscrowDetails(self, params, patronAddress, escrowId):
        db = self.db
        table = self.table

        # Connect to database
        try:
            self.connect()
        except Exception as error:
            logger.error("UNABLE_TO_CONNECT_TO_DB: {0}".format(error))

        self.query = "SELECT * FROM {0}.{1} WHERE escrowId = '{2}';".format(db, table)

        try:
            mysql_statement = self.conn.cursor()
            mysql_statement.execute(self.query)
            self.escrowParams = mysql_statement.fetchall()
            # self.closeConnection()
        except Exception as error:
            logger.error("FAILED_TO_GET_ESCROW_DETAILS_FROM_DB: {0}".format(error))
            # self.closeConnection()

    def createAndSubmitEscrow(self, params, patronAddress, escrowId):
        simulate = params["simulate"]

        if simulate == True:
            patronAddress = self.patronWallet.address

            self.generateCondition(params)
            amount            = params["amount"]
            claim_date        = self.claim_date 
            expiry_date       = self.expiry_date
            condition         = self.condition
            freelancerAddress = params["freelancerAddress"]
        else:
            # Get escrow parameters
            self.getEscrowDetails(patronAddress, escrowId)

            condition         = self.escrowParams[0][1]
            amount            = self.escrowParams[0][2]
            freelancerAddress = self.escrowParams[0][4]
            claim_date        = self.escrowParams[0][7]
            expiry_date       = self.escrowParams[0][8]
            
        # Build escrow create transaction
        create_txn = EscrowCreate(account = patronAddress,
                                  amount = xrp_to_drops(amount), 
                                  destination = freelancerAddress,
                                  finish_after = claim_date, 
                                  cancel_after = expiry_date,
                                  condition = condition)

        # Autofill, sign, then submit transaction and wait for result
        stxn_response = submit_and_wait(create_txn, self.client, self.patronWallet)

        # Return result of transaction
        stxn_result = stxn_response.result

        # Parse results and push details to db
        try:
            db = self.db
            table = self.table

            self.result_query = "UPDATE {0}.{1} SET escrowState = {2}, ledgerSequence = {3} WHERE escrowId = {4};" .format(db, table, json.dumps(stxn_result), stxn_result["Sequence"], escrowId)
            mysql_statement = self.conn.cursor()
            mysql_statement.execute(self.result_query)
            self.conn.commit()
            logger.info("SUCCESSFULLY_INSERTED_ESCROW_STATE_DETAILS_TO_DB")
            self.closeConnection()
        except Exception as error:
            logger.error("FAILED_TO_INSERT_ESCROW_STATE_DETAILS_TO_DB: {0}".format(error))
            self.closeConnection()

        logger.info("ESCROW_RESULT: {0}".format(stxn_result["meta"]["TransactionResult"]))
        logger.info("ESCROW_HASH: {0}".format(stxn_result["hash"]))
        logger.info("ESCROW_SEQUENCE: {0}".format(stxn_result["Sequence"]))
        logger.info("PATRON_ADDRESS: {0}".format(stxn_result["Account"]))
        logger.info("FREELANCER_ADDRESS: {0}".format(freelancerAddress))

    ### Create the logic to successfully finish an escrow after an engagement
    def finishEscrowProcess(self):
        # ToDo
        pass



#############
# Unit Test
#############
params = {
            "simulate"          : True,
            "engagementLength"  : 2,
            "amount"            : 15,
            "escrowId"          : "efc43d8e-92c1-4add-9b8e-f9a004ccfff6",
            "patronAddress"     : "rQT1Sjq2YGrBMTttS4GZHjKu9dyfzbpAXg",
            "freelancerAddress" : "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
}

EP = escrowProcess()
EP.createEscrowDetails(params, engagementLength=2, freelancerAddress="rQT1Sjq2YGrBMTttS4GZHjKu9dyfzbpAXg", amount=15)
EP.createAndSubmitEscrow(params, patronAddress="", escrowId="")