import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Image, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

function CreateNewEvent() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/additional/allCategories",
        );
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Append form data
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("dateTime", startDate.toISOString());
    formData.append("location", data.location);
    formData.append("maxParticipants", data.maxParticipants);
    formData.append("categoryId", data.categoryId);

    // Append the image file using the separately maintained selectedFile state
    if (selectedFile) {
      formData.append("eventImage", selectedFile);
    } else {
      console.error("No image found in form data!");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/event",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Event created:", response.data);
      toast.success("Event created successfully");
      navigate("/profile/events");
    } catch (error) {
      toast.error("Error creating event");
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-16 overflow-hidden rounded-md">
      <div className="bg-white px-16 py-8 pb-16">
        <h1 className="mb-6 text-4xl font-bold">Create New Event</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows="4"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <div className="relative mt-1">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setValue("dateTime", date.toISOString());
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="block w-full rounded-md border border-gray-300 p-2"
              />
              <Calendar className="pointer-events-none absolute top-2.5 right-3 text-gray-400" />
            </div>
            {errors.dateTime && (
              <p className="text-sm text-red-500">{errors.dateTime.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="block w-full rounded-md border border-gray-300 p-2"
              />
              <MapPin className="absolute top-2.5 right-3 text-gray-400" />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Participants
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                {...register("maxParticipants", {
                  required: "Max participants is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                className="block w-full rounded-md border border-gray-300 p-2"
              />
              <Users className="absolute top-2.5 right-3 text-gray-400" />
            </div>
            {errors.maxParticipants && (
              <p className="text-sm text-red-500">
                {errors.maxParticipants.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative mt-1">
              <select
                {...register("categoryId", {
                  required: "Category is required",
                })}
                className="block w-full appearance-none rounded-md border border-gray-300 p-2"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-2.5 right-3 text-gray-400" />
            </div>
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Event Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="eventImage"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="eventImage"
                className="cursor-pointer rounded-md border border-gray-300 p-2"
              >
                <Image className="h-5 w-5 text-gray-400" />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Event Preview"
                  className="ml-4 h-16 w-16 rounded-md object-cover"
                />
              )}
            </div>
            {!selectedFile && (
              <p className="mt-1 text-sm text-gray-500">
                Please select an event image
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNewEvent;
