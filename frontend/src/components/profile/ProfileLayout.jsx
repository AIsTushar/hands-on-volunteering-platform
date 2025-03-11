import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import Navbar from "../Navbar";

function ProfileLayout() {
  const userData = {
    success: true,
    user: {
      id: 3,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      profileImage: null,
      createdAt: "2025-03-09T11:28:08.049Z",
      skills: [
        {
          id: 5,
          userId: 3,
          skillId: 4,
          skill: {
            id: 4,
            name: "Event Planning",
          },
        },
        {
          id: 6,
          userId: 3,
          skillId: 13,
          skill: {
            id: 13,
            name: "Waste Management",
          },
        },
      ],
      causes: [
        {
          id: 5,
          userId: 3,
          causeId: 1,
          cause: {
            id: 1,
            name: "Environmental Protection",
          },
        },
        {
          id: 6,
          userId: 3,
          causeId: 4,
          cause: {
            id: 4,
            name: "Recycling & Waste Management",
          },
        },
      ],
      events: [],
      volunteerHours: [],
      helpRequests: [
        {
          id: 5,
          title: "Community Park Cleanup - 5 More Volunteers Needed!",
          urgency: "high",
          createdAt: "2025-03-10T08:46:17.990Z",
        },
      ],
      totalVolunteerHours: 0,
      impactPoints: 0,
    },
  };

  const user = userData.user;

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
