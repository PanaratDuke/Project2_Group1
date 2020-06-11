## Flask Web Service
import numpy as np
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.schema import MetaData
from sqlalchemy.orm import Session
from sqlalchemy.sql import label
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///factbook.sqlite3")
# sl_conn_string = 'sqlite:///Resources/factbook.sqlite3'
# pg_conn_string = 'postgresql://group1:project2@education1.c1nbp1eyrpzu.us-east-2.rds.amazonaws.com:5432/factbook1'
# engine = create_engine(pg_conn_string)
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

meta = MetaData()
meta.reflect(bind=engine,views=True)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

cors = CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return render_template("index.html")

@app.route("/api")
def api_routes():
    return (
        f"Available Routes:<br/>"
        f"/api/years<br/>"
        f"/api/countries<br/>"
        f"/api/properties<br/>"
        f"/api/&lt;year&gt;<br/>"
        f"/api/&lt;year&gt;/&lt;property&gt;<br/>"
        f"/api/&lt;country&gt;/&lt;property&gt;<br/>"
        f"<i>where years are YYYY</i>"
        f"<i>and countries are full names, like Algeria</i>"
    )

@app.route("/api/years")
def years():
    result = engine.execute("select * from v_years")
    year_list = [row.year for row in result]
    # years_dict = {'years' : year_list}

    return jsonify(year_list)

@app.route("/api/countries")
def countries():
    result = engine.execute("select * from v_countries")
    return jsonify([row.country for row in result])

@app.route("/api/properties")
def properties():
    return jsonify([c.name for c in meta.tables['all_data'].columns][5:])

@app.route("/api/<int:year>")
def year_callback(year):
    df = pd.read_sql(f"select * from all_data where year = {year} and education_expenditures is not null", engine)
    return df.to_json(orient='records')

@app.route("/api/worldMapData")
def worldMapData():
    result = engine.execute("select * from v_years")
    year_list = [row.year for row in result]
    return jsonify(year_list)

@app.route("/api/worldMapData/<int:year>")
def worldMapData_callback(year):
    result = df = pd.read_sql(f"select country, latitude,longitude, education_expenditures, literacy_rate, unemployment_rate, purchasing_power_parity,distribution_of_family_income from all_data where year = {year} and education_expenditures is not null", engine)
    return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)