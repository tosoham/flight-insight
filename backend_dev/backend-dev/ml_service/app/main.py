import numpy as np
import holidays
from h2o import H2OFrame
import pandas as pd

def preprocess_to_h2o(df: pd.DataFrame) -> H2OFrame:
    """
    Preprocess raw flight data (Set B) into engineered features (Set A)
    and return an H2OFrame ready for prediction.
    """

    # ------------------------------
    # 1. Holiday feature
    df["date"] = pd.to_datetime(df[["YEAR", "MONTH", "DAY"]])
    us_holidays = holidays.US()
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
"""from fastapi import FastAPI, Depends, HTTPException
import requests
from sqlalchemy.orm import Session
from databases import models
from databases.database import SessionLocal, engine
import datetime

#models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

AVIATIONSTACK_API_KEY = "c68947135ac031af2d89c0419904f0fb"
BASE_URL = "http://api.aviationstack.com/v1/flights"


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

    
@app.post("/store-flight")
def store_flight(flight_number: str, db: Session = Depends(get_db)):
    url = f"{BASE_URL}?access_key={AVIATIONSTACK_API_KEY}&flight_number={flight_number}"
    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching data from AviationStack API")

    data = response.json()
    if "data" not in data or len(data["data"]) == 0:
        raise HTTPException(status_code=404, detail="Flight not found")

    flight_data = data["data"][0]

    new_flight = models.Flight(
        flight_number=flight_data.get("flight", {}).get("iata", "N/A"),
        airline=flight_data.get("airline", {}).get("name", "N/A"),
        departure_airport=flight_data.get("departure", {}).get("airport", "N/A"),
        arrival_airport=flight_data.get("arrival", {}).get("airport", "N/A"),
        departure_date=flight_data.get("departure", {}).get("estimated"),
        arrival_date=flight_data.get("arrival", {}).get("estimated"),
    )
    db.add(new_flight)
    db.commit()
    db.refresh(new_flight)

    customer_data = flight_data.get("passenger")  
    new_customer = None
    if customer_data:
        new_customer = models.Customer(
            first_name=customer_data.get("first_name", "Unknown"),
            last_name=customer_data.get("last_name", "Unknown"),
            email=customer_data.get("email", None),
            phone_number=customer_data.get("phone", None),
            date_of_birth=customer_data.get("dob", None),
            gender=customer_data.get("gender", None),
        )
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)

    departure_delay = flight_data.get("departure", {}).get("delay") 
    arrival_delay = flight_data.get("arrival", {}).get("delay")     

    new_booking = models.Booking(
        customer_id=new_customer.customer_id if new_customer else None,
        flight_id=new_flight.flight_id,
        booking_date=datetime.datetime.now(),
        seat_number=None,  # Not provided by API
        status="scheduled",
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return {
        "message": "Flight & booking stored successfully",
        "flight_id": new_flight.flight_id,
        "customer_id": new_customer.customer_id if new_customer else None,
        "booking_id": new_booking.booking_id,
        "departure_delay": departure_delay,
        "arrival_delay": arrival_delay,
    }"""

from fastapi import FastAPI, Depends, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select
import httpx
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import h2o
import pandas as pd
import subprocess
import tempfile
import os


# Start H2O (for legacy endpoint)
h2o.init()

# Load model (legacy, not MOJO)
# model_path = "ml_service/model/XGBoost_model_python_1757147613340_1.zip"


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

DATABASE_URL = "postgresql+asyncpg://postgres:madhurima@localhost:5432/flightdb"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, expire_on_commit=False
)
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


app = FastAPI()

"""AVIATIONSTACK_API_KEY = "c68947135ac031af2d89c0419904f0fb"


@app.get("/fetch-flight/{flight_number}")
async def fetch_flight(flight_number: str):
    url = f"http://api.aviationstack.com/v1/flights?access_key={AVIATIONSTACK_API_KEY}&flight_number={flight_number}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    data = response.json()
    return data"""

AVIATIONSTACK_API_KEY = "c68947135ac031af2d89c0419904f0fb"
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


@app.post("/store-flight/{flight_number}")
async def store_flight(flight_number: str, db: AsyncSession = Depends(get_db)):
    url = f"http://api.aviationstack.com/v1/flights?access_key={AVIATIONSTACK_API_KEY}&flight_number={flight_number}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    data = response.json()

    if not data.get("data"):
        return {"message": f"No data found for {flight_number}"}

    flight_info = data["data"][0]

    from databases.models import Flight  

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