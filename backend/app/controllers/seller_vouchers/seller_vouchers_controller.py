from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import seller_vouchers_blueprint
from .seller_vouchers_service import SellerVouchersService


service = SellerVouchersService()


@seller_vouchers_blueprint.route("/create", methods=["POST"])
@jwt_required()
def voucher_create():
    data = request.get_json()
    identity = get_jwt_identity()
    return service.create_voucher(data, identity)


@seller_vouchers_blueprint.route("/list", methods=["GET"])
@jwt_required()
def voucher_list():
    identity = get_jwt_identity()
    req = request
    return service.list_vouchers(identity=identity, req=req)


@seller_vouchers_blueprint.route("/list/<int:voucher_id>", methods=["GET"])
@jwt_required()
def voucher_detail(voucher_id):
    identity = get_jwt_identity()
    return service.voucher_detail(voucher_id, identity)


@seller_vouchers_blueprint.route("/update/<int:voucher_id>", methods=["PUT"])
@jwt_required()
def voucher_update(voucher_id):
    data = request.get_json()
    identity = get_jwt_identity()
    return service.update_voucher(data, identity, voucher_id)


@seller_vouchers_blueprint.route("/delete/<int:voucher_id>", methods=["DELETE"])
@jwt_required()
def voucher_delete(voucher_id):
    identity = get_jwt_identity()
    return service.delete_voucher(voucher_id, identity)
