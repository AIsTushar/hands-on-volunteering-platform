import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Clock,
  Users,
  UserPlus,
  Heart,
  Share2,
  Flag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import axios from "axios";
import { getUrgencyColor } from "../utils/Helper";

function HelpRequestDetails() {
  const [helpRequest, setHelpRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const id = useParams().id;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/help-requests/${id}`,
        );

        setHelpRequest(response.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Get time since posted
  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full pt-16 dark:bg-black">
      <div className="mx-auto max-w-5xl rounded-md border border-gray-300 bg-white px-16 py-8 dark:border-gray-800 dark:bg-black">
        {/* Back Button */}
        <div className="mb-6">
          <button className="flex items-center text-blue-600 transition-colors hover:text-blue-800">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <Link to="/help-requests">Back </Link>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Content - Left Column */}
          <div className="md:col-span-2">
            {/* Help Request Header */}
            <div className="mb-6">
              <div className="mb-3 flex items-center">
                <span
                  className={`rounded-full px-4 py-1 text-sm font-medium ${getUrgencyColor(helpRequest.urgency)}`}
                >
                  {helpRequest.urgency.charAt(0).toUpperCase() +
                    helpRequest.urgency.slice(1)}{" "}
                  Urgency
                </span>
                <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                  Posted {getTimeSince(helpRequest.createdAt)}
                </span>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
                {helpRequest.title}
              </h1>
            </div>

            {/* Help Request Image */}
            <div className="mb-6">
              <img
                src={helpRequest.imageUrl}
                alt="Elderly home visit"
                className="h-64 w-full rounded-lg object-cover shadow-md"
              />
            </div>

            {/* Description */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-black">
              <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                Description
              </h2>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {helpRequest.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border dark:border-gray-600 dark:bg-black">
              <div className="mb-6 flex items-center justify-between border-b border-gray-600 py-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-400">
                  Comments
                </h2>
                <span className="text-sm text-gray-500">
                  {helpRequest._count.comments} comments
                </span>
              </div>

              {helpRequest.comments.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {helpRequest.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start">
                      <img
                        src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                        alt="User"
                        className="mr-4 h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center justify-between gap-6">
                          <p className="mb-2 text-gray-800 dark:text-gray-300">
                            {comment.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <div className="mt-6 border-t border-gray-600 pt-6 dark:border-gray-600">
                <form className="flex flex-col">
                  <textarea
                    className="min-h-32 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Write a comment..."
                  ></textarea>
                  <button
                    className="mt-3 cursor-pointer self-end rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                    type="submit"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-span-1">
            {/* Action Card */}
            <div className="top-6 mb-6 rounded-lg bg-white p-6 shadow-md dark:border dark:border-gray-600 dark:bg-black">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  <span className="font-medium dark:text-white">Helpers</span>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
                  {helpRequest._count.helpers} helpers
                </span>
              </div>

              {/* Current Helpers */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Volunteers:
                </h3>
                <div className="space-y-3">
                  {helpRequest.helpers.map((helper) => (
                    <div key={helper.id} className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {helper.user.profileImage ? (
                          <img
                            src={helper.user.profileImage}
                            alt={helper.user.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          helper.user.name.charAt(0)
                        )}
                      </div>
                      <span className="text-gray-800 dark:text-gray-400">
                        {helper.user.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offer Help Button */}
              <button className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95 dark:border-white">
                <UserPlus className="mr-2 h-5 w-5" />
                Offer Help
              </button>

              {/* Additional Actions */}
              <div className="mt-4 flex justify-between">
                <button className="flex items-center p-2 text-gray-500 transition-colors hover:text-red-600">
                  <Heart className="mr-1 h-5 w-5" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="flex items-center p-2 text-gray-500 transition-colors hover:text-blue-600">
                  <Share2 className="mr-1 h-5 w-5" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex items-center p-2 text-gray-500 transition-colors hover:text-amber-600">
                  <Flag className="mr-1 h-5 w-5" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>

            {/* Requester Info */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:border dark:border-gray-600 dark:bg-black">
              <h3 className="mb-4 font-medium text-gray-800 dark:text-white">
                Posted by
              </h3>
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {helpRequest.user.profileImage ? (
                    <img
                      src={helpRequest.user.profileImage}
                      alt={helpRequest.user.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    helpRequest.user.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-300">
                    {helpRequest.user.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Joined Jan 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpRequestDetails;
