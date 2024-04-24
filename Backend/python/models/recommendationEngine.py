import os
import ast
import json
import openai
import autogen
import sqlite3
import pandas as pd
import mysql.connector
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from prompts import JOB_RECRUITER_PROXY, JOB_RECRUITER_ASSISTANT
from configs import llm_config



################################
# Gig Recomendation 
################################
class recommendationEngine():
    def __init__(self):
        # self.db_file = db_file
        self.conn = None
        self.freelancer_schema = ['freelancer_id', 'first_name', 'middle_name', 'last_name', 'email', 'linkedin_url', 'skills', 'country', 'base_currency']
        self.gigs_schema = ['gig_id', 'gig_name', 'client_id', 'description', 'compensation', 'timeframe', 'country']

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

    def insert_mock_data(self, params):
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

    def fetch_gig_data(self, params):
        # temporary data
        data = [('a', 'web development', 'aefi32', 'Create a web app intake form', '$500', '2 months', 'USA'),
                ('b', 'backend development', 'afdi32', 'Create an iPhone app that measures how long someone spends using social media apps', '$900', '3.5 months', 'USA')]

        ### create method to pull gig data
        
        return data

    # Condition data
    def create_dataframe(self, data, _type):
        df_out = pd.DataFrame()
        
        if _type == 'freelancer':
            df_out = pd.DataFrame(data, columns=self.freelancer_schema)

        if _type == 'gigs':
            df_out = pd.DataFrame(data, columns=self.gigs_schema)
            
        return df_out

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