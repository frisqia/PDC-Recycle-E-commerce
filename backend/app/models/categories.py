from sqlalchemy import Column, VARCHAR, SmallInteger, DateTime, event
from sqlalchemy.orm import relationship
from enum import Enum
from datetime import datetime
import pytz

from ..db import db


class Is_Active_Status(Enum):
    INACTIVE = 0
    ACTIVE = 1


class Categories(db.Model):
    __tablename__ = "categories"

    id = Column(SmallInteger, primary_key=True, autoincrement=True)
    category_name = Column(VARCHAR(30), unique=True, nullable=False)
    is_active = Column(
        SmallInteger, default=Is_Active_Status.ACTIVE.value, nullable=False
    )
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=True)

    products = relationship("Products", backref="category")

    def __init__(self, category_name):
        self.category_name = category_name

    def to_dict(self):
        return {"id": self.id, "category_name": self.category_name}

    def delete_category(self):
        self.is_active = Is_Active_Status.INACTIVE.value


@event.listens_for(Categories, "before_insert")
def set_created_at(mapper, connection, target):
    target.created_at = datetime.now(pytz.UTC)


@event.listens_for(Categories, "before_update")
def set_updated_at(mapper, connection, target):
    target.updated_at = datetime.now(pytz.UTC)
