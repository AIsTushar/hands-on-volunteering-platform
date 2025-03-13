import { Link } from "react-router-dom";
import EventCard from "../cards/EventCard";

function UpcommingEvent({ events, onEventChange }) {
  return (
    <div className="container mx-auto px-16 pt-8">
      <div className="flex items-center justify-between py-8">
        <div>
          <h1 className="mb-4 text-4xl font-bold">Upcoming Events</h1>
          <p className="text-medium text-gray-500 dark:text-gray-400">
            Join us in our upcoming events and make an impact.
          </p>
        </div>
        <Link to="/events" className="text-lg underline">
          more
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event) => {
          return (
            <EventCard
              event={event}
              key={event.id}
              onEventChange={onEventChange}
            />
          );
        })}
      </div>
    </div>
  );
}

export default UpcommingEvent;
