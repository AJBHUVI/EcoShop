import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoriteContext";

interface ProductCardProps {
  product_id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product_id,
  name,
  price,
  image,
  category,
  rating,
}) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = () => {
    addToCart({ product_id, name, price, image, quantity: 1 });
  };

  const toggleFavorite = () => {
    if (isFavorite(product_id)) removeFromFavorites(product_id);
    else addToFavorites({ product_id, name, price, image, category, rating });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-300">
      <img
        src={image}
        alt={name}
        className="h-56 w-full object-cover rounded-md mb-3 transition-transform duration-300 hover:scale-95"
      />
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-gray-600 mb-3">${price}</p>

      <div className="flex items-center gap-2 mt-auto">
        {/* View Button */}
        <Link to={`/product/${product_id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all font-medium"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
        </Link>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 font-medium"
        >
          <ShoppingCart className="h-4 w-4" /> Add
        </Button>

        {/* ❤️ Wishlist Button */}
        <button
          onClick={toggleFavorite}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        > 
          <Heart
            size={20}
            className={
              isFavorite(product_id)
                ? "text-red-500 fill-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
