"use server";

import type { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/path";

const createCommentSchema = z.object({
  content: z.string().min(3),
});

interface CreateCommentFormState {
  success?: boolean;
  errors: {
    content?: string[];
    _form?: string[];
  };
}

export const createComment = async (
  params: { postId: string; parentId?: string },
  _formState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> => {
  const { postId, parentId } = params;

  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();

  if (!session || !session.user) {
    return { errors: { _form: ["You must be singed in to do this."] } };
  }
  let topic: Topic | null;
  try {
    const post = await db.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      return { errors: { _form: ["Cannot find post."] } };
    }

    topic = await db.topic.findFirst({
      where: { id: post.topicId },
    });

    if (!topic) {
      return { errors: { _form: ["Cannot find topic."] } };
    }

    await db.comment.create({
      data: {
        content: result.data.content,
        userId: session.user.id,
        postId: postId,
        parentId: parentId,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    } else {
      return { errors: { _form: ["Failed to create comment"] } };
    }
  }

  revalidatePath(paths.postShow(topic.slug, postId));

  return { errors: {}, success: true };
};
