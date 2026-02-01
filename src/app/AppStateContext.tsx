import { createContext, ReactNode, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type AppState = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  recentlyViewed: string[];
  recordVisit: (id: string) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useLocalStorage<string[]>("molt-favorites", []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>("molt-recent", []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  };

  const recordVisit = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((entry) => entry !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  return (
    <AppStateContext.Provider value={{ favorites, toggleFavorite, recentlyViewed, recordVisit }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};
