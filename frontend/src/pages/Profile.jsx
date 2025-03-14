import DashBoard from "../components/profile/DashBoard";
import SideNav from "../components/profile/SideNav";

function Profile() {
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navigation Bar */}
      <SideNav />

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-8">
        <DashBoard user={user} />
      </div>
    </div>
  );
}

export default Profile;
