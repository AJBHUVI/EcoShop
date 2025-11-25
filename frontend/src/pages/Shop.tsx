// src/pages/Shop.tsx
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const updatePriceInDB = async (id: number, price: number) => {
  try {
    await axios.put(`/products/price/${id}`, { price });
  } catch (err) {
    console.error("Update error", err);
  }
};


export default function Shop() {
  const query = useQuery();
  const q = query.get("q") ?? "";

  const [searchQuery, setSearchQuery] = useState<string>(q);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  // Fetch all products from database
  const fetchProducts = async () => {
  try {
    const res = await fetch("/products");
    const data = await res.json();
    setDbProducts(data || []);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
  }
};

useEffect(() => {
  fetchProducts();
}, [])

  // Static demo products
  const staticProducts: Product[] = [
    { product_id: 1, name: "Organic Cotton T-Shirt", price: 850, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop", category: "Clothing", rating: 4.8 },
    { product_id: 2, name: "Bamboo Sunglasses", price: 899, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.6 },
    { product_id: 3, name: "Slipper", price: 249, image: "/images/slipper.jpeg", category: "Footwear", rating: 4.1 },
    { product_id: 4, name: "Hemp Backpack", price: 1299, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.7 },
    { product_id: 5, name: "Sustainable Sneakers", price: 1200, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop", category: "Footwear", rating: 4.8 },
    { product_id: 6, name: "Reusable Water Bottle", price: 135, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.9 },
    { product_id: 7, name: "Linen Summer Dress", price: 1099, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop", category: "Clothing", rating: 4.7 },
    { product_id: 8, name: "Cork Wallet", price: 420, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.6 },
    { product_id: 9, name: "Organic Cotton Hoodie", price: 780, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop", category: "Clothing", rating: 4.8 },
    { product_id: 10, name: "Bamboo Toothbrush Set", price: 80, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop", category: "Personal Care", rating: 4.9 },
    { product_id: 11, name: "Recycled Tote Bag", price: 280, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.7 },
    { product_id: 12, name: "Natural Soap Set", price: 330, image: "/images/natural-soap.jpg", category: "Personal Care", rating: 4.8 },
    { product_id: 13, name: "Wireless Mouse", price: 249, image: "/images/mouse.jpg", category: "Electronics", rating: 4.6 },
    { product_id: 14, name: "Crocs", price: 335, image: "/images/crocs.jpeg", category: "Footwear", rating: 3.9 },
    { product_id: 15, name: "Perfume", price: 790, image: "/images/perfume.jpg", category: "Accessories", rating: 4.2 },
    { product_id: 16, name: "Shirt", price: 750, image: "/images/shirts.webp", category: "Clothing", rating: 4.8 },
  ];

    useEffect(() => {
  const syncPrices = async () => {
    for (const p of staticProducts) {
      await updatePriceInDB(p.product_id, p.price);
    }
    await fetchProducts();
  };

  syncPrices();
}, []);

  // Generate categories dynamically
  const categories = ["All", ...new Set(dbProducts.map((p) => p.category))];

  // Filter products based on search + category
  const filteredProducts = useMemo(() => {
    const sq = (searchQuery || "").trim().toLowerCase();

    return dbProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesSearch = !sq ||
      product.name.toLowerCase().includes(sq) || product.category.toLowerCase().includes(sq) || String(product.product_id).includes(sq);

      return matchesCategory && matchesSearch;
    });
  }, [dbProducts, selectedCategory, searchQuery]);

  

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font mb-4">Shop All Products</h1>
          <p className="text-muted-foreground text-lg">
            Explore eco friendly and sustainable products
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>          
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 ${
                selectedCategory === cat ? "bg-green-600 text-white" : ""
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.product_id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
