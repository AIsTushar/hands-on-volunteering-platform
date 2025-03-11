import { useOutletContext } from "react-router-dom";
import ProfileSummary from "./ProfileSummary";

function DashBoard() {
  const user = useOutletContext();
  console.log(user);
  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's what's happening today.</p>
      </div>

      <ProfileSummary user={user} />

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
  );
}

export default DashBoard;
