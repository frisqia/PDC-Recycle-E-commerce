from sqlalchemy import (
    SmallInteger,
    Column,
    VARCHAR,
    DateTime,
    ForeignKey,
    Integer,
    event,
)
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz

from ..db import db


class Districts(db.Model):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, autoincrement=False)
    province_id = Column(SmallInteger, ForeignKey("provinces.id"), nullable=False)
    district = Column(VARCHAR(100), unique=False, nullable=False)
    created_at = Column(DateTime, default=datetime.now(pytz.UTC), nullable=False)
    updated_at = Column(DateTime, onupdate=datetime.now(pytz.UTC), nullable=True)

    addresses = relationship("Addresses", backref="district_addresses")

    def to_dict(self):
        return {
            "id": self.id,
            "province_id": self.province_id,
            "district": self.district,
        }
