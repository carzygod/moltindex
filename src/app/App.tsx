import { useEffect } from "react";
import { AppStateProvider } from "./AppStateContext";
import { AppRoutes } from "./router";
import Layout from "./Layout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SiteDataProvider } from "./SiteDataContext";

const applyTheme = (mode: string) => {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (mode === "system") {
    root.classList.toggle("dark", systemDark);
  } else {
    root.classList.toggle("dark", mode === "dark");
  }
};

const App = () => {
  const [themeMode] = useLocalStorage<"light" | "dark" | "system">("molt-theme", "system");

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  return (
    <AppStateProvider>
      <SiteDataProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </SiteDataProvider>
    </AppStateProvider>
  );
};

export default App;
