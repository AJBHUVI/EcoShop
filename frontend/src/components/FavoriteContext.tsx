import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Product {
  product_id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
}

interface FavoriteContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (product_id: number) => void;
  isFavorite: (product_id: number) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // ✅ Load favorites from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  // ✅ Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.product_id === product.product_id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavorites = (product_id: number) => {
    setFavorites((prev) => prev.filter((p) => p.product_id !== product_id));
  };

  const isFavorite = (product_id: number) =>
    favorites.some((p) => p.product_id === product_id);

  return (
    <FavoriteContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorites must be used within FavoriteProvider");
  return context;
};
