import { useState, useEffect } from "react";
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
  rating: number;
}

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // ✅ category state

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("/products");
      const data = await res.json();
      setDbProducts(data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };
  fetchProducts();
}, []);

  // ✅ Static demo products
  const staticProducts: Product[] = [
    { product_id: 1, name: "Organic Cotton T-Shirt", price: 45, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop", category: "Clothing", rating: 4.8 },
    { product_id: 2, name: "Bamboo Sunglasses", price: 89, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.6 },
    { product_id: 3, name: "Slipper", price: 239, image: "/images/slipper.jpeg", category: "Footwear", rating: 4.1 },
    { product_id: 4, name: "Hemp Backpack", price: 95, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.7 },
    { product_id: 5, name: "Sustainable Sneakers", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop", category: "Footwear", rating: 4.8 },
    { product_id: 6, name: "Reusable Water Bottle", price: 35, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.9 },
    { product_id: 7, name: "Linen Summer Dress", price: 85, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop", category: "Clothing", rating: 4.7 },
    { product_id: 8, name: "Cork Wallet", price: 42, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.6 },
    { product_id: 9, name: "Organic Cotton Hoodie", price: 78, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop", category: "Clothing", rating: 4.8 },
    { product_id: 10, name: "Bamboo Toothbrush Set", price: 18, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop", category: "Personal Care", rating: 4.9 },
    { product_id: 11, name: "Recycled Tote Bag", price: 28, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop", category: "Accessories", rating: 4.7 },
    { product_id: 12, name: "Natural Soap Set", price: 32, image: "/images/natural-soap.jpg", category: "Personal Care", rating: 4.8 },
    { product_id: 13, name: "Wireless Mouse", price: 249, image: "/images/mouse.jpg", category: "Electronics", rating: 4.6 },
    { product_id: 14, name: "Crocs", price: 335, image: "/images/crocs.jpeg", category: "Footwear", rating: 3.9 },
    { product_id: 15, name: "Perfume", price: 790, image: "/images/perfume.jpg", category: "Accessories", rating: 4.2 },
    { product_id: 16, name: "Shirt", price: 450, image: "/images/shirts.webp", category: "Clothing", rating: 4.8 },
  ];

  // ✅ Merge static + DB
  const allProducts: Product[] = [
    ...staticProducts,
    ...dbProducts.filter((db) => !staticProducts.some((sp) => sp.product_id === db.product_id)),
  ];

  // ✅ Extract unique categories dynamically
  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];
  // console.log("Before",allProducts);
  
  // console.log("After",...allProducts);
  

  // ✅ Apply both category & search filtering
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  // console.log(...allProducts);
  

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Shop All Yours</h1>
          <p className="text-muted-foreground text-lg">
            Discover our curated collection of sustainable and eco-friendly products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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

        {/* ✅ Category Buttons */}
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

       {/* ✅ Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {filteredProducts.map((product, index) => (
    <div
      key={`${product.product_id}-${index}`}
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <ProductCard
        {...product}
        quickAdd // ✅ new prop
      />
    </div>
  ))}
</div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
