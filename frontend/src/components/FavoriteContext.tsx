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
  favorites: Product[]; // public array interface (compat)
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (product_id: number) => void;
  isFavorite: (product_id: number) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);
export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favMap, setFavMap] = useState<Record<number, Product>>({});

  // Load favorites from DB on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user_id = sessionStorage.getItem("user_id");
        if (!user_id) return;

        const res = await axios.get(`/favorites/${user_id}`);
        const arr: Product[] = Array.isArray(res.data) ? res.data : [];

        const map: Record<number, Product> = {};
        arr.forEach((p) => {
          const id = Number(p.product_id);
          map[id] = { ...p, product_id: id };
        });

        setFavMap(map);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    fetchFavorites();
  }, []);

  // convert map -> array for consumers
  const favoritesArray = Object.values(favMap);

  // Add to favorites (local + DB)
  const addToFavorites = (product: Product) => {
    const id = Number(product.product_id);
    setFavMap((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: { ...product, product_id: id } };
    });

    // Persist to DB (fire-and-forget)
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) return;
    axios.post(`/favorites`, { user_id, product_id: id }).catch((err) => {
      console.error("Failed to add favorite to DB", err);
    });
  };

  // Remove from favorites (local + DB)
  const removeFromFavorites = (product_id: number) => {
    const id = Number(product_id);
    setFavMap((prev) => {
      if (!prev[id]) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) return;
    axios.delete(`/favorites/${id}`, { data: { user_id } }).catch((err) => {
      console.error("Failed to remove favorite from DB", err);
    });
  };

  const isFavorite = (product_id: number) => {
    const id = Number(product_id);
    return !!favMap[id];
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites: favoritesArray,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoriteContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoriteProvider");
  return ctx;
};
