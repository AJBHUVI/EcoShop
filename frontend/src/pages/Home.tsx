import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Leaf, Recycle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Home() {
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
    <main className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      {/* HERO SECTION with parallax & fade */}
<section className="relative overflow-hidden">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-center bg-cover"
    style={{ backgroundImage: `url(${heroBanner})` }}
  />

  {/* Overlay for better text readability */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Content */}
  <div className="relative container mx-auto px-4 py-32 md:py-40 flex items-center justify-center h-auto">
    <div className="max-w-xl text-center bg-white/20 backdrop-blur-md rounded-2xl p-8 sm:p-12 shadow-2xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
        Shop Sustainably
        <br />
        Live Responsibly
      </h1>

      <p className="mt-4 text-white/90 text-base sm:text-lg md:text-xl leading-relaxed animate-fade-in">
        Discover eco-friendly products that make a difference — thoughtfully made, beautifully designed, and better for the planet.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/shop">
          <Button size="lg" className="rounded-full text-lg hover:scale-105 transition">
            Shop Now
          </Button>
        </Link>

        <Link to="/sustainability">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-lg px-6 text-white hover:bg-white hover:text-foreground transition"
          >
            Our Impact
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>


      {/* TRENDING PRODUCTS */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">Trending Products</h2>
          <Link to="/shop">
            <Button variant="ghost" className="hover:bg-primary/10 flex items-center gap-1">
              View All <ArrowRight />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.product_id} {...product} />
          ))}
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-muted/50 py-20">
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
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
