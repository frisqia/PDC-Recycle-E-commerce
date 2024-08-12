from app.db import db
from app.models import Transactions


class TransactionsRepository:
    def __init__(self, db=db, transaction=Transactions):
        self.db = db
        self.transaction = transaction
