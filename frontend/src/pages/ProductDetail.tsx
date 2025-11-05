import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import { useFavorites } from "@/components/FavoriteContext";

export default function ProductDetail() {
  const { product_id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use the same relative fetch you had before so image path handling stays unchanged
    fetch(`/products/${product_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [product_id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const toggleFavorite = () => {
    if (isFavorite(product.product_id)) removeFromFavorites(product.product_id);
    else addToFavorites(product);
  };

  // Adds to DB and updates CartContext (UI)
  const handleAddToCart = async () => {
    try {
      const user_id = sessionStorage.getItem("user_id"); // keep your existing usage
      if (!user_id) {
        alert("Please log in to add items to the cart.");
        return;
      }

      // POST to your backend route (relative path) — ensure your server mounts router at /cart
      const res = await fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          product_id: product.product_id,
          quantity,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend responded with error:", res.status, text);
        throw new Error("Failed to save cart item on server");
      }

      // Update local UI cart (CartContext) after successful DB insert
      addToCart({ ...product, quantity });
      openCart();
      console.log("Added to cart (DB + UI):", product.product_id);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart. Check console for details.");
    }
  };

  const relatedProducts = [
    
    {
      product_id: 1, name: "Organic Cotton T-Shirt", price: 45, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop", 
      category: "Clothing", rating: 4.8 },
    {
      product_id: 2,
      name: "Bamboo Sunglasses",
      price: 89,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.6,
    },
    {
      product_id: 3,
      name: "Slipper",
      price: 239,
      image: "/images/slipper.jpeg",
      category: "Footwear",
      rating: 4.1,
    },
    {
      product_id: 4,
      name: "Hemp Backpack",
      price: 95,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Section (use product.image exactly like before) */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <span className="text-sm font-medium text-primary">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="text-4xl font-bold text-primary mb-6">
              ${product.price}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="flex gap-4 mb-8">
              {/* Quantity Controls */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="px-6 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>

              {/* Add to Cart (saves to DB then updates UI) */}
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              {/* Favorite */}
              <Button
                size="lg"
                variant="outline"
                onClick={toggleFavorite}
                className={
                  isFavorite(product.product_id) ? "border-red-500 text-red-500" : ""
                }
              >
                <Heart
                  className={
                    isFavorite(product.product_id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.product_id} {...p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
