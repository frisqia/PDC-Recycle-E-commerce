from app.db import db
from ..sellers.sellers_service import SellersServices
from .transactions_repository import TransactionsRepository
from ..shipment_details.shipment_details_service import ShipmentDetailsService


class TransactionServiceUpdate:
    def __init__(
        self, db=db, repository=None, seller_service=None, shipment_details_service=None
    ):
        self.db = db
        self.repository = repository or TransactionsRepository()
        self.seller_service = seller_service or SellersServices()
        self.shipment_details_service = (
            shipment_details_service or ShipmentDetailsService()
        )

    def change_to_prepared(self, identity, transaction_id):
        try:
            self.check_role(identity=identity)

            transaction = self.repository.get_transaction_by_id(
                transaction_id=transaction_id, role="seller", role_id=identity.get("id")
            )

            transaction.change_to_prepared()
            self.db.session.commit()

            return {"message": "Transaction changed to prepared successfully"}, 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def update_tracking_number(self, transaction_id, identity, data):
        try:
            self.check_role(identity=identity)

            messsage, status_code = (
                self.shipment_details_service.update_tracking_number(
                    seller_id=identity.get("id"),
                    transaction_id=transaction_id,
                    tracking_number=data.get("tracking_number"),
                )
            )

            if status_code != 200:
                raise ValueError(messsage["error"])

            transaction = self.repository.get_transaction_by_id(
                transaction_id=transaction_id, role="seller", role_id=identity.get("id")
            )

            transaction.change_to_on_delivery()
            self.db.session.commit()

            return {
                "message": "Tracking number and transaction status updated successfully"
            }, 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def check_role(self, identity):
        role = identity.get("role")
        role_id = identity.get("id")

        if role != "seller":
            raise ValueError("Unauthorized")

        seller, status_code = self.seller_service.seller_info(seller_id=role_id)

        if status_code != 200:
            raise ValueError(seller["error"])