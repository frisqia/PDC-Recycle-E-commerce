from app.db import db
from .shipment_details_repository import ShipmentDetailsRepository


class ShipmentDetailsService:

    def __init__(self, db=db, repository=None):
        self.db = db
        self.repository = repository or ShipmentDetailsRepository()

    def create_detail(self, seller):
        pass
