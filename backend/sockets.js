
export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("join_room", (roomid) => {
      console.log("➡️ joined room:", roomid);
      socket.join(roomid);
    });

    socket.on("send_message", ({ deltaObj, roomid }) => {

      console.log("✉️ message sent:",roomid, deltaObj);
      socket.to(roomid).emit("receive_message", deltaObj);
    });

    socket.on("leave_room", (roomid) => {
      console.log("⬅️ left room:", roomid);
      socket.leave(roomid);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}