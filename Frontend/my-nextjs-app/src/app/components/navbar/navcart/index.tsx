import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import Loading from "../../loading/loading";

import { instanceWithAuth } from "@/utils/auth";


interface Product {
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

interface Response {
  items: Product[];
  total_price: number;
}

export default function NavCart() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleNavCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  const handleSeeAllClick = () => {
    if (isAuthenticated) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    async function fetchCartProducts() {
      try {

        const cartResp = await instanceWithAuth.get(`carts/list`)
        if (cartResp.status !== 200) {
          throw new Error("Failed to fetch cart products");
        }
        const data: Response = cartResp.data;
        setProducts(data.items || []);
        setIsAuthenticated(true);

      } catch (error: any) {
   
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    fetchCartProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <button
          className="w-full bg-custom-green text-white p-2 rounded hover:bg-custom-green/80 transition duration-300"
          onClick={handleNavCartClick}
        >
          <i className="fa fa-shopping-cart"></i>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-full">
        <div className="p-2">
          {products && products.length === 0 ? (
            <div className="text-center text-lg text-red-500 font-bold">
              {isAuthenticated
                ? "No products in the cart"
                : "Please login first"}
            </div>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {products.map((product) => (
                  <tr key={product.detail_product.id}>
                    <td className="py-1">
                      <div className="flex items-center">
                        <img
                          src={product.detail_product.image_url}
                          alt={product.detail_product.name}
                          className="w-10 h-10"
                        />
                        <span className="ml-2">
                          {product.detail_product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2">
                      Rp.{product.detail_product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 text-center">x {product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSeeAllClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              See All
            </button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
