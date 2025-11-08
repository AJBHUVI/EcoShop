import {
  Leaf,
  Recycle,
  Heart,
  TreePine,
  Wind,
  Droplets,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Sustainability() {
  const impacts = [
    {
      icon: TreePine,
      value: "Eco-Friendly Products",
      label: "Sustainable Materials",
      description:
        "Most items showcased on our platform are crafted using organic, recycled, or natural materials.",
    },
    {
      icon: Recycle,
      value: "Low-Waste Design",
      label: "Reusable Packaging",
      description:
        "We promote products that use recycled, compostable, or reusable packaging materials.",
    },
    {
      icon: Wind,
      value: "Optimized UX",
      label: "Energy Conscious",
      description:
        "The platform is designed with efficient code and optimized performance to reduce energy usage.",
    },
    {
      icon: Droplets,
      value: "Smart Consumption",
      label: "Environment First",
      description:
        "Helping users make conscious buying decisions through clean UI and product clarity.",
    },
  ];

  const initiatives = [
    {
      title: "Promoting Sustainable Shopping",
      description:
        "Our store highlights products made from renewable, biodegradable, or recycled materials, guiding users toward environmentally conscious purchasing.",
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop",
    },
    {
      title: "Eco-Friendly Packaging Awareness",
      description:
        "We focus on listing products that avoid single-use plastics and prioritize recyclable and bio-friendly packaging options.",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    },
    {
      title: "Supporting Ethical & Local Brands",
      description:
        "Our platform showcases brands prioritizing fair trade, responsible sourcing, and ethical production standards.",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
    },
  ];

  const timeline = [
    {
      title: "Planning & Wireframing",
      desc: "Defined the structure, UI flow, and core features like cart, favorites, and search.",
    },
    {
      title: "Frontend Development",
      desc: "Implemented product grid, filtering, product details, animations, and reusable card components.",
    },
    {
      title: "Backend & Database",
      desc: "Created Express API, MySQL tables, cart operations, and user-specific cart storage.",
    },
    {
      title: "Sustainability Integration",
      desc: "Added eco-friendly product categories, packaging info, sustainability messaging, and awareness content.",
    },
    {
      title: "UI/UX Polish",
      desc: "Added smooth animations, responsive layouts, hover effects, and color consistency.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Leaf className="h-16 w-16 mx-auto mb-6 text-primary animate-float" />
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Sustainability in Our Platform
          </h1>
          <p
            className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Our project focuses on responsible shopping, eco-friendly products,
            and conscious user interaction — without compromising design and experience.
          </p>
        </div>
      </section>

      {/* IMPACT */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Sustainability Means to Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-card to-muted/50 rounded-2xl shadow-sm animate-scale-in hover:shadow-md transition"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <impact.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-xl font-bold text-primary mb-2">
                {impact.value}
              </div>
              <div className="text-lg font-semibold mb-2">{impact.label}</div>
              <p className="text-sm text-muted-foreground">
                {impact.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INITIATIVES */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Sustainability Initiatives
          </h2>

          <div className="space-y-12 max-w-6xl mx-auto">
            {initiatives.map((initiative, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row gap-8 items-center animate-fade-in ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="md:w-1/2">
                  <img
                    src={initiative.image}
                    alt={initiative.title}
                    className="rounded-2xl w-full h-80 object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">
                    {initiative.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {initiative.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How This Project Was Built
        </h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 transform -translate-x-1/2"></div>

          {timeline.map((step, index) => (
            <div
              key={index}
              className={`mb-12 flex items-center ${
                index % 2 === 0
                  ? "justify-start text-left"
                  : "justify-end text-right"
              }`}
            >
              <div
                className="w-5 h-5 bg-primary rounded-full z-10 shadow-md"
                style={{ animationDelay: `${index * 0.15}s` }}
              ></div>

              <div
                className={`max-w-sm p-6 rounded-xl bg-white shadow-md border animate-fade-in ${
                  index % 2 === 0
                    ? "ml-6"
                    : "mr-6"
                }`}
              >
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-6">A Future Built Responsibly</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our eco-conscious approach ensures users can shop with awareness,
            purpose, and confidence.
          </p>
        </div>
      </section>
    </div>
  );
}
