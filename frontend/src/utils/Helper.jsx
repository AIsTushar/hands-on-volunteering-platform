import axios from "axios";

import toast from "react-hot-toast";

// Format date and time
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    // weekday: "long",
    // year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Map urgency to color
export const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const handleJoinEvent = async (id) => {
  try {
    await axios.post(`http://localhost:5000/api/event/${id}/join`, null, {
      withCredentials: true,
    });
    toast.success("Joined event successfully");
  } catch (error) {
    console.error("Error joining event:", error);

    toast.error("Error joining event");
  }
};

export const handleLeaveEvent = async (id) => {
  try {
    await axios.post(`http://localhost:5000/api/event/${id}/leave`, null, {
      withCredentials: true,
    });

    toast.success("Left event successfully");
  } catch (error) {
    console.error("Error leaving event:", error);
    toast.error("Error leaving event");
  }
};
