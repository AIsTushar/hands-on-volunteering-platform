import { useEffect, useState } from "react";
import axios from "axios";
import { MoreVertical, Edit, Trash, CirclePlus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUrgencyColor } from "../../utils/Helper";

function MyHelpRequests() {
  const [requests, setRequests] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/help-requests/user/created",
        );
        setRequests(response.data.helpRequests);
      } catch (error) {
        console.error("Error fetching help requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // Handle delete event
  const handleDelete = async (requestId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/help-requests/${requestId}`,
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId),
      );
      toast.success("Help-request deleted successfully");
    } catch (error) {
      console.error("Error deleting help request:", error);
      toast.error("Error deleting Help Request");
    }
  };

  // Toggle dropdown for a specific event
  const toggleDropdown = (requestId) => {
    setOpenDropdownId(openDropdownId === requestId ? null : requestId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter requests based on activeFilter
  const filteredRequests =
    activeFilter === "all"
      ? requests
      : requests.filter((request) => request.urgency === activeFilter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex h-16 items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">My Help-Requests</h1>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Filter:</span>

          {["all", "high", "medium", "low"].map((level) => (
            <button
              key={level}
              className={`cursor-pointer rounded-full border-[1px] px-3 py-1 text-sm font-medium ${
                activeFilter === level
                  ? getUrgencyColor(level) || "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setActiveFilter(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Helpers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Urgency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr
                key={request.id}
                className="transition-colors hover:bg-gray-50"
              >
                {/* Image */}
                <td className="px-3 py-1">
                  <img
                    src={request.imageUrl}
                    alt={request.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>

                {/* Title */}
                <td className="px-6 py-4">
                  <Link to={`/help-requests/${request.id}`} className="text-md">
                    {request.title}
                  </Link>
                </td>

                {/* Helpers */}
                <td className="px-6 py-4">
                  <p className="text-md">{request._count?.helpers || 0}</p>
                </td>

                {/* Urgency */}
                <td className="px-6 py-4">
                  <span
                    className={`rounded-lg px-2 py-1 text-xs uppercase ${getUrgencyColor(request.urgency)}`}
                  >
                    {request.urgency}
                  </span>
                </td>

                {/* Actions (Edit/Delete) */}
                <td className="px-6 py-4">
                  <div className="dropdown-container relative">
                    <button
                      onClick={() => toggleDropdown(request.id)}
                      className="rounded-full p-2 hover:bg-gray-200"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                    {openDropdownId === request.id && (
                      <div className="absolute -top-12 -left-22 z-10 mt-2 w-24 rounded-lg border border-gray-200 bg-white shadow-lg">
                        <Link
                          to={`/profile/help-requests/edit/${request.id}`}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <Link to="/profile/help-requests/new">
          <button className="mt-4 flex cursor-pointer items-center rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95">
            <CirclePlus className="mr-2 h-4 w-4" />
            Add Request
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MyHelpRequests;
