from app.db import db
from .addresses_repository import AddressesRepository
from ..common import get_data_and_validate, is_filled


class AddressesService:
    def __init__(self, db=db, repository=None):
        self.db = db
        self.repository = repository or AddressesRepository()

    def create_address(self, data, identity):
        try:
            data = get_data_and_validate(
                data,
                receiver_name=str,
                phone_number=str,
                address_type=str,
                address_line=str,
                province_id=int,
                district_id=int,
                subdistrict_id=int,
                postal_code=str,
            )

            if not is_filled(**data):
                raise ValueError("Please fill all required fields")

            rt_rw = data.get("rt_rw")
            data["rt_rw"] = rt_rw if rt_rw else "000/000"

            if identity.get("role") == "seller":
                data["seller_id"] = identity.get("id")
                data["user_id"] = None
            if identity.get("role") == "user":
                data["user_id"] = identity.get("id")
                data["seller_id"] = None

            address = self.repository.create_address(data)

            self.db.session.add(address)
            self.db.session.commit()

            return {"message": "Address added successfully"}
        except ValueError as e:
            self.db.session.rollback()
            return {"error": str(e)}, 400
        except Exception as e:
            self.db.session.rollback()
            return {"error": str(e)}, 500

    def edit_adress(self, data, identity, address_id):
        try:
            data = get_data_and_validate(
                data,
                receiver_name=str,
                phone_number=str,
                address_type=str,
                address_line=str,
                province_id=int,
                district_id=int,
                subdistrict_id=int,
                rt_rw=str,
                postal_code=str,
            )

            address = self.repository.get_address_by_filter(
                address_id=address_id,
                role_id=identity.get("id"),
                role=identity.get("role"),
            )

            if address is None:
                raise ValueError("Address not found")

            for key, value in data.items():
                if value is not None:
                    setattr(address, key, value)

            self.db.session.commit()

            return {"address": "Address updated successfully"}

        except ValueError as e:
            self.db.session.rollback()
            return {"error": str(e)}, 400
        except Exception as e:
            self.db.session.rollback()
            return {"error": str(e)}, 500

    def delete_address(self, identity, address_id):
        try:
            address = self.find_address_by_identity_address(
                identity=identity, address_id=address_id
            )

            if address is None:
                raise ValueError("Address not found")

            address.delete_address()
            self.db.session.commit()

            return {"address": "Address deleted successfully"}

        except ValueError as e:
            self.db.session.rollback()
            return {"error": str(e)}, 400
        except Exception as e:
            self.db.session.rollback()
            return {"error": str(e)}, 500

    def list_address(self, identity):
        try:
            role = identity.get("role")
            role_id = identity.get("id")

            address = self.repository.get_list_address(role_id=role_id, role=role)

            if address is None:
                raise ValueError("Address not found")

            return [address.to_dict() for address in address], 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def get_address_by_id(self, identity, address_id):
        try:
            address = self.find_address_by_identity_address(
                identity=identity, address_id=address_id
            )

            if address is None:
                raise ValueError("Address not found")

            return address.to_dict(), 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    def find_address_by_identity_address(self, identity, address_id):
        role = identity.get("role")
        role_id = identity.get("id")

        address = self.repository.get_address_by_filter(
            address_id=address_id, role_id=role_id, role=role
        )

        return address
