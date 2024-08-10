from datetime import datetime
import pytz

from .carts_repository import CartsRepository
from app.db import mongo
from ..products.products_repository import ProductsRepository
from ..users.users_repository import UserRepository


class CartsService:
    def __init__(
        self,
        repository=None,
        product_repository=None,
        user_repository=None,
    ):
        self.mongo = mongo
        self.repository = repository or CartsRepository()
        self.product_repository = product_repository or ProductsRepository()
        self.user_repository = user_repository or UserRepository()

    def list_cart(self, user_id):
        try:
            user = self.user_repository.get_user_by_id(user_id)

            if not user:
                raise ValueError("User not found")

            cart = self.repository.find_cart_by_user_id(user_id)

            if not cart:
                return {}

            items_with_price = {"items": [], "total_price": 0}

            for item in cart["items"]:
                product_detail = self.product_repository.get_product_by_id(
                    role="user", product_id=item["product_id"]
                )

                if not product_detail:
                    raise ValueError(f"Product {item['product_id']} not found")

                sub_total = product_detail.price * item["quantity"]

                items_with_price["items"].append(
                    {
                        "detail_product": product_detail.to_cart(),
                        "quantity": item["quantity"],
                        "sub_total": sub_total,
                    }
                )
                items_with_price["total_price"] += sub_total

            return items_with_price

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def create_update_cart(self, data, identity):
        try:
            if identity.get("role") != "user":
                raise ValueError("Unauthorized (User only)")

            user_id = identity.get("id")
            items = data.get("items")
            user_cart = self.repository.find_cart_by_user_id(user_id)

            for item in items:
                if item["quantity"] <= 0:
                    raise ValueError("Quantity must be greater than 0")

            for item in items:
                if user_cart:
                    # check is product exist in products table, if not raise error
                    self.check_product(product_id=item["product_id"])

                    # check if user already have specific product in cart
                    is_exist = self.repository.find_one(
                        user_id=user_id, product_id=item["product_id"]
                    )

                    if is_exist:
                        self.repository.update_existed(
                            user_id=user_id,
                            product_id=item["product_id"],
                            quantity=item["quantity"],
                        )
                    else:
                        item["added_to_cart"] = str(datetime.now(pytz.UTC))

                        self.repository.update_new(user_id=user_id, items=item)
                else:
                    self.check_product(product_id=item["product_id"])
                    item["added_to_cart"] = str(datetime.now(pytz.UTC))

                    user_cart = True

                    self.repository.insert_cart(user_id, item)

            return {"message": "Cart created/updated successfully"}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def delete_cart(self, product_id, identity):
        try:
            if identity.get("role") != "user":
                raise ValueError("Unauthorized (User only)")

            user_id = identity.get("id")
            is_exist = self.repository.find_one(user_id=user_id, product_id=product_id)

            if not is_exist:
                raise ValueError("Product not found")

            self.repository.delete_one(user_id=user_id, product_id=product_id)

            return {"message": "Cart item deleted successfully"}, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def check_product(self, product_id):
        product = self.product_repository.get_product_by_id(
            role="user", product_id=product_id
        )

        if not product:
            raise ValueError("Product not found")

        return product
