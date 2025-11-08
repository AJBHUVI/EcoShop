// src/pages/Home.tsx
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Leaf, Recycle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { useEffect } from "react";

export default function Home() {

  // ✅ Add scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show-section");
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".reveal-section").forEach((el) => observer.observe(el));
  }, []);

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

      {/* ✅ HERO SECTION with parallax & fade */}
      <section className="relative overflow-hidden hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center hero-bg"
          style={{ backgroundImage: `url(${heroBanner})`, minHeight: "60vh" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-start pt-16 h-[60vh]">
            <div className="w-full lg:w-1/2">
              <div className="max-w-lg bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-slide-up">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight animate-fade-in">
                  Shop Sustainably,
                  <br />Live Responsibly
                </h1>

                <p className="mt-4 text-gray-100/90 text-base leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  Discover eco-friendly products that make a difference —
                  thoughtfully made, beautifully designed, and better for the planet.
                </p>

                <div className="mt-6 flex gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <Link to="/shop">
                    <Button size="lg" className="rounded-full text-lg flex items-center gap-2 hover:scale-105 transition">
                      Shop Now <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>

                  <Link to="/sustainability">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full text-lg px-6 border-white text-white hover:bg-white hover:text-foreground transition"
                    >
                      Our Impact
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:w-1/2"></div>
          </div>
        </div>
      </section>

      {/* ✅ TRENDING PRODUCTS with animation */}
      <section className="container mx-auto px-4 py-20 reveal-section opacity-0 translate-y-8 transition-all duration-700">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold animate-slide-up">Trending for Yours</h2>

          <Link to="/shop">
            <Button variant="ghost" className="group hover:bg-primary/10">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <div
              key={product.product_id}
              className="animate-item"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      {/* ✅ VALUES SECTION with stagger reveal */}
      <section className="bg-muted/50 py-20 reveal-section opacity-0 translate-y-8 transition-all duration-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose EcoShop?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8 text-primary" />,
                title: "100% Sustainable",
                desc: "Every product is carefully sourced from eco-friendly materials.",
              },
              {
                icon: <Recycle className="h-8 w-8 text-primary" />,
                title: "Circular Economy",
                desc: "We promote recycling, upcycling, and zero-waste practices.",
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                title: "Community First",
                desc: "Supporting artisans and fair-trade practices worldwide.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-6 animate-item"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pop">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
