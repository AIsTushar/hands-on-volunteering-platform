import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Settings() {
  const user = useOutletContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(null);
  const [skills, setSkills] = useState(
    user.skills.map((s) => s.skill.name).join(", "),
  );
  const [causes, setCauses] = useState(
    user.causes.map((c) => c.cause.name).join(", "),
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Convert file to a preview URL
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., API call to update profile)
    console.log("Profile updated:", { name, email, image, skills, causes });
  };

  return (
    <div className="bg-white px-16 py-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <form onSubmit={handleSubmit} className="rounded-lg bg-white">
        <div className="flex">
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
                src={image || "https://via.placeholder.com/128"} // Placeholder image
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
          className="cursor-pointer rounded-lg border bg-black px-4 py-2 text-white uppercase transition-all duration-300 hover:border-black hover:bg-white hover:text-black active:scale-95"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Settings;
