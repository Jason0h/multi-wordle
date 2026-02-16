"use server";

import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

export async function switchLocale(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set("generaltranslation.locale", locale, { path: "/" });
  cookieStore.delete(sessionOptions.cookieName);
}
