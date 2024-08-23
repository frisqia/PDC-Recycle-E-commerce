"use client";

import React, { useEffect, useState } from "react";
import Loading from "../components/loading/loading";
import FooterDash from "../components/footer";
import { instanceWithAuth } from "@/utils/auth";

import Link from "next/link";



interface Transactions {
  message: string;
  payment_data: {
    redirect_url: string;
    token: string;
  };
}

interface SellerInfo {
  store_district: string;
  store_image_url: string | null;
  store_name: string;
}

interface DetailProduct {
  category_id: number;
  id: number;
  is_active: number;
  name: string;
  price: number;
  product_type: number;
  seller_id: number;
  seller_info: SellerInfo;
  volume_m3: string;
  weight_kg: string;
}

interface Item {
  detail_product: DetailProduct;
  seller_id: number;
  quantity: number;
  sub_total: number;
  sub_volume: string;
  sub_volume_to_weight: string;
  sub_weight: string;
}

interface SellerCalculation {
  etd: string;
  final_price: number;
  items: Item[];
  seller_address_id: number;
  service: string;
  shipment_fee: number;
  total_price_before_shipment: number;
  total_weight_gram: string;
  vendor_name: string;
}

interface FinalCalculation {
  [sellerId: string]: SellerCalculation;
}

interface FinalCalculationResponse {
  all_final_price: number;
  final_calculation: FinalCalculation;
}

interface ShipmentOption {
  cost: number;
  description: string;
  etd: string;
  service: string;
}

interface CalculateShipmentResponse {
  [vendor_name: string]: ShipmentOption[];
}

interface Address {
  id: number;
  address_line: string;
  address_type: string;
  district_id: number;
  district_name: string;
  phone_number: string;
  postal_code: string;
  province_id: number;
  province_name: string;
  receiver_name: string;
  rt_rw: string;
}

interface CartProduct {
  detail_product: {
    id: number;
    weight_kg: string;
    seller_id: number;
    name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
  sub_total: number;
}


interface Courier {
  id: number;
  vendor_name: string;
}

export default function CheckoutProduct() {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [shipmentOptions, setShipmentOptions] =
    useState<CalculateShipmentResponse>({});
  const [selectedCourier, setSelectedCourier] = useState<{
    selected_courier: string;
    selected_service: string;
    seller_id: number;
  } | null>(null);

  const [showCourierOptions, setShowCourierOptions] = useState<boolean>(false);
  const [selectedShippingCost, setSelectedShippingCost] = useState<
    number | null
  >(null);

  const [finalCalculation, setFinalCalculation] =
    useState<FinalCalculationResponse | null>(null);
  const [transaction, setTransaction] = useState<Transactions | null>(null);
  
  const[errorTransaction, setErrorTransactions] = useState<string | null>(null)


  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cartResp, addressesResp, couriersResp] = await Promise.all([
          instanceWithAuth.get(`carts/list`),
          instanceWithAuth.get(`addresses/list`),
          instanceWithAuth.get(`shipments/list`)
        ]);

        setProducts(cartResp.data.items);
        setTotalPrice(cartResp.data.total_price);
        setAddresses(addressesResp.data);
        setCouriers(couriersResp.data);
        if (addressesResp.data.length > 0) setSelectedAddressId(addressesResp.data[0].id);

      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const calculateShipmentOptions = async () => {
      if (!selectedAddressId || products.length === 0) return;

      setLoading(true);
      try {
        const response = await instanceWithAuth.post(
          `calculators/shipmentoption`,
          {
            seller_id: products[0].detail_product.seller_id,
            total_weight_gram: products.reduce(
              (total, product) =>
                total +
                Number(product.detail_product.weight_kg) *
                  product.quantity *
                  1000,
              0
            ),
            user_selected_address_id: selectedAddressId,
          }
        );

        setShipmentOptions(response.data);
       
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    calculateShipmentOptions();
  }, [selectedAddressId, products]);

  useEffect(() => {
    const fetchFinalCalculation = async () => {
      if (!selectedCourier || !selectedAddressId) return;

      try {

        const response = await instanceWithAuth.post(
          `calculators/calculatecart`,
          {
            carts: products.map((product) => ({
              product_id: product.detail_product.id,
              quantity: product.quantity,
            })),
            selected_courier: [selectedCourier],
            user_selected_address_id: selectedAddressId,
          }
        );

        setFinalCalculation(response.data);
      
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      }
    };

    fetchFinalCalculation();
  }, [selectedCourier, selectedAddressId, products]);

  const handleTransaction = async () => {
    if (!finalCalculation || !selectedAddressId || !selectedCourier) {
      setErrorTransactions("Please select a courier before processing.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await instanceWithAuth.post(
        `transactions/create`,
        {
          carts: products.map((product) => ({
            product_id: product.detail_product.id,
            quantity: product.quantity,
          })),
          selected_courier: [selectedCourier],
          user_selected_address_id: selectedAddressId,
        }
      );

      setTransaction(response.data);
      setError(null);
      window.location.href = response.data.payment_data.redirect_url;
     
    } catch (error: any) {
      setError(error.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShipmentOptionClick = (
    vendorName: string,
    option: ShipmentOption,
    sellerId: number
  ) => {
    setSelectedCourier({
      selected_courier: vendorName,
      selected_service: option.service,
      seller_id: sellerId,
    });
    setSelectedShippingCost(option.cost);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
    
    <div className="py-20 px-[5vw] lg:px-[10vw] bg-custom-light-blue grid gap-2 h-full">
    
   
      <Link href={'/'} className="flex gap-2 bg-white rounded-lg p-5 ">
      <img src='/ICON.ico' alt="logo" className="hover:"/>
    <h1 className="font-bold text-lg text-custom-green">Checkout</h1></Link>
  
      <div className=" py-4 px-10 text-sm bg-white rounded-t-lg shadow-lg text-custom-Olive-Drab font-bold">
        <h2 className="text-sm">Shipping Address</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3">
        <h2>Select Address</h2>
        <select onChange={(e) => setSelectedAddressId(Number(e.target.value))} value={selectedAddressId ?? ""}>
          {addresses.map((address) => (
            <option key={address.id} value={address.id} >
              <strong>
                {address.receiver_name} {address.phone_number}
              </strong>
              <div>
              <p className="flex flex-wrap">
                {address.address_line}, rt/rw {address.rt_rw},</p>
              <p>kec : {address.district_name}, prov:{" "}
                {address.province_name} - {address.postal_code}</p>
              </div>
            </option>
          ))}
        </select>
      </div>
      </div>
      {products.length > 0 && (
        <div className="grid grid-cols-1 justify-between gap-10 bg-white py-4 px-10 shadow-lg">
          <table className="w-full ">
            <thead>
              <tr>
                <th className="text-left">PRODUCT</th>
                <th className="text-left ">PRICE</th>
                <th className="text-left ">QUANTITY</th>
                <th className="text-left ">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.detail_product.id}>
                  <td className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
                    <img
                      src={product.detail_product.image_url}
                      style={{ width: "50px", height: "50px" }}
                      alt={product.detail_product.name}
                      className="object-cover"
                    />
                    {product.detail_product.name}
                  </td>
                  <td className="text-left ">
                    Rp.{product.detail_product.price}
                  </td>
                  <td className="text-left  ">{product.quantity}pcs</td>
                  <td className="text-left  ">Rp.{product.sub_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(shipmentOptions).length > 0 && (
        <div className="bg-white py-4 px-10 shadow-lg">
          <button
            onClick={() => setShowCourierOptions(!showCourierOptions)}
            className="font-bold bg-custom-Gunmetal text-white hover:bg-custom-light-blue/80 hover:text-custom-Gunmetal p-2 rounded-lg"
          >
            Select Courier
          </button>
          {showCourierOptions && (
            <div className="p-4">
              {Object.keys(shipmentOptions).map((vendorName) => (
                <div key={vendorName}>
                  <h3 className="font-bold text-sm">{vendorName}</h3>
                  <div>
                    {shipmentOptions[vendorName].map((option) => (
                      <div key={option.service} className="mb-2">
                        <button
                          className="bg-custom-pastel-green rounded-lg p-2 gap-2 hover:bg-custom-green/80 hover:text-white"
                          onClick={() =>
                            handleShipmentOptionClick(
                              vendorName,
                              option,
                              products[0].detail_product.seller_id
                            )
                          }
                        >
                          {option.service} - Rp. {option.cost} - ETD:{" "}
                          {option.etd}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end items-center space-x-4 mt-4 px-10 bg-white p-4 rounded-b-lg shadow-lg">
        <div className="flex flex-col text-right">
          <h2 className="text-xl font-semibold mb-2">Final Calculation :</h2>
          {selectedShippingCost !== null && (
            <div className="flex justify-between">
              <p className="mr-20">Shipping cost  :</p>
              <p className="ml-20" >Rp. {selectedShippingCost}</p>
            </div>
          )}
          <div className="flex justify-between ">
            <p >Total  :</p>
            <p >Rp.{totalPrice}</p>
          </div>
          {finalCalculation && (
            <div className="flex justify-between ">
              <p >Total Payment  :</p>
              <p  >
                Rp. {finalCalculation.all_final_price}
              </p>
            </div>
          )}
       
          <button
          onClick={handleTransaction}
          className="bg-custom-green text-white p-2 rounded-lg"
        >
          Make an Order
        </button>
        {errorTransaction && <p className="text-red-500 mt-2">{errorTransaction}</p>} 
        </div>
      </div>
      <FooterDash />
    </div>
    </>
  );
}
