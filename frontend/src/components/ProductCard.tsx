// src/components/ProductCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Heart as HeartIcon } from "lucide-react";
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
  // optional prop to allow full width in some contexts
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product_id,
  name,
  price,
  image,
  category,
  rating,
  compact = false,
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
    <div
      className={`relative bg-white rounded-xl shadow-md p-3 flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-200 ${
        compact ? "max-w-[220px]" : "w-full"
      }`}
      role="article"
    >
      {/* heart overlay */}
      <button
        onClick={toggleFavorite}
        aria-label="Toggle favorite"
        className="absolute top-3 right-3 z-20 p-1 rounded-full bg-white/90 hover:bg-white border"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        <HeartIcon
          size={18}
          className={isFavorite(product_id) ? "text-red-500 fill-red-500" : "text-gray-400"}
        />
      </button>

      {/* image area */}
      <div className={`flex items-center justify-center mb-3 ${compact ? "h-40" : "h-56"}`}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="max-h-full object-contain w-full rounded-md"
            style={{ display: "block" }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <h3 className="font-semibold text-base mb-1 line-clamp-2">{name}</h3>
      <p className="text-gray-600 mb-3">${price}</p>

      <div className="flex items-center gap-2 mt-auto">
        <Link to={`/product/${product_id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all font-medium"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
        </Link>

        <Button
          onClick={handleAddToCart}
          className="flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 font-medium"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
