import bcrypt
from enum import Enum
from flask_login import UserMixin
from sqlalchemy import Column, Integer, VARCHAR, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz

from ..db import db


class Is_Active_Status(Enum):
    INACTIVE = 0
    ACTIVE = 1


class Users(db.Model, UserMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(VARCHAR(30), unique=True, nullable=False)
    fullname = Column(VARCHAR(30), nullable=False)
    email = Column(VARCHAR(50), unique=True, nullable=False)
    password = Column(VARCHAR(255), nullable=False)
    phone_number = Column(VARCHAR(14), unique=True, nullable=False)
    is_active = Column(Integer, default=Is_Active_Status.ACTIVE.value, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now(pytz.UTC))
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.now(pytz.UTC))

    user_seller_vouchers = relationship("UserSellerVouchers", backref="user")
    transactions = relationship("Transactions", backref="user")
    reviews = relationship("Reviews", backref="user_reviews")
    addresses = relationship("Addresses", backref="user_addresses", lazy="joined")

    def __init__(self, username, password, fullname, email, phone_number):
        self.username = username
        self.fullname = fullname
        self.email = email
        self.phone_number = phone_number
        self.password = self.set_password(password)

    def set_password(self, password):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))

    def to_dict(self):
        addresses = [address.to_dict() for address in self.addresses]

        return {
            "username": self.username,
            "fullname": self.fullname,
            "email": self.email,
            "phone_number": self.phone_number,
            "addresses": addresses,
        }

    def delete_user(self):
        self.is_active = Is_Active_Status.INACTIVE.value
