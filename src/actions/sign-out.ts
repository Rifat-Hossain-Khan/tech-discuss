"use server";

import * as auth from "@/auth";

export const signOut = async () => {
  await auth.signOut();
};
