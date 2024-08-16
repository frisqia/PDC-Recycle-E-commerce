from app.db import db
from .transactions_repository import TransactionsRepository
from ..users.users_services import UserServices
from ..product_orders.product_orders_service import ProductOrdersService
from ..sellers.sellers_service import SellersServices
from ..calculators.calculators_service import CalculatorsService
from .transactions_midtrans import MidtransConfirmation
from ..midtrans.midtrans_service import MidtransService
from .transactions_voucher import TransactionsVoucherService

from datetime import datetime
import uuid


class TransactionsService:
    def __init__(
        self,
        db=db,
        repository=None,
        user_service=None,
        product_order_service=None,
        seller_service=None,
        calculator_service=None,
        midtrans_confirmation=None,
        midtrans_service=None,
        transaction_voucher_service=None,
    ):
        self.db = db
        self.repository = repository or TransactionsRepository()
        self.user_service = user_service or UserServices()
        self.product_order_service = product_order_service or ProductOrdersService()
        self.seller_service = seller_service or SellersServices()
        self.calculator_service = calculator_service or CalculatorsService()
        self.midtrans_confirmation = midtrans_confirmation or MidtransConfirmation()
        self.midtrans_service = midtrans_service or MidtransService()
        self.transaction_voucher_service = (
            transaction_voucher_service or TransactionsVoucherService()
        )

    def list_transactions(self, identity, req):
        try:
            tx = req.args.get("tx", None)
            role = identity.get("role")
            role_id = identity.get("id")

            if role == "user":
                self.check_user(identity)
            if role == "seller":
                self.check_seller

            transactions = self.repository.get_transaction_by_user_id(
                role=role, role_id=role_id, tx=tx
            )

            if not transactions:
                raise ValueError("No transactions found")

            return [transaction.to_dict() for transaction in transactions], 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def create_transaction(self, data, identity):
        try:
            self.check_data(data)
            user_id = self.check_user(identity)
            calculator_data, status_code = self.calculator_service.calculate_cart(
                data, identity
            )

            if status_code != 200:
                raise ValueError(calculator_data["error"])

            calculator_data = calculator_data.get("final_calculation")

            parent_id = self.generate_parent_transaction_id()

            response = self.midtrans_service.create_transaction(
                calculator_data, parent_id
            )

            for seller_id, details in calculator_data.items():
                # check seller_id
                self.check_seller(seller_id)

                # generate transaction id & parent_id
                transaction_id = self.generate_transaction_id()

                # create transaction
                transaction_details = {}

                transaction_details["user_seller_voucher_id"] = details.get(
                    "user_seller_voucher_id", None
                )
                transaction_details["total_discount"] = details.get(
                    "total_discount", None
                )
                transaction_details["user_id"] = user_id
                transaction_details["seller_id"] = seller_id
                transaction_details["id"] = transaction_id
                transaction_details["parent_id"] = parent_id
                transaction_details["payment_link"] = response["redirect_url"]

                new_transaction = self.repository.create_transaction(
                    transaction_details
                )

                self.db.session.add(new_transaction)

                # create product_order
                product_order = self.product_order_service.create_product_order(
                    data=details, transaction_id=transaction_id, commit=False
                )

                if product_order[1] not in [200, 201]:
                    raise ValueError(product_order[0]["error"])

            if data.get("selected_user_voucher_ids", None):
                self.transaction_voucher_service.used_user_seller_voucher(
                    identity=identity, data=data
                )

            self.db.session.commit()

            return {
                "message": "Transaction created successfully",
                "payment_data": response,
            }, 201

        except ValueError as e:
            self.db.session.rollback()
            return {"error": str(e)}, 400
        except Exception as e:
            self.db.session.rollback()
            return {"error": str(e)}, 500

    def check_user(self, identity):
        role = identity.get("role")
        role_id = identity.get("id")

        if role != "user":
            raise ValueError("Unauthorized")

        user = self.user_service.user_info(user_id=role_id)
        if not user:
            raise ValueError("User not found")

        return user[0]["user"]["id"]

    def check_seller(self, seller_id):
        seller = self.seller_service.seller_info(seller_id=seller_id)

        if not seller:
            raise ValueError("Seller not found")

    def check_data(self, data):
        carts = data.get("carts")
        user_selected_address_id = data.get("user_selected_address_id")
        selected_courier = data.get("selected_courier")

        if not carts or len(carts) <= 0:
            raise ValueError("Carts not found")

        if not user_selected_address_id:
            raise ValueError("User selected address not found")

        if not selected_courier or len(selected_courier) <= 0:
            raise ValueError("Selected courier not found")

    def generate_transaction_id(self):
        prefix = "TRX"
        date_str = datetime.now().strftime("%Y%m%d")

        snowflake_id = str(uuid.uuid4()).replace("-", "").upper()
        snowflake_id = snowflake_id[:8]

        return f"{prefix}{date_str}{snowflake_id}"

    def generate_parent_transaction_id(self):
        prefix = "PRT"
        date_str = datetime.now().strftime("%Y%m%d")

        snowflake_id = str(uuid.uuid4()).replace("-", "").upper()
        snowflake_id = snowflake_id[:8]

        return f"{prefix}{date_str}{snowflake_id}"
