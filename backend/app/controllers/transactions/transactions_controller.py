from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import transactions_blueprint
from .transactions_service import TransactionsService

service = TransactionsService()


@transactions_blueprint.route("/transactions/new", methods=["POST"])
@jwt_required()
def transaction_create():
    data = request.get_json()
    identity = get_jwt_identity()
    return service.create_transaction(data, identity)
