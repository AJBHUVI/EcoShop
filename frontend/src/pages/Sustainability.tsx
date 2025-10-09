import { Leaf, Recycle, Heart, TreePine, Wind, Droplets } from "lucide-react";

export default function Sustainability() {
  const impacts = [
    {
      icon: TreePine,
      value: "10,000+",
      label: "Trees Planted",
      description: "Through our partnership with One Tree Planted",
    },
    {
      icon: Recycle,
      value: "500 tons",
      label: "Waste Diverted",
      description: "From landfills through recycling programs",
    },
    {
      icon: Wind,
      value: "Carbon Neutral",
      label: "Shipping",
      description: "All deliveries offset with renewable energy",
    },
    {
      icon: Droplets,
      value: "2M gallons",
      label: "Water Saved",
      description: "Through sustainable production methods",
    },
  ];

  const initiatives = [
    {
      title: "Circular Fashion Program",
      description: "Return your used items for recycling or upcycling. Get store credit for every item returned.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop",
    },
    {
      title: "Zero Waste Packaging",
      description: "All our packaging is either recyclable, compostable, or reusable. We've eliminated single-use plastics entirely.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    },
    {
      title: "Fair Trade Partners",
      description: "We work exclusively with certified fair trade suppliers who guarantee living wages and safe working conditions.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Leaf className="h-16 w-16 mx-auto mb-6 text-primary animate-float" />
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">Our Commitment to the Planet</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Sustainability isn't just a buzzword for us—it's the foundation of everything we do
          </p>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-gradient-to-br from-card to-muted/50 rounded-2xl animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <impact.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{impact.value}</div>
              <div className="text-lg font-semibold mb-2">{impact.label}</div>
              <p className="text-sm text-muted-foreground">{impact.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Initiatives */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Initiatives</h2>
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
                    className="rounded-2xl w-full h-80 object-cover hover-scale"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{initiative.title}</h3>
                  <p className="text-lg text-muted-foreground">{initiative.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {["B Corp Certified", "GOTS Certified", "Fair Trade", "Climate Neutral"].map((cert, index) => (
            <div 
              key={index}
              className="text-center p-6 border rounded-xl hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-sm">{cert}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every purchase you make contributes to a more sustainable future. Together, we can make a difference.
          </p>
        </div>
      </section>
    </div>
  );
}
