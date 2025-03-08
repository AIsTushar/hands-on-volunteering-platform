import CommunityHelpRequests from "../components/Home/CommunityHelpRequests";

import Hero from "../components/Home/Hero";
import UpcommingEvent from "../components/Home/UpcommingEvent";

function Home() {
  return (
    <div className="dark:bg-black dark:text-white">
      <Hero />
      <UpcommingEvent />
      <CommunityHelpRequests />
    </div>
  );
}

export default Home;
