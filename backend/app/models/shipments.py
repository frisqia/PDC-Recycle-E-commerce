from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    VARCHAR,
    event,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz

from ..db import db


class Shipments(db.Model):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    vendor_name = Column(VARCHAR(30), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(pytz.UTC))

    shipping_options = relationship("ShippingOptions", backref="shipment")

    def to_dict(self):
        return {
            "id": self.id,
            "vendor_name": self.vendor_name,
        }
