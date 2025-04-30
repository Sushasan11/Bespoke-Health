const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const setupWebSockets = (server) => {
  const io = socketIo(server);
  global.io = io; 

  
  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.decoded.id);
    
    
    socket.on('join_chat', (chatRoomId) => {
      socket.join(`chat_${chatRoomId}`);
      console.log(`User ${socket.decoded.id} joined chat room ${chatRoomId}`);
    });
    
    
    socket.on('leave_chat', (chatRoomId) => {
      socket.leave(`chat_${chatRoomId}`);
      console.log(`User ${socket.decoded.id} left chat room ${chatRoomId}`);
    });
    
    
    socket.on('typing', (data) => {
      socket.to(`chat_${data.chatRoomId}`).emit('user_typing', {
        userId: socket.decoded.id,
        typing: data.typing
      });
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.decoded.id);
    });
  });

  return io;
};

module.exports = setupWebSockets;