import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// Create a new skill
router.post("/skills", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Skill name is required" });

    const existingSkill = await prisma.skill.findUnique({ where: { name } });
    if (existingSkill)
      return res.status(400).json({ error: "Skill already exists" });

    const skill = await prisma.skill.create({ data: { name } });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Error creating skill" });
  }
});

// Create a new cause
router.post("/causes", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Cause name is required" });

    const existingCause = await prisma.cause.findUnique({ where: { name } });
    if (existingCause)
      return res.status(400).json({ error: "Cause already exists" });

    const cause = await prisma.cause.create({ data: { name } });
    res.status(201).json(cause);
  } catch (error) {
    res.status(500).json({ error: "Error creating cause" });
  }
});

// Get all available skills
router.get("/skills", async (req, res) => {
  try {
    const skills = await prisma.skill.findMany();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: "Error fetching skills" });
  }
});

// Get all available causes
router.get("/causes", async (req, res) => {
  try {
    const causes = await prisma.cause.findMany();
    res.status(200).json(causes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching causes" });
  }
});

export default router;
