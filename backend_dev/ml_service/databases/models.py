from sqlalchemy import (
    Column,
    Integer,
    VARCHAR,
    Date,
    DateTime,
    DECIMAL,
    ForeignKey,
    String
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(VARCHAR(50), nullable=False)
    last_name = Column(VARCHAR(50), nullable=False)
    email = Column(VARCHAR(100), unique=True, nullable=False, index=True)
    phone_number = Column(VARCHAR(20))
    date_of_birth = Column(Date)
    gender = Column(VARCHAR(10))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    bookings = relationship("Booking", back_populates="customer", cascade="all, delete-orphan")


class Flight(Base):
    __tablename__ = "flights"

    flight_id = Column(String, primary_key=True, index=True)
    flight_number = Column(VARCHAR(20), nullable=False, index=True)
    airline = Column(VARCHAR(100), nullable=False)
    departure_airport = Column(VARCHAR(100), nullable=False)
    arrival_airport = Column(VARCHAR(100), nullable=False)
    departure_date = Column(DateTime)
    arrival_date = Column(DateTime)
    delay_minutes = Column(Integer)
    delay_status = Column(VARCHAR(50))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    bookings = relationship("Booking", back_populates="flight", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(VARCHAR(50), unique=True, nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False)
    flight_id = Column(String, ForeignKey("flights.flight_id", ondelete="CASCADE"), nullable=False)
    seat_class = Column(VARCHAR(20))  # Economy, Business, First
    ticket_price = Column(DECIMAL(10, 2))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    customer = relationship("Customer", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")

class final_db_schema(Base):
    __tablename__ = "final_db_schema"

    FLIGHT_NUMBER = Column(Integer, primary_key=True)
    YEAR = Column(Integer, nullable=False)
    MONTH = Column(Integer, nullable=False)
    DAY = Column(Integer, nullable=False)
    DAY_OF_WEEK = Column(Integer, nullable=False)
    AIRLINE = Column(VARCHAR(20), nullable=False)
    ORIGIN_AIRPORT = Column(VARCHAR(20), nullable=False)
    DESTINATION_AIRPORT = Column(VARCHAR(20), nullable=False)
    SCHEDULED_DEPARTURE = Column(Integer, nullable=False)
    DEPARTURE_TIME = Column(Integer, nullable=False)
    DEPARTURE_DELAY = Column(Integer, nullable=False)
    TAXI_OUT = Column(Integer)
    SCHEDULED_TIME = Column(Integer)
    DISTANCE = Column(Integer)
    SCHEDULED_ARRIVAL = Column(Integer, nullable=False)
    ARRIVAL_DELAY_PREDICTED = Column(DECIMAL(20,15), nullable=False)