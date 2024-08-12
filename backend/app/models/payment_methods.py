from sqlalchemy import Column, VARCHAR, SmallInteger, Integer, DateTime, event
from datetime import datetime
import pytz


from ..db import db


class PaymentMethods(db.Model):
    __tablename__ = "payment_methods"

    id = Column(SmallInteger, primary_key=True, autoincrement=True)
    vendor_name = Column(VARCHAR(30), nullable=False)
    payment_type = Column(VARCHAR(30), nullable=False)
    min_transaction = Column(Integer, nullable=False)
    max_transaction = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(pytz.UTC))
