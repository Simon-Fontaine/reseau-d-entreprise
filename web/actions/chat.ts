"use server";

import { and, asc, count, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { chatMessages, courses, db, enrollments } from "@/db/schema";

export async function getChatMessages(
  courseId: string,
  userId1: string,
  userId2: string,
) {
  const messages = await db.query.chatMessages.findMany({
    where: and(
      eq(chatMessages.courseId, courseId),
      or(
        and(
          eq(chatMessages.userId, userId1),
          eq(chatMessages.recipientId, userId2),
        ),
        and(
          eq(chatMessages.userId, userId2),
          eq(chatMessages.recipientId, userId1),
        ),
      ),
    ),
    orderBy: [asc(chatMessages.sentAt)],
    with: {
      user: true,
    },
  });

  return messages.map((m) => ({
    id: m.id,
    userId: m.userId || "",
    courseId: m.courseId || "",
    recipientId: m.recipientId || "",
    messageContent: m.messageContent,
    sentAt: m.sentAt || new Date(),
    readAt: m.readAt ? new Date(m.readAt) : null,
    user: { fullName: m.user?.fullName || "User" },
  }));
}

export async function markMessagesAsRead(messageIds: string[]) {
  if (messageIds.length === 0) return;

  try {
    await db
      .update(chatMessages)
      .set({ readAt: new Date() })
      .where(
        and(inArray(chatMessages.id, messageIds), isNull(chatMessages.readAt)),
      );
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
}

export async function getTutorConversations(tutorId: string) {
  const tutorCourses = await db.query.courses.findMany({
    where: eq(courses.tutorId, tutorId),
    with: {
      enrollments: {
        with: { user: true },
      },
    },
  });

  const conversations = [];

  for (const course of tutorCourses) {
    if (!course.enrollments) continue;

    for (const enrollment of course.enrollments) {
      const student = enrollment.user;
      if (!student) continue;

      const lastMessage = await db.query.chatMessages.findFirst({
        where: and(
          eq(chatMessages.courseId, course.id),
          or(
            and(
              eq(chatMessages.userId, tutorId),
              eq(chatMessages.recipientId, student.id),
            ),
            and(
              eq(chatMessages.userId, student.id),
              eq(chatMessages.recipientId, tutorId),
            ),
          ),
        ),
        orderBy: [desc(chatMessages.sentAt)],
      });

      const unreadCount = (
        await db
          .select({ count: count() })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.courseId, course.id),
              eq(chatMessages.userId, student.id),
              eq(chatMessages.recipientId, tutorId),
              isNull(chatMessages.readAt),
            ),
          )
      )[0].count;

      conversations.push({
        id: student.id,
        name: student.fullName,
        courseId: course.id,
        courseName: course.title,
        unreadCount,
        lastMessage: lastMessage?.messageContent || "",
        lastMessageAt: lastMessage?.sentAt || null,
        avatar: undefined,
      });
    }
  }

  return conversations.sort((a, b) => {
    const timeA = a.lastMessageAt?.getTime() || 0;
    const timeB = b.lastMessageAt?.getTime() || 0;
    return timeB - timeA;
  });
}

export async function getStudentConversations(studentId: string) {
  const studentEnrollments = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, studentId),
    with: {
      course: {
        with: { tutor: true },
      },
    },
  });

  const conversations = [];

  for (const enrollment of studentEnrollments) {
    const course = enrollment.course;
    if (!course) continue;

    const tutor = course.tutor;
    if (!tutor) continue;

    const lastMessage = await db.query.chatMessages.findFirst({
      where: and(
        eq(chatMessages.courseId, course.id),
        or(
          and(
            eq(chatMessages.userId, studentId),
            eq(chatMessages.recipientId, tutor.id),
          ),
          and(
            eq(chatMessages.userId, tutor.id),
            eq(chatMessages.recipientId, studentId),
          ),
        ),
      ),
      orderBy: [desc(chatMessages.sentAt)],
    });

    const unreadCount = (
      await db
        .select({ count: count() })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.courseId, course.id),
            eq(chatMessages.userId, tutor.id),
            eq(chatMessages.recipientId, studentId),
            isNull(chatMessages.readAt),
          ),
        )
    )[0].count;

    conversations.push({
      id: tutor.id,
      name: tutor.fullName,
      courseId: course.id,
      courseName: course.title,
      unreadCount,
      lastMessage: lastMessage?.messageContent || "",
      lastMessageAt: lastMessage?.sentAt || null,
      avatar: undefined,
    });
  }

  return conversations.sort((a, b) => {
    const timeA = a.lastMessageAt?.getTime() || 0;
    const timeB = b.lastMessageAt?.getTime() || 0;
    return timeB - timeA;
  });
}
