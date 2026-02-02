import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchCategories } from "@/services/api";
import { Category } from "@/types/models";

interface CategoriesData {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CategoriesDataContext = createContext<CategoriesData | undefined>(undefined);

export const CategoriesDataProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message || "Unable to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const refresh = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  return (
    <CategoriesDataContext.Provider value={{ categories, loading, error, refresh }}>
      {children}
    </CategoriesDataContext.Provider>
  );
};

export const useCategoriesData = () => {
  const context = useContext(CategoriesDataContext);
  if (!context) {
    throw new Error("useCategoriesData must be used within CategoriesDataProvider");
  }
  return context;
};
