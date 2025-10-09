import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

export const ProductCard = ({ id, name, price, image, category, rating = 4.5 }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover-tilt border-border/50 bg-card">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <Button size="sm" className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
              <Button size="sm" variant="secondary">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
              {category}
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="text-secondary mr-1">★</span>
            {rating}
          </div>
        </div>
      </div>
    </Card>
  );
};
