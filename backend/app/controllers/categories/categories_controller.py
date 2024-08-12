from . import categories_blueprint
from .categories_service import CategoriesService


service = CategoriesService()


@categories_blueprint.route("/", methods=["GET"])
def get_categories():
    return service.get_categories()
