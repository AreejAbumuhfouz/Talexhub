'use strict';
const jwt    = require('jsonwebtoken');
const logger = require('./logger');

const socketHandler = (io) => {
  io.use((socket, next) => {
    let token = socket.handshake.auth?.token;
    if (!token) {
      const cookie = socket.handshake.headers?.cookie || '';
      const m = cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
      if (m) token = decodeURIComponent(m[1]);
    }
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);
    socket.on('join_room', (roomId) => { socket.join(`room:${roomId}`); socket.to(`room:${roomId}`).emit('user_joined', { userId: socket.userId }); });
    socket.on('leave_room', (roomId) => { socket.leave(`room:${roomId}`); socket.to(`room:${roomId}`).emit('user_left', { userId: socket.userId }); });
    socket.on('send_message', ({ roomId, content, tempId }) => { socket.to(`room:${roomId}`).emit('new_message', { tempId, roomId, content, senderId: socket.userId, createdAt: new Date() }); });
    socket.on('typing', ({ roomId }) => { socket.to(`room:${roomId}`).emit('user_typing', { userId: socket.userId }); });
    socket.on('stop_typing', ({ roomId }) => { socket.to(`room:${roomId}`).emit('user_stop_typing', { userId: socket.userId }); });
    socket.on('disconnect', () => { logger.info(`Socket disconnected: ${socket.userId}`); });
  });
};

module.exports = socketHandler;
