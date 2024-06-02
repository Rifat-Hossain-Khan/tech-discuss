"use server";

import * as auth from "@/auth";

export const signIn = async () => {
  await auth.signIn("github");
};
