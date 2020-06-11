import json
import pandas as pd

with open('countries.geojson') as f:
    data=json.loads(f.read())

