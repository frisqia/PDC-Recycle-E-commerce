from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    SmallInteger,
    VARCHAR,
)
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
    CANCELED = 6


class Transactions(db.Model):
    __tablename__ = "transactions"

    id = Column(
        VARCHAR(30),
        primary_key=True,
    )
    parent_id = Column(VARCHAR(30), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    user_seller_voucher_id = Column(
        Integer, ForeignKey("user_seller_vouchers.id"), nullable=True
    )
    # shipment detail
    payment_details_id = Column(
        Integer, ForeignKey("payment_details.id"), nullable=True
    )
    total_discount = Column(Integer, nullable=False, default=0)
    transaction_status = Column(
        SmallInteger,
        default=transaction_status.WAITING_FOR_PAYMENT.value,
        nullable=False,
    )
    payment_link = Column(VARCHAR(255), nullable=True)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(pytz.UTC)
    )
    updated_at = Column(
        DateTime, nullable=True, onupdate=lambda: datetime.now(pytz.UTC)
    )

    # reviews = relationship("Reviews", backref="transaction_reviews")

    product_orders = db.relationship("ProductOrders", backref="transaction_orders")

    def __init__(
        self,
        id,
        user_id,
        seller_id,
        user_seller_voucher_id,
        total_discount,
        parent_id,
        payment_link=None,
    ):
        self.id = id
        self.user_id = user_id
        self.seller_id = seller_id
        self.user_seller_voucher_id = user_seller_voucher_id
        self.total_discount = total_discount
        self.parent_id = parent_id
        self.payment_link = payment_link

    def to_dict(self):
        seller = self.seller_transactions.to_dict()
        seller_info = {
            "store_name": seller["store_name"],
            "store_image_url": seller["store_image_url"],
        }

        products = self.product_orders
        product_info = [product.to_dict() for product in products]

        return {
            "id": self.id,
            "user_id": self.user_id,
            "seller_id": self.seller_id,
            "seller_info": seller_info,
            "user_seller_voucher_id": self.user_seller_voucher_id,
            "total_discount": self.total_discount,
            "transaction_status": self.transaction_status,
            "transaction_status_name": transaction_status(self.transaction_status).name,
            "products": product_info,
            "payment_link": self.payment_link,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
