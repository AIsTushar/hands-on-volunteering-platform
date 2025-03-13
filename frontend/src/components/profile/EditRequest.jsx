import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Image, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

function EditRequest() {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch the existing request data
  useEffect(() => {
    if (!id) return;
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/help-requests/${Number(id)}`,
        );
        const request = response.data;
        setValue("title", request.title);
        setValue("description", request.description);
        setValue("imageUrl", request.imageUrl);
        setValue("urgency", request.urgency);
      } catch (error) {
        console.error("Error fetching request:", error);
        toast.error("Failed to load request data");
      }
    };
    fetchRequest();
  }, [id, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/help-requests/${id}`,
        {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          urgency: data.urgency,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Help request updated:", response.data);
      toast.success("Help request updated successfully");
      navigate("/profile/help-requests"); // Redirect to help requests page
    } catch (error) {
      toast.error("Error updating help request");
      console.error("Error updating help request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-16 overflow-hidden rounded-md">
      <div className="bg-white px-16 py-8 pb-16">
        <h1 className="mb-6 text-4xl font-bold">Edit Help Request</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
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
              Description
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

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                {...register("imageUrl", {
                  required: "Image URL is required",
                })}
                className="block w-full rounded-md border border-gray-300 p-2"
              />
              <Image className="pointer-events-none absolute top-2.5 right-3 text-gray-400" />
            </div>
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Urgency
            </label>
            <div className="relative mt-1">
              <select
                {...register("urgency", {
                  required: "Urgency is required",
                })}
                className="block w-full appearance-none rounded-md border border-gray-300 p-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <AlertCircle className="pointer-events-none absolute top-2.5 right-3 text-gray-400" />
            </div>
            {errors.urgency && (
              <p className="text-sm text-red-500">{errors.urgency.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex cursor-pointer items-center rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95"
            >
              {isSubmitting ? "Updating..." : "Update Help Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRequest;
