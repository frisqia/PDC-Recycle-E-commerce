from sqlalchemy import Column, Integer, DateTime, ForeignKey, SmallInteger
from sqlalchemy.sql import func
from enum import Enum
from datetime import datetime
import pytz

from ..db import db


class transaction_status(Enum):
    WAITING_FOR_PAYMENT = 1
    PAYMENT_SUCCESS = 2
    PREPARED_BY_SELLER = 3
    ON_DELIVERY = 4
    DELIVERED = 5


class Transactions(db.Model):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # address_id = Column
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    shipping_options_id = Column(
        Integer, ForeignKey("shipping_options.id"), nullable=False
    )
    user_seller_voucher_id = Column(
        Integer, ForeignKey("user_seller_vouchers.id"), nullable=True
    )
    order_date = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    total_weight_kg = Column(SmallInteger, nullable=False)
    total_volume_m3 = Column(SmallInteger, nullable=False)
    total_items = Column(SmallInteger, nullable=False)
    total_price = Column(Integer, nullable=False)
    transaction_status = Column(
        SmallInteger,
        default=transaction_status.WAITING_FOR_PAYMENT.value,
        nullable=False,
    )
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(pytz.UTC))

    # reviews = relationship("Reviews", backref="transaction_reviews")
