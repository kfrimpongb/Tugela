from fastapi import APIRouter
from Backend.python.api.models.ClientModel import ClientModel
from Backend.python.models.RecommendationEngine import RecommendationEngine
from Backend.python.api.models.InputPayload import InputPayload


class Routes:
    def __init__(self):
        self.router = APIRouter()
        self.RE = RecommendationEngine()
        self.params = {
            'db': 'tugela',
            'db_file': 'tugela.db',
            'freelancer_table': 'freelancers',
            'clients_table': 'clients',
            'gigs_table': 'gigs',
            'freelancer_id': '',
            'create_database': False,
            'insert_data': False,
            'perform_assessment': True,
            'top_n': '',
        }

        self.router.get("/")(self.work)
        self.router.post("/create_client")(self.create_client)
        self.router.get("/fetch_gigs/{gigs_table}")(self.fetch_gigs)
        self.router.get("/perform_assessment/{gigs_table}")(self.perform_assessment)

    def work(self):
        return "ing"

    def create_client(self, client: ClientModel):
        self.RE.connect(self.params)
        # Ensure the clients table exists before inserting a new client
        table_result = self.RE.insert_client_data(self.params, client.dict())
        self.RE.close()
        return table_result

    def fetch_gigs(self, gigs_table: str):
        self.RE.connect(self.params)
        gig_data = self.RE.fetch_gig_data(self.params)
        self.RE.close()
        return {"gig_data": gig_data}

    def perform_assessment(self, msg: InputPayload, gigs_table: str):
        self.RE.connect(self.params)
        freelancer_data = self.RE.fetch_freelancer_data(self.params)
        gig_data = self.RE.fetch_gig_data(self.params)
        df_freelancer = self.RE.create_dataframe(freelancer_data, _type='freelancer')
        df_gigs = self.RE.create_dataframe(gig_data, _type='gigs')
        message = self.RE.construct_assessment(df_freelancer, df_gigs)
        output_msg = self.RE.recruitment_analysis(message)
        top_gigs = self.RE.sort_job_requests(output_msg, self.params)
        self.RE.close()
        return {"top_gigs": top_gigs}


# Initialize the Routes class
routes_instance = Routes()
router = routes_instance.router
