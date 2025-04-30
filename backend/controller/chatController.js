const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const { uploadChatAttachment } = require("../utils/fileUpload");

const getChatRoom = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: {
        doctor: {
          include: { user: true },
        },
        patient: {
          include: { user: true },
        },
        time_slot: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const isDoctor = appointment.doctor.user.id === userId;
    const isPatient = appointment.patient.user.id === userId;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        error: "You don't have permission to access this chat",
      });
    }

    let chatRoom = await prisma.chatRoom.findUnique({
      where: { appointment_id: parseInt(appointmentId) },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: { appointment_id: parseInt(appointmentId) },
      });
    }

    res.status(200).json({
      chatRoom,
      appointment: {
        id: appointment.id,
        date: appointment.time_slot ? appointment.time_slot.date : null,
        status: appointment.status,
        doctor: {
          id: appointment.doctor.id,
          name: appointment.doctor.user.name,
        },
        patient: {
          id: appointment.patient.id,
          name: appointment.patient.user.name,
        },
      },
    });
  } catch (error) {
    console.error("Get chat room error:", error);
    res.status(500).json({ error: "Failed to retrieve chat room" });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: parseInt(chatRoomId) },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
          },
        },
      },
    });

    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const isDoctor = chatRoom.appointment.doctor.user.id === userId;
    const isPatient = chatRoom.appointment.patient.user.id === userId;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        error: "You don't have permission to access these messages",
      });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { chat_room_id: parseInt(chatRoomId) },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    });

    if (messages.length > 0) {
      await prisma.chatMessage.updateMany({
        where: {
          chat_room_id: parseInt(chatRoomId),
          sender_id: { not: userId },
          read: false,
        },
        data: { read: true },
      });
    }

    const formattedMessages = messages.map((message) => ({
      ...message,
      attachment: message.attachment
        ? `${req.protocol}://${req.get("host")}/api/uploads/chat/${
            message.attachment
          }`
        : null,
      isMine: message.sender_id === userId,
    }));

    const total = await prisma.chatMessage.count({
      where: { chat_room_id: parseInt(chatRoomId) },
    });

    res.status(200).json({
      messages: formattedMessages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({ error: "Failed to retrieve chat messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const senderType = req.user.role;

    if (!content && !req.file) {
      return res.status(400).json({
        error: "Message must contain text content or an attachment",
      });
    }

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: parseInt(chatRoomId) },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
          },
        },
      },
    });

    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const isDoctor = chatRoom.appointment.doctor.user.id === userId;
    const isPatient = chatRoom.appointment.patient.user.id === userId;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({
        error: "You don't have permission to send messages to this chat",
      });
    }

    let attachmentPath = null;
    if (req.file) {
      attachmentPath = path.basename(req.file.path);
    }

    const message = await prisma.chatMessage.create({
      data: {
        chat_room_id: parseInt(chatRoomId),
        sender_id: userId,
        sender_type: senderType,
        content: content || "",
        attachment: attachmentPath,
        read: false,
      },
    });

    await prisma.chatRoom.update({
      where: { id: parseInt(chatRoomId) },
      data: { updated_at: new Date() },
    });

    const formattedMessage = {
      ...message,
      attachment: message.attachment
        ? `${req.protocol}:
            message.attachment
          }`
        : null,
      isMine: true,
    };

    if (global.io) {
      global.io.to(`chat_${chatRoomId}`).emit("new_message", formattedMessage);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: formattedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getUnreadMessageCounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          {
            appointment: {
              doctor: {
                user: {
                  id: userId,
                },
              },
            },
          },
          {
            appointment: {
              patient: {
                user: {
                  id: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
          },
        },
      },
    });

    const unreadCounts = await Promise.all(
      chatRooms.map(async (room) => {
        const count = await prisma.chatMessage.count({
          where: {
            chat_room_id: room.id,
            sender_id: { not: userId },
            read: false,
          },
        });

        return {
          chatRoomId: room.id,
          appointmentId: room.appointment_id,
          unreadCount: count,
          participantInfo: {
            doctor: {
              id: room.appointment.doctor.id,
              name: room.appointment.doctor.user.name,
            },
            patient: {
              id: room.appointment.patient.id,
              name: room.appointment.patient.user.name,
            },
          },
        };
      })
    );

    res.status(200).json({
      unreadCounts,
      totalUnread: unreadCounts.reduce(
        (sum, item) => sum + item.unreadCount,
        0
      ),
    });
  } catch (error) {
    console.error("Get unread counts error:", error);
    res.status(500).json({ error: "Failed to retrieve unread message counts" });
  }
};

/**
 * Get all chat rooms for the logged-in user
 * For doctors: Shows conversations with different patients
 * For patients: Shows conversations with different doctors
 */
const getUserChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let whereClause = {};

    if (userRole === "Doctor") {
      whereClause = {
        appointment: {
          doctor: {
            user: {
              id: userId,
            },
          },
        },
      };
    } else if (userRole === "Patient") {
      whereClause = {
        appointment: {
          patient: {
            user: {
              id: userId,
            },
          },
        },
      };
    } else {
      return res.status(403).json({ error: "Invalid user role" });
    }

    const chatRooms = await prisma.chatRoom.findMany({
      where: whereClause,
      include: {
        appointment: {
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            patient: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            time_slot: true,
          },
        },

        messages: {
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.chatRoom.count({
      where: whereClause,
    });

    const unreadCountsPromises = chatRooms.map(async (room) => {
      return prisma.chatMessage.count({
        where: {
          chat_room_id: room.id,
          sender_id: { not: userId },
          read: false,
        },
      });
    });

    const unreadCounts = await Promise.all(unreadCountsPromises);

    const formattedChatRooms = chatRooms.map((room, index) => {
      const otherParticipant =
        userRole === "Doctor"
          ? {
              id: room.appointment.patient.id,
              userId: room.appointment.patient.user.id,
              name: room.appointment.patient.user.name,
              email: room.appointment.patient.user.email,
            }
          : {
              id: room.appointment.doctor.id,
              userId: room.appointment.doctor.user.id,
              name: room.appointment.doctor.user.name,
              email: room.appointment.doctor.user.email,
            };

      const lastMessage =
        room.messages.length > 0
          ? {
              id: room.messages[0].id,
              content: room.messages[0].content,
              sender_id: room.messages[0].sender_id,
              sender_type: room.messages[0].sender_type,
              created_at: room.messages[0].created_at,
              isMine: room.messages[0].sender_id === userId,
              hasAttachment: !!room.messages[0].attachment,
            }
          : null;

      return {
        id: room.id,
        appointment_id: room.appointment_id,
        appointment_date: room.appointment.time_slot.date,
        appointment_status: room.appointment.status,
        participant: otherParticipant,
        last_message: lastMessage,
        unread_count: unreadCounts[index],
        updated_at: room.updated_at,
      };
    });

    res.status(200).json({
      chatRooms: formattedChatRooms,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Get user chat rooms error:", error);
    res.status(500).json({ error: "Failed to retrieve chat rooms" });
  }
};

module.exports = {
  getChatRoom,
  getChatMessages,
  sendMessage,
  getUnreadMessageCounts,
  getUserChatRooms,
};
