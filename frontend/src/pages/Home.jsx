import CommunityHelpRequests from "../components/Home/CommunityHelpRequests";
import axios from "axios";

import Hero from "../components/Home/Hero";
import UpcommingEvent from "../components/Home/UpcommingEvent";
import { useEffect, useState } from "react";

function Home() {
  axios.defaults.withCredentials = true;
  const [events, setEvents] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/home");

        setEvents(response.data.data.latestEvents);
        setHelpRequests(response.data.data.latestRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dark:bg-black dark:text-white">
      <Hero />
      <UpcommingEvent events={events} />
      <CommunityHelpRequests helpRequests={helpRequests} />
    </div>
  );
}

export default Home;
