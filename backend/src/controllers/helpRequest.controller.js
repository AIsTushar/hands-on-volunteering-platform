import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all help requests with filtering options
 */
export const getHelpRequests = async (req, res) => {
  const { urgency } = req.query;

  try {
    const helpRequests = await prisma.helpRequest.findMany({
      where: {
        ...(urgency && { urgency }),
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(helpRequests);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching help requests",
      error,
    });
  }
};

/**
 * Get a single help request by ID
 */
export const getHelpRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        helpers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    res.json(helpRequest);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching help request",
      error,
    });
  }
};

/**
 * Create a new help request
 */
export const createHelpRequest = async (req, res) => {
  const { title, description, imageUrl, urgency } = req.body;
  const userId = req.userId; // Assuming user ID is available from auth middleware

  try {
    const helpRequest = await prisma.helpRequest.create({
      data: {
        title,
        description,
        imageUrl,
        urgency: urgency || "medium", // Default to medium if not specified
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Help request created successfully",
      helpRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating help request",
      error,
    });
  }
};

/**
 * Update an existing help request
 */
export const updateHelpRequest = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, urgency } = req.body;
  const userId = req.userId;

  try {
    // First check if help request exists and belongs to the user
    const existingRequest = await prisma.helpRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    if (existingRequest.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this help request",
      });
    }

    const updatedRequest = await prisma.helpRequest.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        imageUrl,
        urgency,
      },
    });

    res.json({
      success: true,
      message: "Help request updated successfully",
      helpRequest: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating help request",
      error,
    });
  }
};

/**
 * Delete a help request
 */
export const deleteHelpRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Check if help request exists and belongs to the user
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    if (helpRequest.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this help request",
      });
    }

    // Delete associated comments and helpers first
    await prisma.comment.deleteMany({
      where: { helpRequestId: parseInt(id) },
    });

    await prisma.helpRequestHelper.deleteMany({
      where: { helpRequestId: parseInt(id) },
    });

    // Now delete the help request
    await prisma.helpRequest.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Help request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting help request",
      error,
    });
  }
};

/**
 * Offer help on a help request
 */
export const offerHelp = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Check if help request exists
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    // Check if user has already offered help
    const existingOffer = await prisma.helpRequestHelper.findFirst({
      where: {
        helpRequestId: parseInt(id),
        userId,
      },
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "You have already offered help for this request",
      });
    }

    // Create the helper record
    await prisma.helpRequestHelper.create({
      data: {
        helpRequestId: parseInt(id),
        userId,
      },
    });

    res.json({
      success: true,
      message: "Help offered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error offering help",
      error,
    });
  }
};

/**
 * Withdraw help offer from a help request
 */
export const withdrawHelp = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // Delete the helper record
    const deletedOffer = await prisma.helpRequestHelper.deleteMany({
      where: {
        helpRequestId: parseInt(id),
        userId,
      },
    });

    if (deletedOffer.count === 0) {
      return res.status(404).json({
        success: false,
        message:
          "You haven't offered help for this request or the help request doesn't exist",
      });
    }

    res.json({
      success: true,
      message: "Help offer withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error withdrawing help offer",
      error,
    });
  }
};

/**
 * Add a comment to a help request
 */
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  try {
    // Check if help request exists
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        helpRequestId: parseInt(id),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error,
    });
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    // Check if comment exists and belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this comment",
      });
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error,
    });
  }
};

/**
 * Get all helpers for a help request
 */
export const getHelpRequestHelpers = async (req, res) => {
  const { id } = req.params;

  try {
    const helpers = await prisma.helpRequestHelper.findMany({
      where: {
        helpRequestId: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(helpers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching helpers",
      error,
    });
  }
};

// Get all help requests created by a user
export const getHelpRequestsByUser = async (req, res) => {
  const userId = req.userId;

  try {
    const helpRequests = await prisma.helpRequest.findMany({
      where: { userId },
      include: {
        helpers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    res.status(200).json({
      success: true,
      helpRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching help requests",
      error,
    });
  }
};
