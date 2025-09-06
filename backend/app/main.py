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

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select
import httpx
import requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import h2o
import pandas as pd

# Start H2O
h2o.init()

# Load model (adjust path accordingly)
model_path = "..\ml_models\XGBoost_model_python_1757076136863_1"
model = h2o.load_model(model_path)

class FlightFeatures(BaseModel):
    YEAR: int
    MONTH: int
    DAY: int
    DAY_OF_WEEK: int
    AIRLINE: str
    FLIGHT_NUMBER: int
    TAIL_NUMBER: str
    ORIGIN_AIRPORT: str
    DESTINATION_AIRPORT: str
    SCHEDULED_DEPARTURE: int
    DEPARTURE_TIME: int
    DEPARTURE_DELAY: int
    TAXI_OUT: int
    SCHEDULED_TIME: int
    DISTANCE: int
    SCHEDULED_ARRIVAL: int

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

@app.post("/predict")
def predict(features: FlightFeatures):
    data = pd.DataFrame([features.model_dump()])
    h2o_data = h2o.H2OFrame(data)
    
    # Run prediction
    prediction = model.predict(h2o_data)
    predicted_value = float(prediction.as_data_frame().iloc[0, 0])
    
    return {"Arrival Delay": predicted_value}



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