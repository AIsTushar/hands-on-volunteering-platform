import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  ArrowLeft,
  Share2,
  Award,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

function EventDetails() {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const id = useParams().id;
  const isParticipant = event.participants?.some(
    (participant) => participant.id === user?.id,
  );

  // Fetch event data
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/event/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  console.log(event);

  const handleJoinEvent = async () => {
    try {
      await axios.post(`http://localhost:5000/api/event/${id}/join`, null, {
        withCredentials: true,
      });
      fetchEvents();
      toast.success("Joined event successfully");
    } catch (error) {
      console.error("Error joining event:", error);

      toast.error("Error joining event");
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await axios.post(`http://localhost:5000/api/event/${id}/leave`, null, {
        withCredentials: true,
      });
      fetchEvents();
      toast.success("Left event successfully");
    } catch (error) {
      console.error("Error leaving event:", error);
      toast.error("Error leaving event");
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFutureDate = (dateString) => {
    const today = new Date();
    const futureDate = new Date(dateString);

    const diffTime = futureDate - today;

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full pt-16 dark:bg-black">
      <div className="mx-auto max-w-5xl rounded-md border border-gray-300 bg-white px-16 py-8 dark:border-gray-800 dark:bg-black">
        {/* Back Button */}
        <div className="mb-6">
          <button className="flex cursor-pointer items-center text-blue-600 transition-colors hover:text-blue-800">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Event Status Banner */}
        <div className="mb-6 flex w-full items-center justify-between rounded-lg bg-green-100 p-3 dark:bg-gray-700">
          <div className="flex items-center">
            <span
              className={`mr-3 rounded-full ${event.isAvailable ? "bg-green-500" : "bg-red-500"} px-3 py-1 text-sm font-semibold text-white`}
            >
              {event.isAvailable ? "Available" : "Not Available"}
            </span>
            <span className="font-medium text-green-800 dark:text-white">
              {event.isAvailable ? "Registration Open" : "Registration Closed"}
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="rounded-full bg-white p-2 text-gray-600 transition-colors hover:text-blue-600">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-800">
              {event.category.name}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              <span>{formatDate(event.dateTime)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              <span>{formatTime(event.dateTime)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-blue-600" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Event Image */}
        <div className="mb-8">
          <img
            src={event.eventImage}
            alt="Waste Management Seminar"
            className="h-64 w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - Event Description */}
          <div className="md:col-span-2">
            {/* About Event Section */}
            <div className="mb-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:bg-black dark:text-white">
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-400">
                About This Event
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                {event.description}
              </p>
              <div className="mt-6 flex items-center text-blue-600">
                <Award className="mr-2 h-5 w-5" />
                <span className="font-medium">
                  Certificate of participation included
                </span>
              </div>
            </div>

            {/* Organizer Section */}
            <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:bg-black dark:text-white">
              <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-400">
                Organizer
              </h2>
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {event.creator.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-500">
                    {event.creator.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Card */}
          <div className="md:col-span-1">
            <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:bg-black dark:text-white">
              <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-400">
                Registration
              </h2>

              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Participants
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-600">
                      {event.participantsJoined}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{event.maxParticipants}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Spaces Left
                  </span>
                  <span className="font-semibold text-green-600">
                    {event.spacesLeft}
                  </span>
                </div>
              </div>

              {/* Registration Deadline */}
              <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-gray-800 dark:text-white">
                {event.isAvailable ? (
                  <div className="flex items-center text-blue-800">
                    <Clock className="mr-2 h-5 w-5" />
                    <span className="font-medium">
                      Closes in {getFutureDate(event.dateTime)} days
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-red-500 capitalize">
                    closed
                  </span>
                )}
              </div>

              {/* CTA Button */}
              {!isAuthenticated ? (
                <p>You need to be logged in to join this event</p>
              ) : event.isAvailable && event.creator.id !== user?.id ? (
                isParticipant ? (
                  <button
                    onClick={handleLeaveEvent}
                    className="cursor-pointer rounded-lg border bg-red-600 px-4 py-2 text-white uppercase transition-all duration-300 hover:border-red-600 hover:bg-white hover:text-red-600 active:scale-95 dark:border-white"
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    onClick={handleJoinEvent}
                    className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95 dark:border-white"
                  >
                    Join Us
                  </button>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
