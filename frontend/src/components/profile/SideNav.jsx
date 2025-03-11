import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

function SideNav() {
  return (
    <div className="fixed h-full w-64 bg-white p-6 shadow-lg">
      {/* Navigation Links */}
      <nav className="space-y-2">
        <Link
          to="/profile"
          className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </Link>
        <Link
          to="/profile/events"
          className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <Calendar className="mr-3 h-5 w-5" />
          My Events
        </Link>
        <Link
          to="/profile/help-requests"
          className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <ClipboardList className="mr-3 h-5 w-5" />
          Help Requests
        </Link>
        <Link
          to="/profile/teams"
          className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <Users className="mr-3 h-5 w-5" />
          My Teams
        </Link>
        <Link
          to="/profile/impact-stats"
          className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <BarChart2 className="mr-3 h-5 w-5" />
          Impact Stats
        </Link>
        <Link
          to="/profile/settings"
          className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
      </nav>
    </div>
  );
}

export default SideNav;
