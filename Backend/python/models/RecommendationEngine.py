import ast
import ast
import hashlib
import random
import sqlite3
from datetime import datetime, timedelta

import autogen
import bcrypt
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
        self.freelancer_schema = ['freelancer_id', 'first_name', 'middle_name', 'last_name', 'email', 'linkedin_url',
                                  'skills', 'country', 'base_currency']
        self.gigs_schema = ['gig_id', 'post_date', 'gig_name', 'client_id', 'description', 'compensation', 'currency',
                            'timeframe', 'country']

    # Database relevant methods
    def connect(self, params):
        db_file = params['db_file']
        self.db_file = db_file
        try:
            self.conn = sqlite3.connect(self.db_file, timeout=5)
            print("Connected to SQLite database")
        except sqlite3.Error as e:
            print(f"Error connecting to SQLite database: {e}")

    def close(self):
        if self.conn:
            self.conn.close()
            print("SQLite database connection closed")

    def closeAll(self):
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
                ("Danny", "", "Wells", "danny.wells@example.com", "https://www.linkedin.com/in/dannywells",
                 "Python, SQL, Data Analysis", "USA", "USD"),
                ("Jane", "", "Smith", "jane.smith@example.com", "https://www.linkedin.com/in/janesmith",
                 "Java, Spring, Hibernate", "Canada", "CAD"),
            ]
            cursor.executemany(
                "INSERT INTO {0} (first_name, middle_name, last_name, email, linkedin_url, skills, country, base_currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)".format(
                    freelancer_table), mock_data)
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
            cursor.execute(
                "SELECT freelancer_id, first_name, middle_name, last_name, email, linkedin_url, skills, country, base_currency FROM {0} WHERE freelancer_id = '{1}'".format(
                    freelancer_table, freelancer_id))
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
                ("2024-04-24", "Mobile App Development", "67890", "Build a mobile app", '1500', "CAD", "1 month",
                 "Canada"),
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
            cursor.execute(
                "SELECT gig_id, post_date, gig_name, client_id, description, compensation, currency, timeframe, country FROM {0}".format(
                    gigs_table))
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

            join_date = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

            # Execute the first query to insert client data

            cursor.execute('''
                INSERT INTO {0} (client_id, entity_name, entity_id, first_name, middle_name, last_name, email, currency, country,join_date ,password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                join_date,  # Handle missing join_date gracefully
                client_data.get('password', ''),  # Handle missing join_date gracefully
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

                return JSONResponse(status_code=200, content=response_content)
            else:
                # Return a JSON response indicating failure
                return HTTPException(status_code=400, detail={"message": "Failed to create client"})
        except sqlite3.Error as e:
            # Return a JSON response indicating error
            return HTTPException(status_code=400, detail={"error": f"Error creating client: {e}"})

    def insert_customer_data(self, params, customer_data):
        clients_table = params['clients_table']
        customer_type = customer_data['customer_type']
        freelancers_table = params['freelancer_table']  # Assuming the name of the freelancers table
        tokens_table = 'tokens_table'  # Assuming the name of the tokens table

        try:
            cursor = self.conn.cursor()

            # Determine the target table based on the customer type
            if customer_type == 'client':
                target_table = clients_table
                id_field = 'client_id'
            elif customer_type == 'freelancer':
                id_field = 'freelancer_id'
                target_table = freelancers_table
            else:
                raise HTTPException(status_code=400, detail={"message": "Invalid customer type"})

            # Begin immediate transaction
            cursor.execute("BEGIN IMMEDIATE")

            # Check if the email already exists in the target table
            cursor.execute(f"SELECT email FROM {target_table} WHERE email = ?", (customer_data['email'],))
            existing_email = cursor.fetchone()

            if existing_email:
                # If the email exists, return a JSON response indicating that the email already exists
                raise HTTPException(status_code=400, detail={"message": "Email already exists", "data": ""})

            # Generate a UUID for client_id
            customer_id = random.randint(100000000, 999999999)

            # Generate an access token with a one-week expiration
            token_payload = {
                id_field: customer_id,
                'exp': datetime.utcnow() + timedelta(weeks=1)
            }

            secret_key = '90909jnj935cxjrf'  # Define your secret key
            access_token = jwt.encode(token_payload, secret_key, algorithm='HS256')

            join_date = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

            if customer_type == "freelancer":
                cursor.execute(f'''
                               INSERT INTO {target_table} (freelancer_id, first_name, middle_name, last_name, email, skills, experience, country, join_date, password)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                           ''', (
                    customer_id,
                    customer_data.get('first_name', ''),  # Handle missing first_name gracefully
                    customer_data.get('middle_name', ''),  # Handle missing middle_name gracefully
                    customer_data.get('last_name', "dasx"),  # Handle missing last_name gracefully
                    customer_data['email'],  # Ensure email is provided
                    customer_data.get('skills', ''),  # Handle missing skills gracefully
                    customer_data.get('experience', ''),  # Handle missing experience gracefully
                    customer_data['country'],  # Ensure country is provided
                    join_date,  # Handle missing join_date gracefully
                    customer_data.get('password', '')  # Handle missing password gracefully
                ))
            else:
                cursor.execute(f'''
                    INSERT INTO {target_table} (client_id, entity_name, entity_id, first_name, middle_name, last_name, email, currency, country, join_date, password)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    customer_id,
                    customer_data.get('entity_name', ''),  # Handle missing entity_name gracefully
                    customer_data.get('entity_id', ''),  # Handle missing entity_id gracefully
                    customer_data.get('first_name', ''),  # Handle missing first_name gracefully
                    customer_data.get('middle_name', ''),  # Handle missing middle_name gracefully
                    customer_data.get('last_name', ''),  # Handle missing last_name gracefully
                    customer_data['email'],  # Ensure email is provided
                    customer_data.get('currency', ''),  # Handle missing currency gracefully
                    customer_data['country'],  # Ensure country is provided
                    join_date,  # Handle missing join_date gracefully
                    customer_data.get('password', '')  # Handle missing password gracefully
                ))

            # Check if the query was successful
            if cursor.rowcount == 1:
                # Insert client ID and access token into the tokens table
                cursor.execute(f'''
                    INSERT INTO {tokens_table} (client_id, access_token)
                    VALUES (?, ?)
                ''', (
                    customer_id,
                    access_token  # Decode bytes to string for SQLite insertion
                ))

                self.conn.commit()
                # Return a JSON response indicating success
                response_content = {
                    "message": "Customer created successfully",
                    "data": {
                        "client_id": str(customer_id),
                        "access-token": str(access_token)
                    }
                }

                return JSONResponse(status_code=200, content=response_content)
            else:
                # Return a JSON response indicating failure
                raise HTTPException(status_code=400, detail={"message": "Failed to create customer"})
        except sqlite3.Error as e:
            # Rollback in case of error
            self.conn.rollback()
            # Return a JSON response indicating error
            raise HTTPException(status_code=400, detail={"error": f"Error creating customer: {e}"})
        finally:
            cursor.close()

    def create_customer_data(self, params, customer_data):
        clients_table = params['clients_table']
        customer_type = customer_data['customer_type']
        freelancers_table = params['freelancer_table']  # Assuming the name of the freelancers table
        tokens_table = 'tokens_table'  # Assuming the name of the tokens table

        try:
            with self.conn:  # Use a context manager to handle transactions
                cursor = self.conn.cursor()

                # Determine the target table based on the customer type
                if customer_type == 'client':
                    target_table = clients_table
                    id_field = 'client_id'
                elif customer_type == 'freelancer':
                    id_field = 'freelancer_id'
                    target_table = freelancers_table
                else:
                    raise HTTPException(status_code=400, detail={"message": "Invalid customer type"})

                # Check if the email already exists in the target table
                cursor.execute(f"SELECT email FROM {target_table} WHERE email = ?", (customer_data['email'],))
                existing_email = cursor.fetchone()

                if existing_email:
                    # If the email exists, return a JSON response indicating that the email already exists
                    raise HTTPException(status_code=400, detail={"message": "Email already exists", "data": ""})

                # Generate a UUID for client_id
                customer_id = random.randint(100000000, 999999999)

                # Generate an access token with a one-week expiration
                token_payload = {
                    id_field: customer_id,
                    'exp': datetime.utcnow() + timedelta(weeks=1)
                }

                secret_key = '90909jnj935cxjrf'  # Define your secret key
                access_token = jwt.encode(token_payload, secret_key, algorithm='HS256')

                join_date = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

                hashed_password = self.hash_password(customer_data['password'])

                # Insert the customer data into the appropriate table
                cursor.execute(f'''
                    INSERT INTO {target_table} ({id_field}, email, join_date, password)
                    VALUES (?, ?, ?, ?)
                ''', (
                    customer_id,
                    customer_data['email'],  # Ensure email is provided
                    join_date,  # Current timestamp
                    hashed_password  # Ensure password is provided
                ))

                # Insert client ID and access token into the tokens table
                cursor.execute(f'''
                    INSERT INTO {tokens_table} (client_id, access_token)
                    VALUES (?, ?)
                ''', (
                    customer_id,
                    access_token
                ))

                # Return a JSON response indicating success
                response_content = {
                    "message": "Customer created successfully",
                    "data": {
                        "user_id": str(customer_id),
                        "access-token": str(access_token),
                        "user_type": customer_type
                    }
                }

                return JSONResponse(status_code=200, content=response_content)

        except sqlite3.IntegrityError as e:
            # Handle integrity errors (e.g., unique constraint violations)
            raise HTTPException(status_code=400, detail={"error": "Integrity error: " + str(e)})
        except sqlite3.OperationalError as e:
            # Handle operational errors (e.g., database is locked)
            raise HTTPException(status_code=400, detail={"error": "Operational error: " + str(e)})
        except sqlite3.Error as e:
            # Handle other SQLite errors
            raise HTTPException(status_code=400, detail={"error": f"Error creating customer: {e}"})

    def sign_in(self, params, sign_in_data):
        clients_table = params['clients_table']
        freelancers_table = params['freelancer_table']
        tokens_table = 'tokens_table'

        try:
            with self.conn:
                cursor = self.conn.cursor()

                # Check the email in clients table
                cursor.execute(
                    f"SELECT client_id, email, password, entity_name FROM {clients_table} WHERE email = ?",
                    (sign_in_data['email'],))
                client = cursor.fetchone()

                if client:
                    user_id, email, hashed_password, entity_name = client
                    is_profile_complete = bool(entity_name)
                    customerType = "client"
                else:
                    # Check the email in freelancers table
                    cursor.execute(
                        f"SELECT freelancer_id, first_name, last_name, password FROM {freelancers_table} WHERE email = ?",
                        (sign_in_data['email'],))
                    freelancer = cursor.fetchone()
                    customerType = "freelancer"

                    if not freelancer:
                        raise HTTPException(status_code=400, detail={"message": "Invalid email or password"})

                    user_id, first_name, last_name, hashed_password = freelancer
                    is_profile_complete = bool(first_name and last_name)

                # Verify the password
                if not self.verify_password(sign_in_data['password'], hashed_password):
                    raise HTTPException(status_code=400, detail={"message": "Invalid email or password"})

                # Generate a new access token with a one-week expiration
                token_payload = {
                    'user_id': user_id,
                    'exp': datetime.utcnow() + timedelta(weeks=1)
                }
                access_token = jwt.encode(token_payload, "90909jnj935cxjrf", algorithm='HS256')

                # Update the token table with the new token
                cursor.execute(f'''
                       INSERT OR REPLACE INTO {tokens_table} (client_id, access_token)
                       VALUES (?, ?)
                   ''', (user_id, access_token))

                response_content = {
                    "message": "Sign-in successful",
                    "data": {
                        "user_id": str(user_id),
                        "access_token": str(access_token),
                        "is_profile_complete": is_profile_complete,
                        "user_type": customerType
                    }
                }

                return JSONResponse(status_code=200, content=response_content)

        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail={"error": f"Error signing in: {e}"})

    def hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode(), salt)
        return hashed

    def verify_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode(), hashed_password)

    def update_customer_data(self, params, customer_data, client_id):
        clients_table = params['clients_table']
        if not client_id:
            raise HTTPException(status_code=400, detail={"message": "client_id is required"})

        try:
            cursor = self.conn.cursor()
            cursor.execute("BEGIN IMMEDIATE")

            cursor.execute(f"SELECT client_id FROM {clients_table} WHERE client_id = ?", (client_id,))
            existing_customer = cursor.fetchone()

            if not existing_customer:
                raise HTTPException(status_code=404, detail={"message": "Customer not found", "data": ""})

            # Fields allowed to be updated
            fields = ['entity_name', 'entity_id', 'first_name', 'middle_name', 'last_name',
                      'country', 'currency', 'join_date']

            update_fields = []
            update_values = []

            for field in fields:
                if field in customer_data and customer_data[field] is not None:
                    update_fields.append(f"{field} = ?")
                    update_values.append(customer_data[field])

            if update_fields:
                update_values.append(client_id)
                cursor.execute(f"UPDATE {clients_table} SET {', '.join(update_fields)} WHERE client_id = ?",
                               update_values)

            if cursor.rowcount == 1:
                self.conn.commit()
                response_content = {
                    "message": "Customer updated successfully",
                    "data": {
                        "client_id": str(client_id)
                    }
                }
                return JSONResponse(status_code=200, content=response_content)
            else:
                raise HTTPException(status_code=400, detail={"message": "Failed to update customer"})

        except sqlite3.Error as e:
            self.conn.rollback()
            raise HTTPException(status_code=400, detail={"error": f"Error updating customer: {e}"})
        finally:
            cursor.close()

    def update_freelancer_data(self, params, freelancer_data, freelancer_id):
        freelancers_table = params['freelancer_table']

        if not freelancer_id:
            raise HTTPException(status_code=400, detail={"message": "freelancer_id is required"})

        try:
            cursor = self.conn.cursor()
            cursor.execute("BEGIN IMMEDIATE")

            cursor.execute(f"SELECT freelancer_id FROM {freelancers_table} WHERE freelancer_id = ?", (freelancer_id,))
            existing_freelancer = cursor.fetchone()

            if not existing_freelancer:
                raise HTTPException(status_code=404, detail={"message": "Freelancer not found", "data": ""})

            # Fields allowed to be updated
            fields = ['first_name', 'middle_name', 'last_name', 'skills', 'experience', 'linkedin_url', 'country',
                      'base_currency', 'join_date']

            update_fields = []
            update_values = []

            for field in fields:
                if field in freelancer_data and freelancer_data[field] is not None:
                    if field == 'skills':
                        # Convert list of skills to a comma-separated string for storage
                        skills_str = ','.join(freelancer_data[field])
                        update_fields.append(f"{field} = ?")
                        update_values.append(skills_str)
                    else:
                        update_fields.append(f"{field} = ?")
                        update_values.append(freelancer_data[field])

            if update_fields:
                update_values.append(freelancer_id)
                cursor.execute(f"UPDATE {freelancers_table} SET {', '.join(update_fields)} WHERE freelancer_id = ?",
                               update_values)

            if cursor.rowcount == 1:
                self.conn.commit()
                response_content = {
                    "message": "Freelancer updated successfully",
                    "data": {
                        "freelancer_id": str(freelancer_id)
                    }
                }
                return JSONResponse(status_code=200, content=response_content)
            else:
                raise HTTPException(status_code=400, detail={"message": "Failed to update freelancer"})

        except sqlite3.Error as e:
            self.conn.rollback()
            raise HTTPException(status_code=400, detail={"error": f"Error updating freelancer: {e}"})
        finally:
            cursor.close()

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

            join_date = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

            # Execute the first query to insert client data
            cursor.execute('''
                INSERT INTO {0} (client_id, entity_name, entity_id, first_name, middle_name, last_name, email, currency, country,join_date ,password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                join_date,  # Handle missing join_date gracefully
                client_data.get('password', ''),  # Handle missing join_date gracefully
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

                return JSONResponse(status_code=200, content=response_content)
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
                    entity_name VARCHAR(250),
                    entity_id VARCHAR(250),
                    first_name VARCHAR(250),
                    middle_name VARCHAR(250),
                    last_name VARCHAR(250),
                    email VARCHAR(250),
                    currency VARCHAR(250),
                    country VARCHAR(250),
                    join_date DATE,
                    password VARCHAR(250)
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
                ("Rainmaker Corp", "12345", "Chris", "", "Nolan", "chris@rainmaker.com", "USD", "USA", "2023-07-26",
                 "QWEQWE"),
                ("Data Inc", "67890", "Stan", "", "Banks", "stan@datainc.com", "CAD", "Canada", "2021-02-11", "TERTER"),
                # Add more mock data as needed
            ]
            cursor.executemany('''
                INSERT INTO {0} (entity_name, entity_id, first_name, middle_name, last_name, email, currency, country, join_date, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            is_termination_msg=lambda x: type(x.get("confidence_score", "")) == str,
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
    'db': 'tugela',
    'db_file': 'tugela.db',
    'freelancer_table': 'freelancers',
    'clients_table': 'clients',
    'gigs_table': 'gigs',
    'freelancer_id': '1',
    'create_database': False,
    'insert_data': False,
    'perform_assessment': True,
    'top_n': 1,
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
