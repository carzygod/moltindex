import { Route, Routes } from "react-router-dom";
import AboutPage from "@/pages/About";
import CategoriesPage from "@/pages/Categories";
import CategoryDetailPage from "@/pages/CategoryDetail";
import FavoritesPage from "@/pages/Favorites";
import HomePage from "@/pages/Home";
import NewsPage from "@/pages/News";
import NotFoundPage from "@/pages/NotFound";
import SubmitPage from "@/pages/Submit";
import ToolDetailPage from "@/pages/ToolDetail";

export const AppRoutes = () => (
  <Routes>
    <Route index element={<HomePage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
    <Route path="/tools/:toolId" element={<ToolDetailPage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route path="/submit" element={<SubmitPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
