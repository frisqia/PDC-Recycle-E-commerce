from sqlalchemy import Integer, Column, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz

from ..db import db


class ShippingOptions(db.Model):
    __tablename__ = "shipping_options"

    id = Column(Integer, primary_key=True, autoincrement=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    is_active = Column(Integer, default=False, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(pytz.UTC))

    transactions = relationship("Transactions", backref="shipping_options")

    def __init__(self, shipment_id, seller_id, is_active):
        self.shipment_id = shipment_id
        self.seller_id = seller_id
        self.is_active = is_active

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "shipment": self.shipment.vendor_name,
            "seller_id": self.seller_id,
            "is_active": self.is_active,
        }
