from sqlalchemy import (
    Column,
    Integer,
    VARCHAR,
    Date,
    DateTime,
    DECIMAL,
    ForeignKey
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# =========================
# CUSTOMERS TABLE
# =========================
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

    # Relationship → one customer can have many bookings
    bookings = relationship("Booking", back_populates="customer", cascade="all, delete-orphan")


# =========================
# FLIGHTS TABLE
# =========================
class Flight(Base):
    __tablename__ = "flights"

    flight_id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(VARCHAR(20), nullable=False, index=True)
    airline = Column(VARCHAR(100), nullable=False)
    departure_airport = Column(VARCHAR(50), nullable=False)
    arrival_airport = Column(VARCHAR(50), nullable=False)
    departure_date = Column(DateTime, nullable=False)
    arrival_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationship → one flight can have many bookings
    bookings = relationship("Booking", back_populates="flight", cascade="all, delete-orphan")


# =========================
# BOOKINGS TABLE
# =========================
class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(VARCHAR(50), unique=True, nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.flight_id", ondelete="CASCADE"), nullable=False)
    seat_class = Column(VARCHAR(20))  # Economy, Business, First
    ticket_price = Column(DECIMAL(10, 2))
    delay_minutes = Column(Integer)
    delay_status = Column(VARCHAR(20))  # On-Time, Delayed, Cancelled
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    customer = relationship("Customer", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")