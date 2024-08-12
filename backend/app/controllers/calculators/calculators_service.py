from ..products.products_repository import ProductsRepository


class CalculatorsService:
    def __init__(self, product_repository=None):
        self.product_repository = product_repository or ProductsRepository()

    def calculate(self, data, identity):

        try:
            item = data.get("item")
            user_id = identity.get("id")
            role = identity.get("role")

            if role != "user":
                raise ValueError("User role only")

            if not item:
                raise ValueError("Item not found")
        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def get_price(self, data):
        pass
