import { Link } from "react-router-dom";
import RequestCard from "../cards/RequestCard";

function CommunityHelpRequests() {
  return (
    <div className="container mx-auto mt-32 px-16">
      <div className="flex items-center justify-between py-8">
        <div>
          <h1 className="mb-4 text-4xl font-bold">Community Help Requests</h1>
          <p className="text-medium text-gray-500">
            People in your community who need assistance.
          </p>
        </div>
        <Link to="/" className="text-lg underline">
          more
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
      </div>
    </div>
  );
}

export default CommunityHelpRequests;
