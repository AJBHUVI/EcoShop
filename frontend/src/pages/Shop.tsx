import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample product data - in production, this would come from a database
  const products = [
    {
      id: 1,
      name: "Organic Cotton T-Shirt",
      price: 45,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      category: "Clothing",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Bamboo Sunglasses",
      price: 89,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Recycled Yoga Mat",
      price: 68,
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop",
      category: "Fitness",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Hemp Backpack",
      price: 95,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.7,
    },
    {
      id: 5,
      name: "Sustainable Sneakers",
      price: 120,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
      category: "Footwear",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Reusable Water Bottle",
      price: 35,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.9,
    },
    {
      id: 7,
      name: "Linen Summer Dress",
      price: 85,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
      category: "Clothing",
      rating: 4.7,
    },
    {
      id: 8,
      name: "Cork Wallet",
      price: 42,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.6,
    },
    {
      id: 9,
      name: "Organic Cotton Hoodie",
      price: 78,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
      category: "Clothing",
      rating: 4.8,
    },
    {
      id: 10,
      name: "Bamboo Toothbrush Set",
      price: 18,
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
      category: "Personal Care",
      rating: 4.9,
    },
    {
      id: 11,
      name: "Recycled Tote Bag",
      price: 28,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.7,
    },
    {
      id: 12,
      name: "Natural Soap Set",
      price: 32,
      image: "https://images.unsplash.com/photo-1600857062241-98e5dba60f2f?w=800&auto=format&fit=crop",
      category: "Personal Care",
      rating: 4.8,
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Shop All Nithish</h1>
          <p className="text-muted-foreground text-lg">
            Discover our curated collection of sustainable and eco-friendly products
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
