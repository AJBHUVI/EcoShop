import { Users, Target, Award, Code, Layers, PackageSearch, Sparkles } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            About This Project
          </h1>

          <p
            className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            A modern full-stack e-commerce platform built from scratch with a
            passion for clean UI, seamless shopping, and real-world development experience.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-4 text-lg text-muted-foreground">
          <h2 className="text-3xl font-bold mb-6 text-center">The Story Behind the Build</h2>
          <p>
            This e-commerce application was built to replicate a real-world shopping
            experience using the latest web technologies. The goal was simple — create
            an intuitive, fast, and visually appealing online store with features users
            expect in 2025.
          </p>

          <p>
            From product search to category filters, from animated cart drawers
            to database-synced carts, every part of the platform is crafted to
            feel clean, modern, and professional.
          </p>

          <p>
            This project showcases strong frontend design, backend development,
            database logic, and user-focused UI decisions — all woven together
            into one complete full-stack application.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center max-w-4xl mx-auto">
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary">16+</h3>
              <p className="text-muted-foreground">Static + Dynamic Products</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary">10+</h3>
              <p className="text-muted-foreground">Core Features Implemented</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary">100%</h3>
              <p className="text-muted-foreground">Responsive UI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What This Project Includes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-primary" />,
              title: "Modern UI/UX",
              desc: "Smooth animations, clean layouts, responsive grids, and reusable UI components.",
            },
            {
              icon: <PackageSearch className="w-8 h-8 text-primary" />,
              title: "Product Features",
              desc: "Search, categories, filters, favorites, quick add, detailed product pages.",
            },
            {
              icon: <Layers className="w-8 h-8 text-primary" />,
              title: "Full-Stack Logic",
              desc: "Cart API, MySQL database, user-specific cart storage, and backend routing.",
            },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Developer</h2>

        <div className="max-w-md mx-auto text-center animate-fade-in space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
              <Code className="w-20 h-20 text-primary" />
            </div>
          </div>

          <h3 className="text-2xl font-semibold">Bhuvaneshwaran L</h3>
          <p className="text-muted-foreground text-lg">Developer</p>

          <p className="text-muted-foreground mt-4">
            Architected and developed the complete e-commerce platform including
            the frontend, backend API, MySQL database, cart logic, routing,
            dynamic filtering, UI design, product management, and fully responsive layout.
          </p>
        </div>
      </section>
    </main>
  );
}
