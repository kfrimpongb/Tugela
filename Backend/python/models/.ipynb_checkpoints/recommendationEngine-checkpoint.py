import json
import openai
import pandas as pd
import mysql.connector
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

##########################
# Job Recommendation
##########################
class recommendationEngine():
    def __init__(self):
        # read credentials from config file
        os.environ["OPENAI_API_KEY"] = ""
        self.db_config = {
                        "host": "",
                        "user": "",
                        "password": "",
                        "database": "",
                    }

    ### Connect to SQL database 
    def connect(self):
        self.conn = mysql.connector.connect(**self.db_config)

    ### Close SQL DB connection
    def closeConnection(self):
        self.conn.close()

    ### Method to gather relevant LinkedIn data to inform recommendations
    def extractLinkedinData(self, params):
        # To do
        pass

    ### Get freelancer profiles
    def getProfile(self, params):
        db = params["db"]
        table = params["freelancer_table"]
        freelancerId = params["freelancerId"]
        query = "SELECT description FROM '"+db+"'.'"+table+"' WHERE freelancerId = '"+freelancerId+"' AND profileType = '"+db"';
        cursor.execute(query)

        # Fetch all the rows from the result set
        result = cursor.fetchall()

        # Sample output (for testing)
        result = ["I am a software engineer with experience in web development, Python, and JavaScript.               \
                   I have a strong problem-solving skills and have worked on both front-end and back-end development. \
                   I am looking for a remote job opportunity in a dynamic and innovative tech company."]

        self.profile_description = result

    ### Get current on-demand jobs within database
    def searchJobs(self, params):
        db = params["db"]
        table = params["client_table"]
        query = "SELECT clientId, clientName, jobDescription, price FROM '"+db+"'.'"+table+"' WHERE profileType = '"+db"';
        cursor.execute(query)

        # Fetch all the rows from the result set
        result = cursor.fetchall()
        self.client_details = result

    ### Method to aggregate all relevant information before performing GenAI or ML
    def dataAggregation(self, params):
        # To do
        # self.extractLinkedinData(params)
        pass

    # Generate job recommendations based on the profile description
    def generate_job_recommendations(self):
        llm = params["llm"]
        recommendation_count = params["recommendation_count"]
        profile_description = self.profile_description
        client_details = self.client_details
        
        prompt = """
                    Generate job recommendations for a remote freelance candidate with the following profile:\n\n{profile_description}\n\n

                    Select from jobs within the following job pool: {client_details}
                    
                    Include the job description in the response.
                    Include the price of the engagement as key-value pair in the output
                    Include the expected length of the engagement as key-value pair in the output.
                    
                    Return the response in json format

        
                    Recommended jobs:
                 """
    
        response = openai.Completion.create(
            engine=llm,  # You can choose a different engine depending on your subscription
            prompt=prompt,
            max_tokens=400,   # Adjust the max_tokens as needed to control response length
            temperature=0.7,  # Adjust the temperature for creativity
            n=recommendation_count,              
            stop=None  
        )

        # Pass response for downstream cleansing/processing
        self.response = response
    
        return response



##########################
# Test
##########################
params = {
            'llm'                  : 'text-davinci-003',
            'db'                   : 'USERS',
            'freelancer_table'     : 'freelancers',
            'client_table'         : 'clients',
            'recommendation_count' : 5
}



RE = recommendationEngine()

RE.connect()
RE.getProfile(params)
RE.searchJobs(params)
job_recommendations = RE.generate_job_recommendations()
RE.closeConnection()