"use server";

import path from "@/path";
import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  const term = formData.get("term");

  if (typeof term !== "string" || !term) {
    redirect(path.home());
  }

  redirect(path.search(term));
}
