from app.db import db
from .transactions_repository import TransactionsRepository
from ..common import get_data_and_validate, is_filled


class TransactionsService:
    def __init__(self, db=db, repository=None):
        self.db = db
        self.repository = repository or TransactionsRepository()

    def create_transaction(self, data, identity):
        pass
