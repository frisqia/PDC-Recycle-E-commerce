from .products_repository import ProductsRepository
from ..sellers.sellers_repository import SellersRepository

from app.db import db
from ..common import is_filled, get_data_and_validate


class ProductsServices:
    def __init__(
        self, db=db, repository=None, seller_repository=None, category_repository=None
    ):
        self.db = db
        self.repository = repository or ProductsRepository()
        self.seller_repository = seller_repository or SellersRepository()

    def create_product(self, data, role, role_id):
        self.check_role_and_id(role, role_id)

        try:
            all_data = self.all_data(data)

            if not is_filled(**all_data):
                raise ValueError("Please fill all required fields")

            new_product = self.repository.create_product(seller_id=role_id, **all_data)

            self.db.session.add(new_product)
            self.db.session.commit()
            return {"message": "Product created successfully"}, 201

        except (TypeError, ValueError) as e:
            self.db.session.rollback()
            return {"error": str(e)}, 400
        except Exception as e:
            self.db.session.rollback
            return {"error": str(e)}, 500

    def get_list_products(self, request, role, role_id=None):
        self.check_role_and_id(role, role_id)

        try:
            per_page = request.args.get("per_page", 10, int)
            page = request.args.get("page", 1, int)

            products = self.repository.get_list_products(
                role=role, page=page, per_page=per_page, role_id=role_id
            )
            return self.response(products=products), 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def get_product_by_id(self, product_id, role, role_id=None):
        self.check_role_and_id(role, role_id)

        try:
            product = self.repository.get_product_by_id(
                role=role, product_id=product_id, role_id=role_id
            )

            if product is None:
                raise ValueError("Product not found")

            return product.to_dict(), 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def update_product(self, product_id, role, role_id, data):
        self.check_role_and_id(role, role_id)

        try:
            all_data = self.all_data(data)

            product = self.repository.get_product_by_id(
                product_id=product_id, role=role, role_id=role_id
            )
            count_updated_key = 0
            key_updated = []

            if product is None:
                raise ValueError("Product not found")

            for key, data in all_data.items():
                if data is None:
                    continue
                if data and hasattr(product, key):
                    setattr(product, key, data)
                    count_updated_key += 1
                    key_updated.append(key)

            if count_updated_key == 0:
                raise ValueError("No data to update")

            self.db.session.commit()

            return {
                "message": "Product updated successfully",
                "key_updated": key_updated,
            }, 200
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def delete_product(self, product_id, role, role_id):
        self.check_role_and_id(role, role_id)

        try:
            product = self.repository.get_product_by_id(
                role=role, product_id=product_id, role_id=role_id
            )

            if product is None:
                raise ValueError("Product not found")

            product.is_active = 0

            self.db.session.commit()
            return {"message": "Product deleted successfully"}, 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def check_role_and_id(self, role, role_id):
        if role != "seller":
            return {"error": "Unauthorized"}, 401
        if role_id is None:
            return {"error": "Invalid seller"}, 400
        if self.seller_repository.get_seller_by_id(role_id) is None:
            return {"error": "Invalid seller"}, 400
        return True

    def all_data(self, data):
        return get_data_and_validate(
            data,
            name=str,
            description=str,
            price=int,
            weight_kg=float,
            stock=int,
            image_url=str,
            product_type=int,
            category_id=int,
            length_cm=int,
            width_cm=int,
            height_cm=int,
        )

    def response(self, products):
        return {
            "products": [product.to_dict() for product in products],
            "total_page": products.pages,
            "current_page": products.page,
            "total_items": products.total,
        }
