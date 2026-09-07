/**
 * Real-time Socket.IO handlers for Live Order Tracking and Rider GPS updates
 */
export const registerOrderSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Customer or Rider joins specific order room
    socket.on('join_order_room', ({ orderId }) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined room order:${orderId}`);
    });

    // DarkStore picker updates status
    socket.on('update_order_status', ({ orderId, status }) => {
      io.to(`order:${orderId}`).emit('order_status_updated', {
        orderId,
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Rider emits live GPS coordinates
    socket.on('rider_gps_tick', ({ orderId, latitude, longitude }) => {
      io.to(`order:${orderId}`).emit('rider_location_update', {
        orderId,
        latitude,
        longitude
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};
