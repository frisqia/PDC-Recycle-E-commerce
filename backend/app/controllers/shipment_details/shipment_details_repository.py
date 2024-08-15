from app.db import db
from app.models import ShipmentDetails


class ShipmentDetailsRepository:

    def __init__(self, db=db, shipment_details=ShipmentDetails):
        self.db = db
        self.shipment_details = shipment_details
