import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

interface ProductCardProps {
  product_id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  quickAdd?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product_id, name, price, image }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ product_id, name, price, image, quantity: 1 });
    console.log( product_id, name, price, image );
    
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-300">
      {/* Product image */}
      <img
        src={image}
        alt={name}
        className="h-56 w-full object-cover rounded-md mb-3 transition-transform duration-300 hover:scale-95"
      />

      {/* Product name and price */}
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-gray-600 mb-3">${price}</p>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        {/* ✅ Corrected View button */}
        <Link to={`/product/${product_id}`} className="w-1/2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all font-medium"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
        </Link>

        {/* Add to Cart button */}
        <Button
          onClick={handleAddToCart}
          className="w-1/2 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 font-medium"
        >
          <ShoppingCart className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
