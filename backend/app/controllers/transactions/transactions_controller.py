from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from

from . import transactions_blueprint
from .transactions_service import TransactionsService
from .transactions_midtrans import MidtransConfirmation

service = TransactionsService()
midtrans_confirmation = MidtransConfirmation()


@transactions_blueprint.route("/create", methods=["POST"])
@jwt_required()
@swag_from("./transactions_create.yml")
def transaction_create():
    data = request.get_json()
    identity = get_jwt_identity()
    return service.create_transaction(data, identity)


@transactions_blueprint.route("/", methods=["GET"])
@jwt_required()
@swag_from("./transactions_get_list.yml")
def transaction_list():
    identity = get_jwt_identity()
    req = request
    return service.list_transactions(identity, req)


@transactions_blueprint.route("/confirmation", methods=["POST"])
def midtrans_webhook():
    data = request.get_json()
    return midtrans_confirmation.midtrans_confirmation(data)
