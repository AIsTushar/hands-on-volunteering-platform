import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  PlusCircle,
} from "lucide-react";

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
      <div className="fixed h-full w-64 bg-white p-6 shadow-lg">
        {/* Profile Summary */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-full w-full rounded-full"
              />
            ) : (
              <span className="text-2xl text-gray-500">👤</span>
            )}
          </div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-4">
            <p className="text-gray-700">🕒 {user.totalVolunteerHours} Hours</p>
            <p className="text-gray-700">🌟 {user.impactPoints} Points</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <Calendar className="mr-3 h-5 w-5" />
            My Events
          </a>
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <ClipboardList className="mr-3 h-5 w-5" />
            Help Requests
          </a>
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <Users className="mr-3 h-5 w-5" />
            My Teams
          </a>
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            Impact Stats
          </a>
          <a
            href="#"
            className="flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
        </nav>

        {/* Call-to-Action Button */}
        <button className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Event
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's what's happening today.</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Volunteer Hours</p>
            <p className="text-2xl font-bold">{user.totalVolunteerHours}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-500">Impact Points</p>
            <p className="text-2xl font-bold">{user.impactPoints}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold">{user.events.length}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-gray-500">Active Help Requests</p>
            <p className="text-2xl font-bold">{user.helpRequests.length}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          {user.helpRequests.length > 0 ? (
            <ul className="space-y-4">
              {user.helpRequests.map((request) => (
                <li key={request.id} className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-gray-500">
                      Urgency: {request.urgency}
                    </p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600">
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
