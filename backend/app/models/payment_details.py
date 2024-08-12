from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    SmallInteger,
    ForeignKey,
    VARCHAR,
    event,
)
from enum import Enum
from datetime import datetime
import pytz

from ..db import db


class Payment_Status(Enum):
    SUCCESS = 1
    FAILED = 0


class PaymentDetails(db.Model):
    __tablename__ = "payment_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    payment_method = Column(
        SmallInteger, ForeignKey("payment_methods.id"), nullable=False
    )
    payment_date = Column(DateTime(timezone=True), nullable=False)
    amount = Column(Integer, nullable=False)
    payment_status = Column(Integer, nullable=True)
    image_url = Column(VARCHAR(255), nullable=True)
    reference_number = Column(VARCHAR(50), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(pytz.UTC))
