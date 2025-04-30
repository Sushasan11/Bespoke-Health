const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const activeConnections = new Map();
const onlineUsers = new Map();
let io;


const initializeSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      
      socket.user = decoded;
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      
      const unreadCount = await prisma.notification.count({
        where: {
          user_id: decoded.id,
          is_read: false
        }
      });
      
      socket.unreadCount = unreadCount;
      
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    
    if (!activeConnections.has(socket.user.id)) {
      activeConnections.set(socket.user.id, []);
    }
    activeConnections.get(socket.user.id).push(socket.id);
    
    
    onlineUsers.set(socket.userId, socket.id);
    
    
    socket.emit("notification:count", { count: socket.unreadCount });
    
    
    sendRecentNotifications(socket);
    
    
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
      
      
      const userConnections = activeConnections.get(socket.user.id) || [];
      const updatedConnections = userConnections.filter(id => id !== socket.id);
      
      if (updatedConnections.length === 0) {
        activeConnections.delete(socket.user.id);
      } else {
        activeConnections.set(socket.user.id, updatedConnections);
      }
      
      
      onlineUsers.delete(socket.userId);
    });
    
    
    socket.on("notification:read", async ({ notificationId }) => {
      try {
        await prisma.notification.update({
          where: { id: notificationId },
          data: { is_read: true }
        });
        
        
        const unreadCount = await prisma.notification.count({
          where: {
            user_id: socket.user.id,
            is_read: false
          }
        });
        
        socket.emit("notification:count", { count: unreadCount });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    });
    
    
    socket.on("notification:read-all", async () => {
      try {
        await prisma.notification.updateMany({
          where: {
            user_id: socket.user.id,
            is_read: false
          },
          data: { is_read: true }
        });
        
        socket.emit("notification:count", { count: 0 });
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    });
    
    
    socket.on("notification:load-all", async () => {
      await sendAllNotifications(socket);
    });
  });

  return io;
};


const sendRecentNotifications = async (socket) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        user_id: socket.user.id
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 10
    });
    
    const formattedNotifications = notifications.map(formatNotification);
    
    socket.emit("notification:recent", formattedNotifications);
  } catch (error) {
    console.error("Error sending recent notifications:", error);
  }
};


const sendAllNotifications = async (socket) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        user_id: socket.user.id
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    const formattedNotifications = notifications.map(formatNotification);
    
    socket.emit("notification:all", formattedNotifications);
  } catch (error) {
    console.error("Error sending all notifications:", error);
  }
};


const formatNotification = (notification) => {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    subType: notification.sub_type,
    relatedId: notification.related_id,
    isRead: notification.is_read,
    timestamp: notification.created_at,
    metadata: notification.metadata ? JSON.parse(notification.metadata) : null
  };
};


const sendNotification = async (userId, notification) => {
  try {
    
    const newNotification = await prisma.notification.create({
      data: {
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        sub_type: notification.subType,
        related_id: notification.relatedId,
        metadata: notification.metadata ? JSON.stringify(notification.metadata) : null
      }
    });
    
    
    const formattedNotification = formatNotification(newNotification);
    
    
    const userConnections = activeConnections.get(userId) || [];
    
    
    if (userConnections.length > 0) {
      
      userConnections.forEach(socketId => {
        io.to(socketId).emit("notification:new", formattedNotification);
      });
      
      
      const unreadCount = await prisma.notification.count({
        where: {
          user_id: userId,
          is_read: false
        }
      });
      
      userConnections.forEach(socketId => {
        io.to(socketId).emit("notification:count", { count: unreadCount });
      });
    }
    
    return newNotification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};


const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};


const sendNotificationEvent = (userId, data) => {
  if (isUserOnline(userId)) {
    io.to(onlineUsers.get(userId)).emit('notification', data);
  }
};

module.exports = {
  initializeSocketIO,
  sendNotification,
  isUserOnline,
  sendNotificationEvent
};