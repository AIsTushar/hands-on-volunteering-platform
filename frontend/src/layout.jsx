import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen dark:bg-black">
      <Navbar />
      <main className="mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
