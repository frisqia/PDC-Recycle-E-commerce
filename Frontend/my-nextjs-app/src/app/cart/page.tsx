"use client";
import { useEffect, useState, ChangeEvent } from "react";

import NavbarPage from "../components/navbar";
import Loading from "../components/loading/loading";
import { useRouter } from "next/navigation";
import { instanceWithAuth } from "@/utils/auth";



interface CartProduct {
  detail_product: {
    category_id: number;
    id: number;
    image_url: string;
    is_active: number;
    name: string;
    price: number;
    seller_id: number;
    stock: number;
  };
  quantity: number;
  sub_total: number;
}

interface CartResponse {
  items: CartProduct[];
  total_price: number;
}

export default function PageCart() {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

  const router = useRouter();
  useEffect(() => {
    async function fetchCartProducts() {
      try {

        const cartResp = await instanceWithAuth.get(`carts/list`)
        if (cartResp.status !== 200) {
          throw new Error("Failed to fetch cart products");

        }
        const data: CartResponse = cartResp.data;
        if (Array.isArray(data.items)) {
          setProducts(data.items);
          setTotalPrice(data.total_price);
        } else {
          console.error("Expected 'items' to be an array", data.items);
          setProducts([]);
        }
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchCartProducts();
  }, []);

  const updateTotalPrice = (newProducts: CartProduct[]) => {
    const newTotalPrice = newProducts.reduce(
      (acc, item) => acc + item.sub_total,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    try {

      await instanceWithAuth.post(`carts/createupdate`,{
        items:[{product_id: id, quantity: newQuantity }]
      })
     
      const updatedProducts = products.map((product) =>
        product.detail_product.id === id
          ? {
              ...product,
              quantity: newQuantity,
              sub_total: product.detail_product.price * newQuantity,
            }
          : product
      );
      setProducts(updatedProducts);
      updateTotalPrice(updatedProducts);
    } catch (error: any) {
      setError(error.message || "Failed to update quantity");
    }
  };

  const handleQuantityInputChange = (
    id: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      handleQuantityChange(id, newQuantity);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await instanceWithAuth.delete(`carts/delete/${id}`)
      const remainingProducts = products.filter(
        (p) => p.detail_product.id !== id
      );
      setProducts(remainingProducts);
      updateTotalPrice(remainingProducts);
    } catch (error: any) {
      setError(error.message || "Failed to delete item");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <NavbarPage />
      <style jsx>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
      <div>
        <div className="grid pt-[45vh]">
          <h1 className="flex justify-center text-4xl">SHOPPING CART</h1>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 p-10">
          
            <div className="py-10">
              <table className="w-full border-collapse">
                <thead className="font-bold text-xs">
                  <tr>
                    <th className="text-left">PRODUCT</th>
                    <th className="text-left">PRICE</th>
                    <th className="text-left">STOCK</th>
                    <th className="text-left">QUANTITY</th>
                    <th className="text-left">SUBTOTAL</th>
                    <th className="text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm lg:text-lg">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No products in the cart
                      </td>
                    </tr>
                  ) : (
                    products.map((cart) => (
                      <tr key={cart.detail_product.id}>
                        <td className="py-2">
                          <div className="grid grid-cols-1 lg:grid-cols-2 item-center">
                            <img
                              src={cart.detail_product.image_url}
                              alt={cart.detail_product.name}
                              className="w-[50px] h-[50px]"
                            />
                            <span>{cart.detail_product.name}</span>
                          </div>
                        </td>
                        <td className="py-2">
                          Rp. {cart.detail_product.price}
                        </td>
                        <td className="py-2">
                          {cart.detail_product.stock} pcs
                        </td>
                        <td className="py-2">
                          <div className="flex item-center">
                            <button
                              className="px-2 py-1 bg-gray-300 text-black w-8 h-8 flex items-center justify-center"
                              onClick={() => {
                                const newQuantity = Math.max(
                                  cart.quantity - 1,
                                  0
                                );
                                handleQuantityChange(
                                  cart.detail_product.id,
                                  newQuantity
                                );
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="px-2 py-1 border w-16 h-8 text-center no-spinner"
                              value={cart.quantity}
                              onChange={(e) =>
                                handleQuantityInputChange(
                                  cart.detail_product.id,
                                  e
                                )
                              }
                              min="0"
                            />
                            <button
                              className="px-2 py-1 bg-gray-300 text-black w-8 h-8 flex items-center justify-center"
                              onClick={() => {
                                const newQuantity = Math.min(
                                  cart.quantity + 1,
                                  cart.detail_product.stock
                                );
                                handleQuantityChange(
                                  cart.detail_product.id,
                                  newQuantity
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-2">Rp.{cart.sub_total}</td>
                        <td className="py-2">
                          <button
                            className="text-red-500"
                            onClick={() => handleDelete(cart.detail_product.id)}
                          >
                            <i className="fa fa-close"> Cancel</i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="py-10">
              <p className="text-lg font-semibold">CART TOTALS</p>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="py-2 text-left">Total Price:</td>
                    <td className="py-2 text-right">Rp.{totalPrice}</td>
                  </tr>
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="flex border p-2 text-white bg-custom-green hover:bg-custom-green/80 text-xs"
              >
                PROCESS TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
