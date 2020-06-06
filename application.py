## Flask Web Service
import numpy as np
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.schema import MetaData
from sqlalchemy.orm import Session
from sqlalchemy.sql import label
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/factbook.sqlite3")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

meta = MetaData()
meta.reflect(bind=engine,views=True)

# Save reference to the table
# AllData = Base.classes['all_data']

# # Most active station
# most_active_station = 'USC00519281'
# yr_ago = '2016-08-18'

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

cors = CORS(app)

def YearBefore(YYYY_MM_DD):
    return str(int(YYYY_MM_DD[0:4])-1) + YYYY_MM_DD[4:10]

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
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

@app.route("/api/<start>")
def start(start):
  # Create our session (link) from Python to the DB
  session = Session(engine)  

  # Calculate `TMIN`, `TAVG`, and `TMAX` for all dates greater than and equal to the start date.
  results = session.query(
    label('station_name', Station.name), 
    label('min_temp', func.min(Measurement.tobs)),
    label('avg_temp', func.avg(Measurement.tobs)),
    label('max_temp', func.max(Measurement.tobs)),
    label('count', func.count(Measurement.tobs))
    ).group_by(Station.name).filter(Station.station == Measurement.station, Measurement.date >= f'{start}')

  session.close()

  # Create a dictionary from the row data and append to a list of observations
  list_station = []
  for station_name, min_tobs, avg_tobs, max_tobs, count in results:
      dict = {}
      dict["station_name"] = station_name
      dict["min_tobs"] = min_tobs
      dict["avg_tobs"] = avg_tobs
      dict["max_tobs"] = max_tobs
      dict["count_tobs"] = count
      list_station.append(dict)

  return jsonify(list_station)

@app.route("/api/<start>/<end>")
def start_and_end_date(start, end):
  # Create our session (link) from Python to the DB
  session = Session(engine)  

  # Calculate the `TMIN`, `TAVG`, and `TMAX` for dates between the start and end date inclusive.
  results = session.query(
    label('station_name', Station.name), 
    label('min_temp', func.min(Measurement.tobs)),
    label('avg_temp', func.avg(Measurement.tobs)),
    label('max_temp', func.max(Measurement.tobs)),
    label('count', func.count(Measurement.tobs))
    ).group_by(Station.name).filter(Station.station == Measurement.station, Measurement.date >= f'{start}', Measurement.date <= f'{end}')

  session.close()

  # Create a dictionary from the row data and append to a list of observations
  list_station = []
  for station_name, min_tobs, avg_tobs, max_tobs, count in results:
      dict = {}
      dict["station_name"] = station_name
      dict["min_tobs"] = min_tobs
      dict["avg_tobs"] = avg_tobs
      dict["max_tobs"] = max_tobs
      dict["count_tobs"] = count
      list_station.append(dict)

  return jsonify(list_station)
  #return jsonify([{'start' : f"'{start}'",'end' : f"'{end}'"}])

if __name__ == '__main__':
    app.run(debug=True)
