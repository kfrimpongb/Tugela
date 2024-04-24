import autogen

try:
    with open("../../../../private/oai_key", "r") as file:
        api_key = file.read().strip()
except FileNotFoundError:
    print("api key not found")


llm_config = {'config_list': [{'model': 'gpt-4',
   'api_key': api_key,
   'tags': ['gpt-4']}],
 'cache_seed': 42}
