import { Link } from "react-router-dom";
import RequestCard from "../cards/RequestCard";

function CommunityHelpRequests({ helpRequests }) {
  return (
    <div className="container mx-auto mt-32 bg-gray-50 px-16 pt-8 pb-24 dark:bg-gray-950">
      <div className="flex items-center justify-between py-8">
        <div>
          <h1 className="mb-4 text-4xl font-bold">Community Help Requests</h1>
          <p className="text-medium text-gray-500 dark:text-gray-400">
            People in your community who need assistance.
          </p>
        </div>
        <Link to="/help-requests" className="text-lg underline">
          more
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {helpRequests.map((request) => (
          <RequestCard request={request} key={request.id} />
        ))}
      </div>
    </div>
  );
}

export default CommunityHelpRequests;
