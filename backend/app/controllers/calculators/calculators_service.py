from flask import request, jsonify
import asyncio

from ..users.users_repository import UserRepository

from .voucher_service import VoucherService
from .product_service import ProductService
from .shipment_service import ShipmentService


class CalculatorsService:
    def __init__(
        self,
        user_repository=None,
        voucher_service=None,
        product_service=None,
        shipment_service=None,
    ):
        self.user_repository = user_repository or UserRepository()
        self.voucher_service = voucher_service or VoucherService()
        self.product_service = product_service or ProductService()
        self.shipment_service = shipment_service or ShipmentService()

    def calculate_cart(self, data, identity):
        """
        carts: [
            {
                "product_id": 1,
                "quantity": 2
                },
            {
                "product_id": 2,
                "quantity": 1
                }
                ],
        selected_user_voucher_ids: [1, 3, 5],
        user_selected_address_id: 2,
        selected_courier:
        {
            "3" : {"jne" : "CTCYES"},
            "4" : {"jne" : "CTCYES"}
        }
        """

        try:
            carts = data.get("carts")
            user_id = identity.get("id")
            role = identity.get("role")
            user_selected_address_id = data.get("user_selected_address_id")
            selected_voucher = data.get("selected_user_voucher_ids", [])
            selected_courier = data.get("selected_courier", None)

            # initial verification
            self.initial_verification(role=role, carts=carts, user_id=user_id)

            # calculate product detail (total_price, volume, weight, etc)
            calculated_product_detail = self.product_service.calculate_product_detail(
                carts=carts
            )

            # check voucher and get voucher detail
            if selected_voucher and len(selected_voucher) > 0:
                voucher_list = self.voucher_service.get_sorted_vouchers(
                    selected_voucher=selected_voucher,
                    identity=identity,
                    calculated_product_detail=calculated_product_detail,
                )

                # insert discount to calculated_product_detail
                for key, value in voucher_list.items():
                    calculated_product_detail[key]["total_discount"] = value

            # Calculated shipment fee
            if selected_courier:
                calculated_shipment_fee = self.calculate_shipment_fee(
                    identity=identity,
                    user_selected_address_id=user_selected_address_id,
                    selected_courier=selected_courier,
                    calculated_product_detail=calculated_product_detail,
                )

                # inser to calculated_product_detail
                for key, value in calculated_shipment_fee.items():
                    calculated_product_detail[int(key)]["shipment_fee"] = value

            # insert total with shipment fee
            final_calculation = self.calculate_final_price(
                calculated_product_detail=calculated_product_detail
            )

            return final_calculation
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def calculate_final_price(self, calculated_product_detail):
        for key, value in calculated_product_detail.items():
            if not value.get("shipment_fee", None) or not value.get(
                "total_discount", None
            ):
                return calculated_product_detail

            total_price_before_shipment = int(value["total_price_before_shipment"])
            shipment_fee = int(value["shipment_fee"])
            total_discount = int(value["total_discount"])

            value["final_price"] = (
                total_price_before_shipment + shipment_fee - total_discount
            )

        return calculated_product_detail

    def initial_verification(self, role, carts, user_id):
        if role != "user":
            raise ValueError("For user only")

        if not carts:
            raise ValueError("No items in cart")

        if not self.user_repository.get_user_by_id(user_id):
            raise ValueError("User not found")

    def calculate_shipment_fee(
        self,
        identity,
        user_selected_address_id,
        selected_courier,
        calculated_product_detail,
    ):
        user_district = self.shipment_service.check_selected_user_address(
            identity=identity, user_address_id=user_selected_address_id
        )["district_id"]

        all_shipment_fee = {}

        for seller_id, courier in selected_courier.items():
            seller_district = self.shipment_service.get_seller_address(
                seller_id=seller_id
            )["district_id"]
            courier_vendor = list(courier.keys())[0]

            shipment_option = asyncio.run(
                self.shipment_service.get_possible_shipment_option(
                    user_district=user_district,
                    seller_district=seller_district,
                    total_weight=calculated_product_detail.get(int(seller_id)).get(
                        "total_weight_gram"
                    ),
                    courier=courier_vendor,
                )
            )

            for data in shipment_option.get(courier_vendor):
                if data["service"] == courier.get(courier_vendor):
                    all_shipment_fee[seller_id] = data["cost"]

        return all_shipment_fee
