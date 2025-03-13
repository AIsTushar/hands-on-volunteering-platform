import { useEffect, useState } from "react";
import axios from "axios";
import { MoreVertical, Edit, Trash, CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/event/user/created",
        );
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Handle delete event
  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/event/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
  };

  // Check if the event is available based on the current time
  const isEventAvailable = (eventDateTime) => {
    const now = new Date();
    const eventDate = new Date(eventDateTime);
    return now < eventDate;
  };

  // Toggle dropdown for a specific event
  const toggleDropdown = (eventId) => {
    setOpenDropdownId(openDropdownId === eventId ? null : eventId);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-2xl font-bold">My Events</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="transition-colors hover:bg-gray-50">
                {/* Event Image */}
                <td className="px-3 py-1">
                  <img
                    src={event.eventImage}
                    alt={event.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                </td>

                {/* Event Category */}
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
                    {event.category.name}
                  </span>
                </td>

                {/* Event Title */}
                <td className="px-6 py-4">
                  <p className="text-md">{event.title}</p>
                </td>

                {/* Event Availability */}
                <td className="px-6 py-4">
                  {isEventAvailable(event.dateTime) ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                      Available
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-800">
                      Expired
                    </span>
                  )}
                </td>

                {/* Actions (Edit/Delete) */}
                <td className="px-6 py-4">
                  <div className="dropdown-container relative">
                    <button
                      onClick={() => toggleDropdown(event.id)}
                      className="rounded-full p-2 hover:bg-gray-200"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                    {openDropdownId === event.id && (
                      <div className="absolute -top-12 -left-22 z-10 mt-2 w-24 rounded-lg border border-gray-200 bg-white shadow-lg">
                        <Link
                          to={`/profile/events/edit-event/${event.id}`}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
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
        <Link to="/profile/events/new">
          <button className="mt-4 flex cursor-pointer items-center rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95">
            <CirclePlus className="mr-2 h-4 w-4" />
            Add Event
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MyEvents;
