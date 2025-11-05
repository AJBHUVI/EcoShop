import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

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

  // Load favorites from DB
  useEffect(() => {
    const fetchFavorites = async () => {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) return;
      try {
        const res = await axios.get(`/favorites/${user_id}`);
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };
    fetchFavorites();
  }, []);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.product_id === product.product_id)) return prev;
      return [...prev, product];
    });

    // ✅ Add to DB
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) return;
    axios.post(`/favorites`, { user_id, product_id: product.product_id })
      .catch((err) => console.error("Failed to add favorite to DB", err));
  };

  const removeFromFavorites = (product_id: number) => {
    setFavorites((prev) => prev.filter((p) => p.product_id !== product_id));

    // ✅ Remove from DB
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) return;
    axios.delete(`/favorites/${product_id}`, { data: { user_id } })
      .catch((err) => console.error("Failed to remove favorite from DB", err));
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
