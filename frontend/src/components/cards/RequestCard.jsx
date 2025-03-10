import { CircleUser, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

function RequestCard({ request }) {
  console.log(request);
  return (
    <div className="max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
      {/* Request Image */}
      <img
        src={request.imageUrl}
        alt="request Image"
        className="h-36 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4">
        {/* User Info */}
        <div className="mb-2 flex items-center gap-3">
          <img
            src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
            alt="user image"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">{request.user.name}</p>
            <p className="text-xs text-gray-500">2h ago</p>
          </div>
        </div>

        {/* Request Title */}
        <Link to={`/help-requests/${request.id}`}>
          <h2 className="mb-4 font-semibold text-gray-900 hover:underline dark:text-gray-100">
            {request.title}
          </h2>
        </Link>

        {/* Urgency Level */}

        <div className="flex flex-wrap items-center gap-5 dark:text-gray-400">
          {/* Registered Participants */}
          <div className="flex items-center justify-center py-2">
            <span className="rounded-lg bg-red-300 px-2 py-1 text-xs text-red-500">
              {request.urgency}
            </span>
          </div>

          {/* Maximum Participants */}
          <div className="flex items-center justify-center py-2">
            <Users className="h-4 w-4" />
            <span className="ml-1">{request._count.helpers}</span>
            <span className="ml-1 text-sm text-gray-500">joined</span>
          </div>

          {/* Spaces Left */}
          <div className="flex items-center justify-center py-2">
            <MessageCircle className="h-4 w-4" />
            <span className="ml-1">{request._count.comments}</span>
            <span className="ml-1 text-sm text-gray-500">comments</span>
          </div>
        </div>

        {/* Offer Help Button */}
        <div className="mt-2 flex justify-end border-t-[0.5px] border-gray-200 pt-3 dark:border-gray-700">
          <button className="cursor-pointer rounded-lg bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:bg-gray-900 active:scale-95">
            Offer Help
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestCard;
