from app.db import db
from app.models import Transactions


class TransactionsRepository:
    def __init__(self, db=db, transaction=Transactions):
        self.db = db
        self.transaction = transaction

    def create_transaction(self, data):
        return self.transaction(**data)

    def get_transaction_by_user_id(self, role, role_id, tx=None):
        query = self.transaction.query

        if role == "user":
            query = query.filter_by(user_id=role_id)
        if role == "seller":
            query = query.filter_by(seller_id=role_id)

        if tx:
            query = query.filter_by(id=tx)

        return query.all()

    def get_transaction_by_parent_id(self, parent_id):
        return self.transaction.query.filter_by(parent_id=parent_id).all()
