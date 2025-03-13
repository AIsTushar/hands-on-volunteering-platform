import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

function Settings() {
  const user = useOutletContext();
  const { getUser, logout } = useAuthStore();

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [image, setImage] = useState(user.profileImage || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [causes, setCauses] = useState(user?.causes?.join(", "));
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the file for FormData
      setImage(URL.createObjectURL(selectedFile)); // Preview the image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("skills", skills);
    formData.append("causes", causes);
    if (file) {
      formData.append("profileImage", file); // Append image file if changed
    }

    try {
      setIsLoading(true);
      await axios.put("http://localhost:5000/api/profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(formData);
      toast.success(
        "Profile updated successfully || Image may take a few seconds to update",
      );
      getUser();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleSubmitpasswordChange = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.put("http://localhost:5000/api/profile/ChangePassword", {
        currentPassword,
        newPassword,
      });
      logout();
      toast.success("Password updated successfully");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error updating password");
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-md">
      <div className="bg-white px-16 py-8 pb-16">
        <h1 className="mb-6 text-4xl font-bold">Settings</h1>
        <form onSubmit={handleSubmit} className="rounded-lg bg-white">
          <div className="flex gap-6">
            <div className="mr-4 w-1/2">
              <div className="mb-4 w-full">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border p-2"
                />
              </div>
              <div className="mb-4 w-full">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border p-2"
                />
              </div>
            </div>
            {/* Image Input */}
            <div className="mb-4 w-1/2">
              <label className="mb-2 block text-gray-700">Profile Image</label>
              <div className="relative h-32 w-32">
                {/* Image preview */}
                <img
                  src={image || "/user/default.jpg"}
                  alt="Profile"
                  className="h-full w-full cursor-pointer rounded-lg border object-cover"
                  onClick={() => document.getElementById("fileInput").click()}
                />
                {/* Hidden file input */}
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full rounded-lg border p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Causes</label>
            <input
              type="text"
              value={causes}
              onChange={(e) => setCauses(e.target.value)}
              className="w-full rounded-lg border p-2"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <span className="block h-px bg-gray-300"></span>

      <div className="bg-white px-16 py-8 pt-16 pb-32">
        <h1 className="mb-6 text-4xl font-bold">Change Password</h1>
        <form
          onSubmit={handleSubmitpasswordChange}
          className="rounded-lg bg-white"
        >
          <div className="flex w-full gap-6">
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                placeholder="Enter your current password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>
            <div className="mb-4 w-1/2">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                placeholder="Enter your current password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
