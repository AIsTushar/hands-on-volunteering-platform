import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import Navbar from "../Navbar";
import { useAuthStore } from "../../store/authStore";

function ProfileLayout() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-22">
        {/* Sticky Sidebar */}
        <aside className="fixed left-0 h-screen w-64 shadow-lg">
          <SideNav />
        </aside>

        {/* Scrollable Content */}
        <main className="ml-64 flex-1 overflow-auto rounded-md bg-gray-100 px-24 pt-16">
          <Outlet context={user} />
        </main>
      </div>
    </div>
  );
}

export default ProfileLayout;
