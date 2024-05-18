import ast
import ast
import random
import sqlite3
from datetime import datetime, timedelta

import autogen
import jwt
import pandas as pd
from fastapi import HTTPException
from starlette.responses import JSONResponse

from configs import llm_config
from prompts import JOB_RECRUITER_PROXY, JOB_RECRUITER_ASSISTANT


################################
# Gig Recomendation 
################################
class RecommendationEngine():
    def __init__(self):
        # self.db_file = db_file
        self.conn = None
        self.freelancer_schema = ['freelancer_id', 'first_name', 'middle_name', 'last_name', 'email', 'linkedin_url', 'skills', 'country', 'base_currency']
        self.gigs_schema = ['gig_id', 'post_date', 'gig_name', 'client_id', 'description', 'compensation', 'currency', 'timeframe', 'country']
    
    # Database relevant methods
    def connect(self, params):
        db_file = params['db_file']
        self.db_file = db_file
        try:
            self.conn = sqlite3.connect(self.db_file)
            print("Connected to SQLite database")
        except sqlite3.Error as e:
            print(f"Error connecting to SQLite database: {e}")

    def close(self):
        if self.conn:
            self.conn.close()
            print("SQLite database connection closed")

    def create_database(self, params):
        db = params['db']
        try:
            cursor = self.conn.cursor()
            cursor.execute("ATTACH DATABASE '{0}.db' AS {0}".format(db))
            self.conn.commit()
            print("Database '{0}' created successfully".format(db))
        except sqlite3.Error as e:
            print("Error creating database '{0}': {1}".format(db, e))

    def create_freelancers_table(self, params):
        db = params['db']
        freelancer_table = params['freelancer_table']
        try:
            cursor = self.conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS {0} ( \
                    freelancer_id INTEGER PRIMARY KEY, \
                    first_name VARCHAR(250) NOT NULL, \
                    middle_name VARCHAR(250) NOT NULL, \
                    last_name VARCHAR(250) NOT NULL, \
                    email VARCHAR(250), \
                    skills TEXT, \
                    experience TEXT, \
                    linkedin_url TEXT, \
                    country VARCHAR(250), \
                    base_currency VARCHAR(50) \
                ) \
            """.format(freelancer_table))
            self.conn.commit()
            print("{0} table created successfully".format(freelancer_table))
        except sqlite3.Error as e:
            print("Error creating {0} table: {1}".format(freelancer_table, e))

    def insert_mock_freelancers_data(self, params):
        db = params['db']
        freelancer_table = params['freelancer_table']
        try:
            cursor = self.conn.cursor()
            mock_data = [
                ("Danny", "", "Wells", "danny.wells@example.com", "https://www.linkedin.com/in/dannywells", "Python, SQL, Data Analysis", "USA", "USD"),
                ("Jane", "", "Smith", "jane.smith@example.com", "https://www.linkedin.com/in/janesmith", "Java, Spring, Hibernate", "Canada", "CAD"),
            ]
            cursor.executemany("INSERT INTO {0} (first_name, middle_name, last_name, email, linkedin_url, skills, country, base_currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)".format(freelancer_table), mock_data)
            self.conn.commit()
            print("Mock data inserted successfully")
        except sqlite3.Error as e:
            print(f"Error inserting mock data: {e}")

    def fetch_freelancer_data(self, params):
        freelancer_table = params['freelancer_table']
        freelancer_id = params['freelancer_id']
        data = []
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT freelancer_id, first_name, middle_name, last_name, email, linkedin_url, skills, country, base_currency FROM {0} WHERE freelancer_id = '{1}'".format(freelancer_table, freelancer_id))
            data = cursor.fetchall()
            print("Freelancer data fetched successfully:")
        except sqlite3.Error as e:
            print(f"Error fetching freelancer data: {e}")

        return data

    #############
    # Gig Related
    #############
    def create_gigs_table(self, params):
        gigs_table = params['gigs_table']
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS {0} (
                    gig_id INTEGER PRIMARY KEY,
                    post_date DATETIME NOT NULL,
                    gig_name VARCHAR(250) NOT NULL,
                    client_id VARCHAR(250),
                    description TEXT,
                    compensation REAL,
                    currency VARCHAR(250),
                    timeframe VARCHAR(250),
                    country VARCHAR(250)
                )
            '''.format(gigs_table))
            self.conn.commit()
            print("Gigs table created successfully")
        except sqlite3.Error as e:
            print(f"Error creating gigs table: {e}")

    def insert_mock_gigs_data(self, params):
        gigs_table = params['gigs_table']
        try:
            cursor = self.conn.cursor()
            mock_data = [
                ("2024-04-23", "Web Development", "12345", "Develop a new website", '1000', "USD", "2 weeks", "USA"),
                ("2024-04-24", "Mobile App Development", "67890", "Build a mobile app", '1500', "CAD", "1 month", "Canada"),
                # Add more mock data as needed
            ]
            cursor.executemany('''
                INSERT INTO {0} (post_date, gig_name, client_id, description, compensation, currency, timeframe, country)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            '''.format(gigs_table), mock_data)
            self.conn.commit()
            print("Mock data inserted into gigs table successfully")
        except sqlite3.Error as e:
            print(f"Error inserting mock data into gigs table: {e}")

    def fetch_gig_data(self, params):
        # temporary data
        # data = [('a', 'web development', 'aefi32', 'Create a web app intake form', '$500', '2 months', 'USA'),
        #         ('b', 'backend development', 'afdi32', 'Create an iPhone app that measures how long someone spends using social media apps', '$900', '3.5 months', 'USA')]
        gigs_table = params['gigs_table']
        data = []
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT gig_id, post_date, gig_name, client_id, description, compensation, currency, timeframe, country FROM {0}".format(gigs_table))
            data = cursor.fetchall()
            print("Gig data fetched successfully:")
        except sqlite3.Error as e:
            print(f"Error fetching gig data: {e}")
        ### create method to pull gig data
        
        return data

    #################
    # Client Related
    #################

    def insert_client_data(self, params, client_data):
        clients_table = params['clients_table']
        tokens_table = 'tokens_table'  # Assuming the name of the tokens table

        try:
            cursor = self.conn.cursor()
            # Check if the email already exists
            cursor.execute("SELECT email FROM {0} WHERE email = ?".format(clients_table), (client_data['email'],))
            existing_email = cursor.fetchone()

            if existing_email:
                # If the email exists, return a JSON response indicating that the email already exists
                raise HTTPException(status_code=400, detail={"message": "Email already exists", "data": ""})
            # Generate a UUID for client_id
            client_id = random.randint(100000000, 999999999)

            # Generate an access token with a one-week expiration
            token_payload = {
                'client_id': client_id,
                'exp': datetime.utcnow() + timedelta(weeks=1)
            }

            secret_key = '90909jnj935cxjrf'  # Define your secret key
            access_token = jwt.encode(token_payload, secret_key, algorithm='HS256')

            # Execute the first query to insert client data
            cursor.execute('''
                INSERT INTO {0} (client_id, entity_name, entity_id, first_name, middle_name, last_name, email, currency, country, join_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            '''.format(clients_table), (
                client_id,
                client_data.get('entity_name', ''),  # Handle missing entity_name gracefully
                client_data.get('entity_id', ''),  # Handle missing entity_id gracefully
                client_data.get('first_name', ''),  # Handle missing first_name gracefully
                client_data.get('middle_name', ''),  # Handle missing middle_name gracefully
                client_data.get('last_name', ''),  # Handle missing last_name gracefully
                client_data['email'],  # Ensure email is provided
                client_data.get('currency', ''),  # Handle missing currency gracefully
                client_data['country'],  # Ensure country is provided
                client_data.get('join_date', ''),  # Handle missing join_date gracefully
            ))

            # Check if the first query was successful
            if cursor.rowcount == 1:
                # Insert client ID and access token into the tokens table
                cursor.execute('''
                    INSERT INTO {0} (client_id, access_token)
                    VALUES (?, ?)
                '''.format(tokens_table), (
                    client_id,
                    access_token  # Decode bytes to string for SQLite insertion
                ))

                self.conn.commit()
                # Return a JSON response indicating success

                response_content = {
                    "message": "Client created successfully",
                    "data": {
                        "client_id": str(client_id),
                        "access-token": str(access_token)
                    }
                }

                return JSONResponse(status_code=200, content= response_content)
            else:
                # Return a JSON response indicating failure
                return HTTPException(status_code=400, detail={"message": "Failed to create client"})
        except sqlite3.Error as e:
            # Return a JSON response indicating error
            return HTTPException(status_code=400, detail={"error": f"Error creating client: {e}"})
    def create_clients_table(self, params):
        clients_table = params['clients_table']
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS {0} (
                    client_id INTEGER PRIMARY KEY,
                    entity_name VARCHAR(250) NOT NULL,
                    entity_id VARCHAR(250),
                    first_name VARCHAR(250),
                    middle_name VARCHAR(250),
                    last_name VARCHAR(250),
                    email VARCHAR(250),
                    currency VARCHAR(250),
                    country VARCHAR(250),
                    join_date DATE
                    -- Add more columns as needed
                )
            '''.format(clients_table))
            self.conn.commit()
            print("Clients table created successfully")
        except sqlite3.Error as e:
            print(f"Error creating clients table: {e}")

    def create_tokens_table(self):
        tokens_table = 'tokens_table'  # Assuming the name of the tokens table

        try:
            cursor = self.conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS {0} (
                    client_id INTEGER PRIMARY KEY,
                    access_token TEXT NOT NULL,
                    FOREIGN KEY (client_id) REFERENCES clients(client_id)
                    -- Add more columns as needed
                )
            '''.format(tokens_table))
            self.conn.commit()
            print("Tokens table created successfully")
        except sqlite3.Error as e:
            print(f"Error creating tokens table: {e}")

    # Condition data
    def create_dataframe(self, data, _type):
        df_out = pd.DataFrame()
        
        if _type == 'freelancer':
            df_out = pd.DataFrame(data, columns=self.freelancer_schema)

        if _type == 'gigs':
            df_out = pd.DataFrame(data, columns=self.gigs_schema)
            
        return df_out

    def insert_mock_clients_data(self, params):
        clients_table = params['clients_table']
        try:
            cursor = self.conn.cursor()
            mock_data = [
                ("Rainmaker Corp", "12345", "Chris", "", "Nolan", "chris@rainmaker.com", "USD", "USA", "2023-07-26"),
                ("Data Inc", "67890", "Stan", "", "Banks", "stan@datainc.com", "CAD", "Canada", "2021-02-11"),
                # Add more mock data as needed
            ]
            cursor.executemany('''
                INSERT INTO {0} (entity_name, entity_id, first_name, middle_name, last_name, email, currency, country, join_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            '''.format(clients_table), mock_data)
            self.conn.commit()
            print("Mock data inserted into clients table successfully")
        except sqlite3.Error as e:
            print(f"Error inserting mock data into clients table: {e}")

    
    #################
    # Gig Analysis
    #################

    def construct_assessment(self, df_freelancer, df_gig):
        freelancer_details = list(df_freelancer['skills'])
        gig_details = list(df_gig['description'])
        gig_ids = list(df_gig['gig_id'])
        
        message = """
        Assess the freelancer and gig description and create a score. 
        freelancer skills: {0}  
        
        Gig descriptions: {1}
        Gig IDs: {2}
        """.format(freelancer_details, gig_details, gig_ids)
    
        return message

    #################
    # Recruiter Team
    #################
    def recruitment_analysis(self, message):
        recruiter_proxy = autogen.UserProxyAgent(
            name="job_recruiter_proxy",
            system_message=JOB_RECRUITER_PROXY,
            code_execution_config=False,
            is_termination_msg=lambda x: type(x.get("confidence_score","")) == str,
            llm_config=llm_config,
            human_input_mode="NEVER",
        )
        
        recruiter_assistant = autogen.AssistantAgent(
            name="job_recruiter_assistant",
            system_message=JOB_RECRUITER_ASSISTANT,
            llm_config=llm_config,
            human_input_mode="NEVER",
        )
        
        groupchat = autogen.GroupChat(agents=[recruiter_proxy, recruiter_assistant], 
                                      messages=[], 
                                      max_round=12,
                                      admin_name="job_recruiter_proxy",
                                      speaker_selection_method="round_robin")
        manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)
        
        recruiter_proxy.initiate_chat(manager, message=message)
        output_msg = ast.literal_eval(recruiter_proxy.last_message()["content"])
    
        return output_msg

    def sort_job_requests(self, gig_list, params):
        top_n = params['top_n']
        top_gigs = sorted(gig_list, key=lambda x: float(x["success_score"]), reverse=True)
        top_gigs = top_gigs[0:top_n]
        
        return top_gigs




#################
# Test
#################
params = {
            'db'                   : 'tugela',
            'db_file'              : 'tugela.db',
            'freelancer_table'     : 'freelancers',
            'clients_table'        : 'clients',
            'gigs_table'           : 'gigs',
            'freelancer_id'        : '1',
            'create_database'      : False,
            'insert_data'          : False,
            'perform_assessment'   : True,
            'top_n'                : 1,
}


RE = RecommendationEngine()

RE.connect(params)

if params['create_database'] == True:
    RE.create_database(params)
    RE.create_freelancers_table(params)
    RE.create_gigs_table(params)
    RE.create_clients_table(params)
    RE.create_tokens_table()

if params['insert_data'] == True:
    RE.insert_mock_freelancers_data(params)
    RE.insert_mock_clients_data(params)
    RE.insert_mock_gigs_data(params)

if params['perform_assessment'] == True:
    freelancer_data = RE.fetch_freelancer_data(params)
    df_freelancer = RE.create_dataframe(freelancer_data, _type='freelancer')
    
    gig_data = RE.fetch_gig_data(params)
    df_gigs = RE.create_dataframe(gig_data, _type='gigs')
    message = RE.construct_assessment(df_freelancer, df_gigs)
    output_msg = RE.recruitment_analysis(message)
    top_gigs = RE.sort_job_requests(output_msg, params)