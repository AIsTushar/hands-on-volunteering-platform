import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import cloudinary from "../utils/cloudinaryConfig.js";

// Get All Events
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
    // Safe parsing with fallbacks
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    // Calculate pagination values
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    // List of valid sortable fields
    const validSortFields = [
      "dateTime",
      "title",
      "createdAt",
      "maxParticipants",
      "location",
    ];
    const fieldToSort = validSortFields.includes(sortBy) ? sortBy : "dateTime";

    // Build the where clause for filtering
    const where = {
      // Category filter - handle multiple categories
      ...(category && {
        categoryId: Array.isArray(category)
          ? { in: category.map((c) => parseInt(c)) }
          : parseInt(category),
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
          gte: new Date(`${date}T00:00:00Z`),
          lt: new Date(`${date}T23:59:59Z`),
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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [fieldToSort]: sortOrder,
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
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};
// Create event (protected)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      dateTime,
      location,
      maxParticipants,
      categoryId,
    } = req.body;

    // Event data object
    const eventData = {
      title,
      description,
      dateTime: new Date(dateTime),
      location,
      maxParticipants: parseInt(maxParticipants) || 30,
      categoryId: parseInt(categoryId),
      creatorId: req.userId,
    };

    // Handle image upload using Cloudinary if present
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "event_images",
            public_id: `event_${Date.now()}`,
            transformation: [{ width: 800, height: 600, crop: "fill" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      eventData.eventImage = await uploadPromise;
    }

    // Create event in database
    const event = await prisma.event.create({
      data: eventData,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// Get Event
export const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        participants: true,
        category: {
          select: {
            name: true,
          },
        },
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

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const {
      title,
      description,
      dateTime,
      location,
      maxParticipants,
      categoryId,
    } = req.body;

    // Check if event exists and user is the creator
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { creatorId: true },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the creator
    if (existingEvent.creatorId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this event",
      });
    }

    // Prepare update data
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (dateTime) updateData.dateTime = new Date(dateTime);
    if (location) updateData.location = location;
    if (maxParticipants) updateData.maxParticipants = parseInt(maxParticipants);
    if (categoryId) updateData.categoryId = parseInt(categoryId);

    // Handle image upload if present
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "event_images",
            public_id: `event_${eventId}_${Date.now()}`,
            transformation: [{ width: 800, height: 600, crop: "fill" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updateData.eventImage = await uploadPromise;
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    // Check if event exists and user is the creator
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { creatorId: true, eventImage: true },
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the creator
    if (existingEvent.creatorId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this event",
      });
    }

    // Delete the event image from Cloudinary if exists
    if (
      existingEvent.eventImage &&
      existingEvent.eventImage.includes("cloudinary")
    ) {
      try {
        // Extract public_id from the URL
        const publicId = existingEvent.eventImage
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(`event_images/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId },
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// Get events created by the current user
export const getMyEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        creatorId: req.userId,
      },
      include: {
        category: true,
        _count: {
          select: { participants: true },
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user events",
      error: error.message,
    });
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
