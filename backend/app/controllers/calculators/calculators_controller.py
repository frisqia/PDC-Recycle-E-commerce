from . import calculators_blueprint
from .calculators_service import CalculatorsService

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request

service = CalculatorsService()


@calculators_blueprint.route("/calculate", methods=["POST"])
@jwt_required()
def calculate():
    data = request.get_json()
    identity = get_jwt_identity()
    return service.calculate(data, identity)
