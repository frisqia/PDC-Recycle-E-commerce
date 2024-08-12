from sqlalchemy import Column, Integer, SmallInteger, Text, DateTime, ForeignKey, event
from datetime import datetime
import pytz

from app.db import db


class Reviews(db.Model):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(SmallInteger, nullable=False)
    review = Column(Text, nullable=True)
    # transaction_id = (
    #     Column(Integer, ForeignKey("transactions.id"), nullable=False))
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "seller_id": self.seller_id,
            # "transaction_id": self.transaction_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "review": self.review,
        }
