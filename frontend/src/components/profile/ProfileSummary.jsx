function ProfileSummary({ user }) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="h-full w-full rounded-full"
          />
        ) : (
          <span className="text-2xl text-gray-500">👤</span>
        )}
      </div>
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.email}</p>
      <div className="mt-4">
        <p className="text-gray-700">🕒 {user.totalVolunteerHours} Hours</p>
        <p className="text-gray-700">🌟 {user.impactPoints} Points</p>
      </div>
    </div>
  );
}

export default ProfileSummary;
