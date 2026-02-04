import { createServer } from "node:http";
import { and, inArray, isNull } from "drizzle-orm";
import next from "next";
import { Server } from "socket.io";
import { chatMessages, db } from "./db/schema";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = Number.parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
    });

    socket.on("send_message", async (data) => {
      const { courseId, userId, recipientId, messageContent } = data;

      if (!courseId || !userId || !recipientId || !messageContent) {
        return;
      }

      try {
        const [savedMessage] = await db
          .insert(chatMessages)
          .values({
            courseId,
            userId,
            recipientId,
            messageContent,
          })
          .returning();

        io.to(userId)
          .to(recipientId)
          .emit("new_message", {
            ...savedMessage,
          });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("mark_messages_read", async (data) => {
      const { messageIds, readerId, senderId } = data;

      if (!Array.isArray(messageIds) || messageIds.length === 0) return;

      try {
        await db
          .update(chatMessages)
          .set({ readAt: new Date() })
          .where(
            and(
              inArray(chatMessages.id, messageIds),
              isNull(chatMessages.readAt),
            ),
          );

        if (senderId) {
          io.to(senderId).emit("messages_read", {
            messageIds,
            readerId,
            readAt: new Date(),
          });
        }

        io.to(readerId).emit("messages_read", {
          messageIds,
          readerId,
          readAt: new Date(),
        });
      } catch (error) {
        console.error("Error marking messages read:", error);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
