from decouple import config as decouple_config

DATABASE_URL = decouple_config("DATAVASE_URL", default="")