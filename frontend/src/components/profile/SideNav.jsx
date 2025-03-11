import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function SideNav() {
  const location = useLocation();
  const isActive = (path) => path === location.pathname;

  return (
    <div className="fixed h-full w-64 bg-white p-6 shadow-lg">
      {/* Navigation Links */}
      <nav className="space-y-2">
        <Link
          to="/profile"
          className={`flex items-center ${isActive("/profile") ? "bg-gray-200" : ""} rounded-lg p-2 text-gray-700 hover:bg-gray-200`}
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </Link>
        <Link
          to="/profile/events"
          className={`flex items-center ${isActive("/profile/events") ? "bg-gray-200" : ""} rounded-lg p-2 text-gray-700 hover:bg-gray-200`}
        >
          <Calendar className="mr-3 h-5 w-5" />
          My Events
        </Link>
        <Link
          to="/profile/help-requests"
          className={`flex items-center ${isActive("/profile/help-requests") ? "bg-gray-200" : ""} rounded-lg p-2 text-gray-700 hover:bg-gray-200`}
        >
          <ClipboardList className="mr-3 h-5 w-5" />
          Help Requests
        </Link>
        <Link
          to="/profile/teams"
          className={`flex items-center ${isActive("/profile/teams") ? "bg-gray-200" : ""} rounded-lg p-2 text-gray-700 hover:bg-gray-200`}
        >
          <Users className="mr-3 h-5 w-5" />
          My Teams
        </Link>
        <Link
          to="/profile/impact-stats"
          className={`flex items-center ${isActive("/profile/impact-stats") ? "bg-gray-200" : ""} rounded-lg p-2 text-gray-700 hover:bg-gray-200`}
        >
          <BarChart2 className="mr-3 h-5 w-5" />
          Impact Stats
        </Link>
        <Link
          to="/profile/settings"
          className={`flex items-center ${isActive("/profile/settings") ? "bg-gray-200" : ""} rounded-lg p-2 text-gray-700 hover:bg-gray-200`}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
      </nav>
    </div>
  );
}

export default SideNav;
