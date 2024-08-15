from sqlalchemy import Column, Integer, DateTime, VARCHAR, ForeignKey, Text
from datetime import datetime
import pytz


from ..db import db


class ShipmentDetails(db.Model):
    __tablename__ = "shipment_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    seller_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    user_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    service = Column(VARCHAR(30), nullable=False)
    tracking_number = Column(VARCHAR(30), nullable=True)
    shipment_cost = Column(Integer, nullable=False)
    total_weight_gram = Column(Integer, nullable=False)
    shipment_status = Column(Text, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(pytz.UTC)
    )
    updated_at = Column(
        DateTime, nullable=True, onupdate=lambda: datetime.now(pytz.UTC)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tracking_number": self.tracking_number,
        }
