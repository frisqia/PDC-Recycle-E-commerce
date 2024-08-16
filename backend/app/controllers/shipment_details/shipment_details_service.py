from app.db import db
from .shipment_details_repository import ShipmentDetailsRepository
from ..shipments.shipments_service import ShipmentsService


class ShipmentDetailsService:

    def __init__(self, db=db, repository=None):
        self.db = db
        self.repository = repository or ShipmentDetailsRepository()
        self.shipment_service = ShipmentsService()

    def create_detail(self, data, user_address_id, transaction_id):
        try:
            shipments = self.shipment_service.list_shipments()
            shipments = {
                shipment["vendor_name"]: shipment["id"] for shipment in shipments
            }

            shipment_id = shipments.get(data.get("vendor_name"))
            seller_address_id = data.get("seller_address_id")
            service = data.get("service")
            shipment_cost = data.get("shipment_fee")
            total_weight_gram = data.get("total_weight_gram")
            user_address_id = user_address_id

            new_shipment_detail = self.repository.create_shipment_detail(
                {
                    "transaction_id": transaction_id,
                    "seller_address_id": seller_address_id,
                    "service": service,
                    "shipment_cost": shipment_cost,
                    "total_weight_gram": total_weight_gram,
                    "user_address_id": user_address_id,
                    "shipment_id": shipment_id,
                },
            )

            self.db.session.add(new_shipment_detail)
            self.db.session.commit()

            return {"message": "Shipment detail created successfully"}, 201

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500
