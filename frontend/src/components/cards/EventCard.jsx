import { Calendar, CircleUser, Clock, MapPin, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/Helper";

function EventCard({ event }) {
  console.log(event);
  return (
    <div className="container mx-auto flex justify-center md:justify-start">
      <div className="my-4 max-w-sm overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="rounded-lg bg-white dark:bg-gray-800">
          <div className="relative">
            <div
              className={`absolute top-2 right-2 rounded-lg ${event.isAvailable ? "bg-green-500" : "bg-red-500"} px-3 py-1`}
            >
              <span className="font-medium text-white">
                {event.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="dark:bg-opacity-75 absolute bottom-2 left-2 rounded-lg bg-white/75 px-3 py-1 dark:bg-black">
              <span className="font-medium">{event.category} </span>
            </div>
            <img src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
          </div>
          <div className="px-5 pt-3 pb-5">
            {/* Event Title */}
            <div className="h-16 w-full">
              <Link to={`/events/${event.id}`}>
                <h1 className="mb-1 text-xl font-bold text-gray-700 hover:underline dark:text-gray-200">
                  {event.title}
                </h1>
              </Link>
            </div>

            {/* Event Details */}
            <div className="mt-2 flex flex-wrap items-center justify-between dark:text-gray-400">
              <div className="flex items-center justify-center py-2">
                <Calendar className="h-4 w-4" />
                <span className="ml-1">{formatDate(event.dateTime)}</span>
              </div>
              <div className="flex items-center justify-center py-2">
                <MapPin className="h-4 w-4" />
                <span className="ml-1">
                  {event.location.split(",")[0].trim()}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex flex-wrap items-center gap-5 dark:text-gray-400">
              {/* Registered Participants */}
              <div className="flex items-center justify-center py-2">
                <User className="h-4 w-4" />
                <span className="ml-1">{event.participantsJoined}</span>
                <span className="ml-1 text-sm text-gray-500">joined</span>
              </div>

              {/* Maximum Participants */}
              <div className="flex items-center justify-center py-2">
                <Users className="h-4 w-4" />
                <span className="ml-1">{event.maxParticipants}</span>
                <span className="ml-1 text-sm text-gray-500">max</span>
              </div>

              {/* Spaces Left */}
              <div className="flex items-center justify-center py-2">
                <CircleUser className="h-4 w-4" />
                <span className="ml-1">{event.spacesLeft}</span>
                <span className="ml-1 text-sm text-gray-500">left</span>
              </div>
            </div>

            <div className="mt-2 flex justify-end border-t-[0.5px] border-gray-200 pt-3 dark:border-gray-700">
              <button className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95">
                Join Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
