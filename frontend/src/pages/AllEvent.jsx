import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EventCard from "../components/cards/EventCard";
import axios from "axios";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  ChevronDown,
} from "lucide-react";

function AllEvent() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateTime-desc");
  const [categories, setCategories] = useState([]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  // Function to fetch events with filters
  const fetchEvents = async (filters = {}) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      // Add category filters (can be multiple)
      if (filters.category && filters.category.length > 0) {
        // Convert IDs to strings before appending
        filters.category.forEach((cat) =>
          params.append("category", cat.toString()),
        );
      }

      // Add other filters
      if (filters.location) params.set("location", filters.location);
      if (filters.date) params.set("date", filters.date);
      if (filters.search) params.set("search", filters.search);
      if (filters.page) params.set("page", filters.page);
      if (filters.limit) params.set("limit", filters.limit);

      // Add sorting
      if (filters.sort) {
        const [sortBy, sortOrder] = filters.sort.split("-");
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
      }

      // Fetch categories
      const categoryResponse = await axios.get(
        "http://localhost:5000/api/additional/allCategories",
      );

      setCategories(categoryResponse.data.data);

      // Fetch events with filters
      const response = await axios.get(
        `http://localhost:5000/api/event?${params.toString()}`,
      );

      // Update state with response data
      setEvents(response.data.events || []);
      setPagination(
        response.data.pagination || {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 0,
        },
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchEvents({
      page: 1,
      limit: 12,
      sort: sortOption,
    });
  }, [sortOption]);

  // Apply filters when user clicks the Apply Filters button
  const handleApplyFilters = () => {
    fetchEvents({
      category: categoryFilter,
      location: locationFilter,
      date: dateFilter,
      search: searchQuery,
      page: 1, // Reset to first page when applying new filters
      limit: pagination.limit,
      sort: sortOption,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setCategoryFilter([]);
    setLocationFilter("");
    setDateFilter("");
    setSearchQuery("");

    // Fetch events without filters
    fetchEvents({
      page: 1,
      limit: pagination.limit,
      sort: sortOption,
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    fetchEvents({
      category: categoryFilter,
      location: locationFilter,
      date: dateFilter,
      search: searchQuery,
      page: newPage,
      limit: pagination.limit,
      sort: sortOption,
    });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    fetchEvents({
      category: categoryFilter,
      location: locationFilter,
      date: dateFilter,
      search: searchQuery,
      page: pagination.page,
      limit: pagination.limit,
      sort: newSortOption,
    });
  };

  // Handle search
  const handleSearch = () => {
    fetchEvents({
      category: categoryFilter,
      location: locationFilter,
      date: dateFilter,
      search: searchQuery,
      page: 1, // Reset to first page when searching
      limit: pagination.limit,
      sort: sortOption,
    });
  };

  // Fixed toggleCategory function to ensure consistent ID handling
  const toggleCategory = (categoryId) => {
    // Parse the ID to ensure it's a number
    const id = parseInt(categoryId);

    if (categoryFilter.includes(id)) {
      setCategoryFilter(categoryFilter.filter((catId) => catId !== id));
    } else {
      setCategoryFilter([...categoryFilter, id]);
    }
  };

  if (loading && events.length === 0) {
    return <Loading />;
  }

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Previous
      </button>,
    );

    // Page buttons
    const pagesToShow = [];

    // Always show first page
    pagesToShow.push(1);

    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed before range
    if (rangeStart > 2) {
      pagesToShow.push("...");
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pagesToShow.push(i);
    }

    // Add ellipsis if needed after range
    if (rangeEnd < totalPages - 1) {
      pagesToShow.push("...");
    }

    // Add last page if there is more than one page
    if (totalPages > 1) {
      pagesToShow.push(totalPages);
    }

    // Add page buttons
    pagesToShow.forEach((page, index) => {
      if (page === "...") {
        buttons.push(
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>,
        );
      } else {
        buttons.push(
          <button
            key={`page-${page}`}
            onClick={() => handlePageChange(page)}
            className={`rounded-md ${page === currentPage ? "bg-indigo-600 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"} px-3 py-2`}
          >
            {page}
          </button>,
        );
      }
    });

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Next
      </button>,
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-white px-16 dark:bg-black dark:text-white">
      {/* Hero section */}
      <div className="py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
            Discover Volunteer Events
          </h1>
          <p className="max-w-2xl text-xl text-gray-900 opacity-90 dark:text-gray-300">
            Find meaningful opportunities to make a difference in your community
          </p>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="container mx-auto px-4 py-8">
        <div className="-mt-12 mb-8 rounded-xl bg-white p-6 shadow-md dark:border dark:border-gray-700 dark:bg-black">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-gray-500 focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-medium transition-colors duration-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Filter size={20} />
              Filters
              <ChevronDown
                size={16}
                className={`transform transition-transform ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={handleSearch}
              className="rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-gray-700"
            >
              Find Events
            </button>
          </div>

          {filterOpen && (
            <div className="mt-6 border-t border-gray-200 p-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Category filter */}
                <div>
                  <h3 className="mb-3 font-medium text-gray-900 dark:text-gray-300">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={categoryFilter.includes(
                            parseInt(category.id),
                          )}
                          onChange={() => toggleCategory(category.id)}
                          className="mr-2 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location filter */}
                <div>
                  <h3 className="mb-3 font-medium text-gray-900 dark:text-gray-300">
                    Location
                  </h3>
                  <input
                    type="text"
                    placeholder="Enter city or area"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Date filter */}
                <div>
                  <h3 className="mb-3 font-medium text-gray-900 dark:text-gray-300">
                    Date
                  </h3>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="mr-4 cursor-pointer font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Clear All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {pagination.total} Events Available
            </h2>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600 dark:text-gray-300">
                Sort by:
              </span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="rounded-lg border border-gray-300 bg-white p-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 dark:border-gray-700 dark:bg-black"
              >
                <option value="dateTime-desc">Date (Newest)</option>
                <option value="dateTime-asc">Date (Oldest)</option>
                <option value="participantsJoined-desc">Most Popular</option>
                <option value="spacesLeft-asc">Limited Spots</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Empty state */}
        {!loading && events.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <Search size={36} className="text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              No events found
            </h3>
            <p className="mx-auto max-w-md text-gray-600">
              We couldn't find any events matching your criteria. Try adjusting
              your filters or search terms.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && events.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              {renderPaginationButtons()}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllEvent;
