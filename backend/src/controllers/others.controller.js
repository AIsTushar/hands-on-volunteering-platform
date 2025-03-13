import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get home page data with latest 6 events and requests
 */
export const getHomePageData = async (req, res) => {
  try {
    // Get latest 6 events
    const events = await prisma.event.findMany({
      take: 6,

      orderBy: {
        dateTime: "desc",
      },
      include: {
        participants: true,
        creator: {
          select: {
            id: true,
          },
        },
        _count: { select: { participants: true } },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Add availability information for each event
    const eventsWithAvailability = events.map((event) => {
      const participantsJoined = event._count.participants;
      const spacesLeft = event.maxParticipants - participantsJoined;
      const isAvailable =
        spacesLeft > 0 && new Date(event.dateTime) > new Date();

      return {
        ...event,
        participantsJoined,
        spacesLeft,
        isAvailable,
      };
    });

    // Get latest 6 help requests
    const helpRequests = await prisma.helpRequest.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            helpers: true,
            comments: true,
          },
        },
      },
    });

    // Return combined data
    res.json({
      success: true,
      data: {
        latestEvents: eventsWithAvailability,
        latestRequests: helpRequests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching home page data",
      error,
    });
  }
};
