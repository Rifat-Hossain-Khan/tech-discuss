"use server";

import type { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { z } from "zod";
import { db } from "@/db";
import path from "@/path";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export const createTopic = async (
  _fromState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> => {
  const name = formData.get("name");
  const description = formData.get("description");

  const result = createTopicSchema.safeParse({ name, description });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();

  if (!session || !session.user) {
    return { errors: { _form: ["You must be singed in to do this."] } };
  }

  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: { _form: [error.message] },
      };
    } else {
      return {
        errors: { _form: ["Something went wrong!"] },
      };
    }
  }

  revalidatePath(path.home());
  redirect(path.topicShow(topic.slug));
};
