import autogen


config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={
        "model": ["gpt-4"],
    },
)

llm_config = {"config_list": config_list, "cache_seed": 42}