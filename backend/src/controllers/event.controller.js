import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEvents = async (req, res) => {
  const { category, location } = req.query;

  try {
    const events = await prisma.event.findMany({
      where: {
        ...(category && { category }),
        ...(location && { location }),
      },
    });

    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching events", error });
  }
};

export const createEvent = async (req, res) => {
  const { title, description, dateTime, location, category } = req.body;
  const userId = req.userId;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        dateTime: new Date(dateTime),
        location,
        category,
        creatorId: userId,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Event created successfully", event });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating event", error });
  }
};

export const getEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: { select: { participants: true } },
      },
    });

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching event", error });
  }
};

export const joinEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.event.update({
      where: { id: parseInt(id) },
      data: { participants: { connect: { id: userId } } },
    });

    res.json({ success: true, message: "Successfully joined the event" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error joining event", error });
  }
};
