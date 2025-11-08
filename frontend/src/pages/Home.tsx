// src/pages/Home.tsx
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Leaf, Recycle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Home() {
  const categories = [
    { name: "Sustainable Fashion", icon: "👕", color: "from-primary/20 to-primary/5" },
    { name: "Eco Home", icon: "🏡", color: "from-secondary/20 to-secondary/5" },
    { name: "Natural Beauty", icon: "🌿", color: "from-accent/20 to-accent/5" },
    { name: "Zero Waste", icon: "♻️", color: "from-primary/20 to-primary/5" },
  ];

  const trendingProducts = [
    {
      product_id: 1,
      name: "Organic Cotton T-Shirt",
      price: 45,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      category: "Clothing",
      rating: 4.8,
    },
    {
      product_id: 2,
      name: "Bamboo Sunglasses",
      price: 89,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
      category: "Accessories",
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section: shorter height, top-left content */}
      <section
        className="relative overflow-hidden"
        aria-label="Hero"
      >
        {/* Background image + subtle dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})`, minHeight: "55vh" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

        {/* Content container - positioned top-left and limited width for readability */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-start pt-12 lg:pt-16 h-[55vh] lg:h-[60vh]">
            <div className="w-full lg:w-1/2 flex items-start">
              <div className="max-w-lg bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight text-white">
                  Shop Sustainably,
                  <br />
                  Live Responsibly
                </h1>

                <p className="mt-4 text-sm sm:text-base text-gray-100/90 leading-relaxed">
                  Discover eco-friendly products that make a difference — thoughtfully
                  made, beautifully designed, and better for the planet.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/shop" aria-label="Shop Now">
                    <Button size="lg" className="text-lg px-6 py-2.5 inline-flex items-center gap-2 rounded-full">
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <Link to="/sustainability" aria-label="Our Impact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-6 py-2.5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-foreground"
                    >
                      Our Impact
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* right side left empty intentionally so image is visible */}
            <div className="hidden lg:block lg:w-1/2" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name.toLowerCase()}`}
              className="group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-br ${category.color} p-8 rounded-2xl hover-scale cursor-pointer transition-all duration-300`}>
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Trending for Yours</h2>
          <Link to="/shop">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <div
              key={Number(product.product_id)}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product_id={Number(product.product_id)}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                rating={product.rating}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose EcoShop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Sustainable</h3>
              <p className="text-muted-foreground">
                Every product is carefully sourced from eco-friendly materials and ethical suppliers
              </p>
            </div>
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Circular Economy</h3>
              <p className="text-muted-foreground">
                We promote recycling, upcycling, and zero-waste practices in everything we do
              </p>
            </div>
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community First</h3>
              <p className="text-muted-foreground">
                Supporting local artisans and fair-trade practices that benefit communities worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
