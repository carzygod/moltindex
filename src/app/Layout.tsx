import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_50%),linear-gradient(180deg,_#020617,_#050b16)] text-slate-100">
      <Navbar themeMode={themeMode} setThemeMode={setThemeMode} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-12 pt-5 md:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
