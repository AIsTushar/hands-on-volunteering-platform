import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Get User Profile
export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, skills: true, causes: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
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
    if (name) updateData.name = name;

    if (skills) {
      const existingSkills = await prisma.skill.findMany({
        where: { name: { in: skills } },
      });

      const userSkills = existingSkills.map((skill) => ({
        userId,
        skillId: skill.id,
      }));

      await prisma.userSkill.deleteMany({ where: { userId } });
      await prisma.userSkill.createMany({ data: userSkills });
    }

    if (causes) {
      const existingCauses = await prisma.cause.findMany({
        where: { name: { in: causes } },
      });

      const userCauses = existingCauses.map((cause) => ({
        userId,
        causeId: cause.id,
      }));

      await prisma.userCause.deleteMany({ where: { userId } });
      await prisma.userCause.createMany({ data: userCauses });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
