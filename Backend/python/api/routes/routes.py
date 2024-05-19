from fastapi import APIRouter
from Backend.python.api.models.ClientModel import ClientModel
from Backend.python.models.RecommendationEngine import RecommendationEngine
from Backend.python.api.models.InputPayload import InputPayload

router = APIRouter()
RE = RecommendationEngine()
params = {
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


@router.get("/")
def work():
    return "ing"


@router.post("/create_client")
def create_client(client: ClientModel):
    RE.connect(params)
    # Ensure the clients table exists before inserting a new client
    table_result = RE.insert_client_data(params, client.dict())
    RE.close()
    return table_result


@router.get("/fetch_gigs/{gigs_table}")
def fetch_gigs(gigs_table: str):
    RE.connect(params)
    gig_data = RE.fetch_gig_data(params)
    RE.close()
    return {"gig_data": gig_data}


@router.get("/perform_assessment/{gigs_table}")
@router.post("/perform_assessment/{gigs_table}")
def perform_assessment(msg: InputPayload, gigs_table: str):
    # Copy params and update the top_n value
    assessment_params = params.copy()
    assessment_params['gigs_table'] = gigs_table
    assessment_params['freelancer_id'] = msg.freelancer_id
    assessment_params['top_n'] = int(msg.top_n)

    RE.connect(assessment_params)
    freelancer_data = RE.fetch_freelancer_data(assessment_params)
    gig_data = RE.fetch_gig_data(assessment_params)
    df_freelancer = RE.create_dataframe(freelancer_data, _type='freelancer')
    df_gigs = RE.create_dataframe(gig_data, _type='gigs')
    message = RE.construct_assessment(df_freelancer, df_gigs)
    output_msg = RE.recruitment_analysis(message)
    top_gigs = RE.sort_job_requests(output_msg, assessment_params)
    RE.close()
    return {"top_gigs": top_gigs}
