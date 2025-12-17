import Footer from "@/components/common/customer/Footer";
import Header from "@/components/common/customer/Header";
import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-8xl">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
