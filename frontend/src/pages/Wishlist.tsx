// src/pages/Wishlist.tsx
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/components/FavoriteContext";

export default function Wishlist() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">My Wishlist ❤️</h1>
          <p className="text-muted-foreground text-lg">
            Save your favorite products for later
          </p>
        </div>

        {favorites.length > 0 ? (
          // Use a responsive compact grid. Each cell centers the card.
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {favorites.map((product, index) => (
              <div key={product.product_id} className="flex justify-start">
                {/* Pass compact to keep consistent card width/height */}
                <ProductCard
                  {...product}
                  product_id={Number(product.product_id)}
                  compact
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-6">
              Your wishlist is empty
            </p>
            <Link to="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
