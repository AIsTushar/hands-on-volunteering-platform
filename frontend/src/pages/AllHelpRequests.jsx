import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Users,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { getUrgencyColor } from "../utils/Helper";
import RequestCard from "../components/cards/RequestCard";

function AllHelpRequests() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    // This would be your actual API call
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/help-requests",
        );
        const data = response.data;
        setHelpRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error("Error fetching help requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filtering
  useEffect(() => {
    let result = [...helpRequests];

    // Apply filter
    if (activeFilter !== "all") {
      result = result.filter((request) => request.urgency === activeFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (request) =>
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query),
      );
    }

    setFilteredRequests(result);
  }, [activeFilter, searchQuery, helpRequests]);

  return (
    <div className="min-h-screen bg-white px-16 pb-12 dark:bg-black dark:text-white">
      {/* Head section */}
      <div className="py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
            Help Requests
          </h1>
          <p className="max-w-2xl text-lg text-gray-800 opacity-90 dark:text-gray-300">
            Find opportunities to make a difference in your community. Browse
            through requests for help and volunteer where your skills are needed
            most.
          </p>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="container mx-auto mt-8 px-4">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:border dark:border-gray-600 dark:bg-black">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search help requests..."
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Filter:</span>

              <button
                className={`rounded-full px-3 py-1 text-sm font-medium ${activeFilter === "all" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>

              <button
                className={`rounded-full px-3 py-1 text-sm font-medium ${activeFilter === "high" ? getUrgencyColor("high") : "bg-gray-100 text-gray-800"}`}
                onClick={() => setActiveFilter("high")}
              >
                Urgent
              </button>

              <button
                className={`rounded-full px-3 py-1 text-sm font-medium ${activeFilter === "medium" ? getUrgencyColor("medium") : "bg-gray-100 text-gray-800"}`}
                onClick={() => setActiveFilter("medium")}
              >
                Medium
              </button>

              <button
                className={`rounded-full px-3 py-1 text-sm font-medium ${activeFilter === "low" ? getUrgencyColor("low") : "bg-gray-100 text-gray-800"}`}
                onClick={() => setActiveFilter("low")}
              >
                Low
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold">
              No help requests found
            </h3>
            <p className="mb-4 text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredRequests.map((request) => (
              <RequestCard request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllHelpRequests;
