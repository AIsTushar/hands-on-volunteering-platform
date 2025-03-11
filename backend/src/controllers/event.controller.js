import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Get all events with filters
// export const getEvents = async (req, res) => {
//   const { category, location } = req.query;
//   try {
//     const events = await prisma.event.findMany({
//       where: {
//         ...(category && { category }),
//         ...(location && { location }),
//       },
//       include: {
//         _count: { select: { participants: true } },
//       },
//     });

//     // Add availability information for each event
//     const eventsWithAvailability = events.map((event) => {
//       const participantsJoined = event._count.participants;
//       const spacesLeft = event.maxParticipants - participantsJoined;
//       const isAvailable =
//         spacesLeft > 0 && new Date(event.dateTime) > new Date();

//       return {
//         ...event,
//         participantsJoined,
//         spacesLeft,
//         isAvailable,
//       };
//     });

//     res.json(eventsWithAvailability);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching events", error });
//   }
// };

export const getEvents = async (req, res) => {
  const {
    category,
    location,
    search,
    date,
    sortBy = "dateTime",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = req.query;

  try {
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build the where clause for filtering
    const where = {
      // Category filter - handle multiple categories
      ...(category && {
        category: Array.isArray(category) ? { in: category } : category,
      }),

      // Location filter - case-insensitive partial match
      ...(location && {
        location: {
          contains: location,
          mode: "insensitive",
        },
      }),

      // Search functionality - search in title and description
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),

      // Date filter - filter events on specified date
      ...(date && {
        dateTime: {
          gte: new Date(`${date}T00:00:00`),
          lt: new Date(`${date}T23:59:59`),
        },
      }),
    };

    // Get count for pagination
    const totalCount = await prisma.event.count({ where });

    // Get events with filtering, sorting and pagination
    const events = await prisma.event.findMany({
      where,
      include: {
        _count: { select: { participants: true } },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take,
    });

    // Add availability information for each event
    const eventsWithAvailability = events.map((event) => {
      const participantsJoined = event._count.participants;
      const spacesLeft = event.maxParticipants - participantsJoined;
      const isAvailable =
        spacesLeft > 0 && new Date(event.dateTime) > new Date();

      // Format dateTime for easier frontend handling
      const formattedDateTime = new Date(event.dateTime);

      return {
        ...event,
        participantsJoined,
        spacesLeft,
        isAvailable,
        formattedDate: formattedDateTime.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        formattedTime: formattedDateTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    // Return pagination metadata along with results
    res.json({
      events: eventsWithAvailability,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching events",
        error: error.message,
      });
  }
};

// Create event (protected)
export const createEvent = async (req, res) => {
  const {
    title,
    description,
    dateTime,
    location,
    category,
    eventImage,
    maxParticipants,
  } = req.body;
  const userId = req.userId;
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        dateTime: new Date(dateTime),
        location,
        category,
        eventImage,
        maxParticipants: maxParticipants || 30, // Use provided value or default to 30
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
        participants: true,
        _count: { select: { participants: true } },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // Add availability information
    const participantsJoined = event._count.participants;
    const spacesLeft = event.maxParticipants - participantsJoined;
    const isAvailable = spacesLeft > 0 && new Date(event.dateTime) > new Date();

    res.json({
      ...event,
      participantsJoined,
      spacesLeft,
      isAvailable,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching event", error });
  }
};

// Join event (protected)
export const joinEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // First check if the event has space available
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: { select: { participants: true } },
      },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if event date has passed
    if (new Date(event.dateTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot join past events",
      });
    }

    // Check if maximum participant limit is reached
    if (event._count.participants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Event has reached maximum participants limit",
      });
    }

    // Check if user is already a participant
    const userParticipation = await prisma.event.findFirst({
      where: {
        id: parseInt(id),
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (userParticipation) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this event",
      });
    }

    // If all checks pass, join the event
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

// Leave event (protected)
export const leaveEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if user is a participant
    const userParticipation = await prisma.event.findFirst({
      where: {
        id: parseInt(id),
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!userParticipation) {
      return res.status(400).json({
        success: false,
        message: "You are not a participant of this event",
      });
    }

    // Remove the user from participants
    await prisma.event.update({
      where: { id: parseInt(id) },
      data: { participants: { disconnect: { id: userId } } },
    });

    res.json({ success: true, message: "Successfully left the event" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error leaving event", error });
  }
};
