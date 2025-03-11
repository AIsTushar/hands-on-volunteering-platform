import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../utils/cloudinaryConfig.js";

const prisma = new PrismaClient();

// Get User Profile
export const getProfile = async (req, res) => {
  const userId = req.userId;
  console.log(userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        createdAt: true,
        skills: true, // Now a simple array of strings
        causes: true, // Now a simple array of strings
        events: {
          select: {
            id: true,
            title: true,
            dateTime: true,
            location: true,
            category: true,
          },
        },
        volunteerHours: {
          select: {
            hours: true,
            isVerified: true,
            date: true,
            event: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
        helpRequests: {
          select: {
            id: true,
            title: true,
            urgency: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Calculate total volunteer hours
    const totalHours = user.volunteerHours.reduce((sum, record) => {
      return sum + (record.isVerified ? record.hours : 0);
    }, 0);

    // Calculate impact points (5 points per verified hour)
    const impactPoints = Math.floor(totalHours * 5);

    // Add computed fields to response
    const userWithStats = {
      ...user,
      totalVolunteerHours: totalHours,
      impactPoints: impactPoints,
    };

    res.json({ success: true, user: userWithStats });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, skills, causes } = req.body;
    const userId = req.userId;
    let updateData = {};

    // ✅ Update Name
    if (name) updateData.name = name;

    // ✅ FIX: Handle Image Upload using Cloudinary Upload Stream
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "user_profiles",
            public_id: `profile_${userId}`,
            overwrite: true,
            transformation: [{ width: 500, height: 500, crop: "fill" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updateData.profileImage = await uploadPromise;
    }

    // ✅ FIX: Handle Skills & Causes Correctly
    if (skills) {
      try {
        updateData.skills = JSON.parse(skills); // Parse if sent as JSON string
      } catch (e) {
        updateData.skills = skills.split(",").map((s) => s.trim()); // Convert comma-separated string to array
      }
    }

    if (causes) {
      try {
        updateData.causes = JSON.parse(causes);
      } catch (e) {
        updateData.causes = causes.split(",").map((c) => c.trim());
      }
    }

    // ✅ Update user in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Change Password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

// Delete Account
export const deleteAccount = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });

    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // Clear token
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to delete account", error });
  }
};
