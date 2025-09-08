import numpy as np
import holidays
from h2o import H2OFrame
import pandas as pd
import io

def preprocess_to_h2o(df: pd.DataFrame) -> H2OFrame:
    """
    Preprocess raw flight data (Set B) into engineered features (Set A)
    and return an H2OFrame ready for prediction.
    """

    # ------------------------------
    # 1. Holiday feature
    df["date"] = pd.to_datetime(df[["YEAR", "MONTH", "DAY"]])
    us_holidays = holidays.country_holidays('US')
    df["is_holiday"] = df["date"].apply(lambda x: 1 if x in us_holidays else 0)
    df = df.drop(columns=["date"])

    # ------------------------------
    # 2. Red-eye feature
    df["DEP_HOUR"] = df["SCHEDULED_DEPARTURE"] // 100
    df["is_redeye"] = df["DEP_HOUR"].apply(lambda x: 1 if (x >= 22 or x < 6) else 0)

    # ------------------------------
    # 3. Departure time difference
    def time_diff(sched, actual):
        try:
            sched_h, sched_m = divmod(int(sched), 100)
            actual_h, actual_m = divmod(int(actual), 100)
            sched_total = sched_h * 60 + sched_m
            actual_total = actual_h * 60 + actual_m
            if actual_total < sched_total:  # overnight
                actual_total += 24 * 60
            return actual_total - sched_total
        except:
            return np.nan

    df["DEP_TIME_DIFF"] = df.apply(
        lambda row: time_diff(row["SCHEDULED_DEPARTURE"], row["DEPARTURE_TIME"]), axis=1
    )

    # ------------------------------
    # 4. Route + avg delay per route
    df["ROUTE"] = df["ORIGIN_AIRPORT"] + "_" + df["DESTINATION_AIRPORT"]
    route_delay = df.groupby("ROUTE")["ARRIVAL_DELAY"].mean().rename("ROUTE_AVG_ARR_DELAY")
    df = df.merge(route_delay, on="ROUTE", how="left")

    # ------------------------------
    # 5. Avg delay per airline
    airline_delay = df.groupby("AIRLINE")["ARRIVAL_DELAY"].mean().rename("AIRLINE_AVG_ARR_DELAY")
    df = df.merge(airline_delay, on="AIRLINE", how="left")

    # ------------------------------
    # 6. Avg delay per flight number
    flight_delay = df.groupby("FLIGHT_NUMBER")["ARRIVAL_DELAY"].mean().rename("FLIGHT_AVG_ARR_DELAY")
    df = df.merge(flight_delay, on="FLIGHT_NUMBER", how="left")

    # ------------------------------
    # 7. Weekend feature
    df["is_weekend"] = df["DAY_OF_WEEK"].apply(lambda x: 1 if x in [6, 7] else 0)

    # ------------------------------
    # 8. Distance buckets
    bins = [0, 500, 1500, 3000, np.inf]
    labels = ["short", "medium", "long", "ultra"]
    df["DISTANCE_BUCKET"] = pd.cut(df["DISTANCE"], bins=bins, labels=labels)

    # ------------------------------
    # Drop helper columns
    df = df.drop(columns=["YEAR", "DEP_HOUR", "ROUTE"])

    # ------------------------------
    # Convert to H2OFrame
    hf = h2o.H2OFrame(df)

    return hf
from fastapi import FastAPI, Depends, HTTPException
import requests
from sqlalchemy.orm import Session
from databases import models
from databases.database import SessionLocal, engine
import datetime
import polars as pl

#models.Base.metadata.create_all(bind=engine)

# Only one FastAPI app instance
app = FastAPI()

# Load analytics dataset once at startup

# ...existing code...

# Analytics endpoint
@app.get("/display")
def display(airline: str):
    try:
        analytics_lf = pl.scan_parquet("./app/flights_processed_for_analytics_reduced.parquet")
    except Exception:
        analytics_lf = None
    if analytics_lf is None:
        return {"error": "Analytics dataset not loaded"}

    df = analytics_lf.collect().to_pandas()
    results = {}

    # 1. Top 3 Worst Flight Paths
    worst_routes = (
        df[df["AIRLINE"] == airline]
        .groupby(["ORIGIN_AIRPORT", "DESTINATION_AIRPORT"])["ARRIVAL_DELAY"]
        .mean()
        .reset_index()
        .sort_values("ARRIVAL_DELAY", ascending=False)
        .head(3)
    )
    results["worst_routes"] = worst_routes.rename(
        columns={"ARRIVAL_DELAY": "avg_arrival_delay"}
    ).assign(route=lambda x: x["ORIGIN_AIRPORT"] + " → " + x["DESTINATION_AIRPORT"])[
        ["route", "avg_arrival_delay"]
    ].to_dict(orient="records")

    # 2. Top 3 Worst Flights
    worst_flights = (
        df[df["AIRLINE"] == airline]
        .groupby("FLIGHT_NUMBER")["ARRIVAL_DELAY"]
        .mean()
        .reset_index()
        .sort_values("ARRIVAL_DELAY", ascending=False)
        .head(3)
    )
    results["worst_flights"] = worst_flights.rename(
        columns={"ARRIVAL_DELAY": "avg_arrival_delay", "FLIGHT_NUMBER": "flight"}
    ).to_dict(orient="records")

    # 3. Average Delay by Day of Week
    delay_by_day = (
        df[df["AIRLINE"] == airline]
        .groupby("DAY_OF_WEEK")["ARRIVAL_DELAY"]
        .mean()
        .reset_index()
        .sort_values("DAY_OF_WEEK")
    )
    day_map = {
        1: "Monday", 2: "Tuesday", 3: "Wednesday",
        4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"
    }
    delay_by_day["day"] = delay_by_day["DAY_OF_WEEK"].map(day_map)
    results["delay_by_day"] = delay_by_day.rename(
        columns={"ARRIVAL_DELAY": "avg_arrival_delay"}
    )[["day", "avg_arrival_delay"]].to_dict(orient="records")

    # 4. Top 10 Airports by Avg Arrival Delay
    top_airports = (
        df[df["AIRLINE"] == airline]
        .groupby("DESTINATION_AIRPORT")["ARRIVAL_DELAY"]
        .mean()
        .reset_index()
        .sort_values("ARRIVAL_DELAY", ascending=False)
        .head(10)
    )
    results["top_airports"] = top_airports.rename(
        columns={"ARRIVAL_DELAY": "avg_arrival_delay", "DESTINATION_AIRPORT": "airport"}
    ).to_dict(orient="records")

    # 5. Top 10 Losing Routes (money impact approx: delay × count)
    losing_routes = (
        df[df["AIRLINE"] == airline]
        .groupby(["ORIGIN_AIRPORT", "DESTINATION_AIRPORT"])["ARRIVAL_DELAY"]
        .agg(["mean", "count"])
        .reset_index()
    )
    losing_routes["impact"] = losing_routes["mean"] * losing_routes["count"]
    losing_routes = losing_routes.sort_values("impact", ascending=False).head(10)
    results["losing_routes"] = losing_routes.assign(
        route=lambda x: x["ORIGIN_AIRPORT"] + " → " + x["DESTINATION_AIRPORT"]
    )[["route", "impact"]].to_dict(orient="records")

    # 6. Vulnerability by Day of Week
    results["vulnerable_days"] = results["delay_by_day"]

    # 7. Scatter: Taxi-Out vs Arrival Delay
    scatter_data = (
        df[df["AIRLINE"] == airline][["TAXI_OUT", "ARRIVAL_DELAY"]]
        .dropna()
        .sample(n=min(500, len(df[df["AIRLINE"] == airline])), random_state=42)
    )
    results["taxiout_vs_delay"] = scatter_data.rename(
        columns={"TAXI_OUT": "taxi_out", "ARRIVAL_DELAY": "arrival_delay"}
    ).to_dict(orient="records")

    # 8. Hour of Day vs Avg Delay
    df["hour_of_day"] = (df["SCHEDULED_DEPARTURE"] // 100).astype(int)
    hour_delay = (
        df[df["AIRLINE"] == airline]
        .groupby("hour_of_day")["ARRIVAL_DELAY"]
        .mean()
        .reset_index()
        .sort_values("hour_of_day")
    )
    results["hour_vs_delay"] = hour_delay.rename(
        columns={"ARRIVAL_DELAY": "avg_arrival_delay", "hour_of_day": "hour"}
    ).to_dict(orient="records")

    return results

"""def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()"""

AVIATIONSTACK_API_KEY = "c68947135ac031af2d89c0419904f0fb"
BASE_URL = "http://api.aviationstack.com/v1/flights"


from fastapi import Depends, HTTPException, UploadFile,File
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select
import httpx
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import h2o
import pandas as pd
import os
#from databases.models import Flight
from databases.models import Flight, final_db_schema as FinalDBSchema
from dotenv import load_dotenv
import tempfile
import subprocess

load_dotenv()
# Start H2O
h2o.init()


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class FlightFeatures(BaseModel):
    YEAR: int
    MONTH: int
    DAY: int
    DAY_OF_WEEK: int
    SCHEDULED_DEPARTURE: int
    DEPARTURE_TIME: int
    DEPARTURE_DELAY: int
    TAXI_OUT: int
    SCHEDULED_TIME: int
    DISTANCE: int
    SCHEDULED_ARRIVAL: int
    AIRLINE: str
    FLIGHT_NUMBER: int
    ORIGIN_AIRPORT: str
    DESTINATION_AIRPORT: str

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:madhurima@localhost:5432/flightdb")

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, expire_on_commit=False
)
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session



AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
BASE_URL = "http://api.aviationstack.com/v1/flights"

# CORS setup (so frontend can call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev: allow all, restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is running!"}


# @app.post("/predict")
# def predict(features: FlightFeatures):
#     """
#     Predict arrival delay using the legacy H2O model, with feature engineering.
#     """
#     # Convert input to DataFrame
#     data = pd.DataFrame([features.model_dump()])
#     # Add dummy ARRIVAL_DELAY column for feature engineering (will be dropped by model)
#     data["ARRIVAL_DELAY"] = 0
#     # Preprocess features
#     h2o_data = preprocess_to_h2o(data)
#     # Run prediction
#     prediction = model.predict(h2o_data)
#     predicted_value = float(prediction.as_data_frame().iloc[0, 0])
#     return {"Arrival Delay": predicted_value}




# MOJO model and JAR paths
MOJO_JAR_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../model/h2o-genmodel.jar'))
MOJO_MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../model/XGBoost_model_python_1757147613340_1.zip'))

@app.post("/predict-mojo")
def predict(features: FlightFeatures):
    """
    Predict using H2O MOJO model via Java subprocess.
    """
    # Prepare input as CSV row
    columns = [
        "YEAR", "MONTH", "DAY", "DAY_OF_WEEK", "AIRLINE", "FLIGHT_NUMBER", "TAIL_NUMBER",
        "ORIGIN_AIRPORT", "DESTINATION_AIRPORT", "SCHEDULED_DEPARTURE", "DEPARTURE_TIME",
        "DEPARTURE_DELAY", "TAXI_OUT", "SCHEDULED_TIME", "DISTANCE", "SCHEDULED_ARRIVAL"
    ]
    # Ensure all columns are present
    input_dict = features.model_dump()
    row = [str(input_dict.get(col, "")) for col in columns]

    # Write to temp CSV
    with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False) as f:
        csv_path = f.name
        f.write(",".join(columns) + "\n")
        f.write(",".join(row) + "\n")

    # Prepare Java command
    cmd = [
        "java", "-cp", MOJO_JAR_PATH,
        "hex.genmodel.tools.PredictCsv",
        "--mojo", MOJO_MODEL_PATH,
        "--input", csv_path,
        "--output", csv_path + ".out",
        "--decimal"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        # Read output CSV
        with open(csv_path + ".out", "r") as fout:
            lines = fout.readlines()
            if len(lines) >= 2:
                pred = lines[1].strip().split(",")[-1]
                return {"Arrival Delay (MOJO)": float(pred)}
            else:
                return {"error": "MOJO output missing"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        # Clean up temp files
        try:
            os.remove(csv_path)
            os.remove(csv_path + ".out")
        except Exception:
            pass


@app.post("/predict-from-csv")
async def predict_from_csv(file: UploadFile = File(...)):
    """
    Accepts a CSV with multiple rows of flight data,
    predicts delay for each row using the MOJO model,
    and returns all predictions.
    """
    # Read CSV
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    # Required columns
    required_columns = [
        "YEAR", "MONTH", "DAY", "DAY_OF_WEEK", "AIRLINE", "FLIGHT_NUMBER",
        "ORIGIN_AIRPORT", "DESTINATION_AIRPORT",
        "SCHEDULED_DEPARTURE", "DEPARTURE_TIME", "DEPARTURE_DELAY",
        "TAXI_OUT", "SCHEDULED_TIME", "DISTANCE", "SCHEDULED_ARRIVAL"
    ]
    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing)}")

    predictions = []

    # Loop rows and call predict-mojo
    async with httpx.AsyncClient() as client:
        for _, row in df.iterrows():
            features = FlightFeatures(**row.to_dict())
            resp = await client.post("http://localhost:8000/predict-mojo", json=features.model_dump())
            if resp.status_code == 200:
                predictions.append(resp.json())
            else:
                predictions.append({"error": f"Failed to predict for flight {features.FLIGHT_NUMBER}"})

    return {"predictions": predictions}


# New endpoint: store-into-db
from fastapi import status

@app.post("/store-into-db", status_code=status.HTTP_201_CREATED)
async def store_into_db(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """
    Accepts a CSV, predicts delay for each row, and stores all info + prediction in final_db_schema table.
    """
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    required_columns = [
        "YEAR", "MONTH", "DAY", "DAY_OF_WEEK", "AIRLINE", "FLIGHT_NUMBER",
        "ORIGIN_AIRPORT", "DESTINATION_AIRPORT",
        "SCHEDULED_DEPARTURE", "DEPARTURE_TIME", "DEPARTURE_DELAY",
        "TAXI_OUT", "SCHEDULED_TIME", "DISTANCE", "SCHEDULED_ARRIVAL"
    ]
    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing)}")

    stored = []
    async with httpx.AsyncClient() as client:
        for _, row in df.iterrows():
            features = FlightFeatures(**row.to_dict())
            resp = await client.post("http://localhost:8000/predict-mojo", json=features.model_dump())
            if resp.status_code == 200 and "Arrival Delay (MOJO)" in resp.json():
                prediction = resp.json()["Arrival Delay (MOJO)"]
            else:
                prediction = None

            # Prepare DB record
            record_dict = row.to_dict()
            record_dict["ARRIVAL_DELAY_PREDICTED"] = prediction

            # Create FinalDBSchema instance
            db_record = FinalDBSchema(**record_dict)
            db.add(db_record)
            stored.append({"FLIGHT_NUMBER": record_dict.get("FLIGHT_NUMBER"), "ARRIVAL_DELAY_PREDICTED": prediction})

        await db.commit()

    return {"stored": stored, "count": len(stored)}


@app.get("/fetch-flight")
def fetch_flight(flight_number: str):
    url = f"{BASE_URL}?access_key={AVIATIONSTACK_API_KEY}&flight_number={flight_number}"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching data from AviationStack API")

    data = response.json()
    if "data" not in data or len(data["data"]) == 0:
        raise HTTPException(status_code=404, detail="Flight not found")

    return data["data"][0]


from sqlalchemy import select
from databases.models import Flight

@app.post("/store-flight/{flight_number}")
async def store_flight(flight_number: str, db: AsyncSession = Depends(get_db)):
    url = f"{BASE_URL}?access_key={AVIATIONSTACK_API_KEY}&flight_number={flight_number}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    data = response.json()

    if not data.get("data"):
        raise HTTPException(status_code=404, detail=f"No data found for {flight_number}")

    flight_info = data["data"][0]

    # check if flight already exists
    result = await db.execute(
        select(Flight).where(Flight.flight_id == flight_info.get("flight", {}).get("iata"))
    )
    existing = result.scalars().first()

    if existing:
        return {"message": "Flight already exists", "flight_id": existing.flight_id}

    # otherwise, insert new
    new_flight = Flight(
        flight_id=flight_info.get("flight", {}).get("iata"),
        flight_number=flight_info.get("flight", {}).get("number"),
        airline=flight_info.get("airline", {}).get("name"),
        departure_airport=flight_info.get("departure", {}).get("airport"),
        arrival_airport=flight_info.get("arrival", {}).get("airport"),
        delay_status=flight_info.get("flight_status"),
        delay_minutes=flight_info.get("departure", {}).get("delay")
    )

    db.add(new_flight)
    await db.commit()
    await db.refresh(new_flight)

    return {"message": "Flight stored", "flight_id": new_flight.flight_id}


    """
    new_booking = Booking(
        flight_id=new_flight.id,   # FK to Flights
        delay_status=flight_info.get("flight_status"),
        delay_minutes=flight_info.get("departure", {}).get("delay"),  # store delay info
    )
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)

    return {
        "message": "Flight and Booking stored",
        "flight_id": new_flight.id,
        "booking_id": new_booking.id
    }"""
    return {"message": "Flight stored", "flight_id": new_flight.id}