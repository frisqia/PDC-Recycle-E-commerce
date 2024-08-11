from . import calculators_blueprint
from .calculators_service import CalculatorsService
from .shipment_service import ShipmentService

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request

service = CalculatorsService()
shipment_service = ShipmentService()


@calculators_blueprint.route("/calculatecart", methods=["POST"])
@jwt_required()
def calculate_cart():
    data = request.get_json()
    identity = get_jwt_identity()
    return service.calculate_cart(data, identity)


@calculators_blueprint.route("/shipmentoption", methods=["POST"])
@jwt_required()
def shipment_option():
    data = request.get_json()
    identity = get_jwt_identity()
    return shipment_service.shipment_option_price(data, identity)
