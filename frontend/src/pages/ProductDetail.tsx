import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Leaf } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import axios from "axios";

export default function ProductDetail() {
  const { product_id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();

  // ✅ Fetch product details from backend
   useEffect(() => {
    fetch(`/products/${product_id}`)
    
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [product_id]);

  if (!product) return <p>Loading...</p>;

  const relatedProducts = [
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
      product_id: 3, name: "Slipper", price: 239, image: "/images/slipper.jpeg", category: "Footwear", rating: 4.1 
      // id: 3,
      // name: "Recycled Yoga Mat",
      // price: 68,
      // image:
      //   "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop",
      // category: "Fitness",
      // rating: 4.9,
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
          {/* Image Section */}
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
            <div className="mb-4">
              <span className="text-sm font-medium text-primary">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="text-4xl font-bold text-primary mb-6">
              ${product.price}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <span className="px-6 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-l-none"
                >
                  +
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1"
                onClick={async () => {
              try {
                addToCart({ ...product, quantity });
                openCart();

                const userId = localStorage.getItem("user_id");

              if (!userId) {
                  alert("Please login first to add items to your cart.");
              return;
            }

            await fetch("/cart/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
              user_id: userId,
              product_id: product.product_id,
              quantity: quantity,
        }),
      });

          console.log("✅ Added to DB for user:", userId);
          } catch (err) {
          console.error("❌ Error adding to DB cart_items:", err);
         }
        }} >

                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
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
