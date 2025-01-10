import { Comment } from "../models/comment.model.js";

export const handleCommentConn = (socket) => {
    socket.eventId = socket.handshake.query.eventId;
    socket.join(socket.eventId);

    console.log(socket.handshake.query.eventId)
    console.log(socket.eventId);


    socket.on("newComment", async (comment) => {
        try {
            console.log(comment);
            const message = await Comment.create({
                userId: socket.profileId,
                eventId: socket.eventId,
                comment,
            }).populate("userId", "_id name profilePic");

            socket.to(socket.eventID).emit("getNewComment", message);
            socket.emit("getNewComment", message);
        } catch (error) {
            console.error("Message error:", error);
            socket.emit("commenterror", error.message);
        }
    });

    socket.on("disconnect", () => {
        socket.leave(socket.eventID);
    });
};