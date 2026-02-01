import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: ReactNode;
  themeMode: "light" | "dark" | "system";
  setThemeMode: (value: "light" | "dark" | "system") => void;
}

const Layout = ({ children, themeMode, setThemeMode }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar themeMode={themeMode} setThemeMode={setThemeMode} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-12 pt-4 md:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
