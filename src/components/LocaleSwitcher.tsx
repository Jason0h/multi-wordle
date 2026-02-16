"use client";

import { useLocale } from "gt-next/client";
import { switchLocale } from "@/actions/switchLocale";
import { useTransition } from "react";

const LOCALES = ["en", "ru", "he"] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const currentIndex = LOCALES.indexOf(locale as (typeof LOCALES)[number]);
  const nextLocale = LOCALES[(currentIndex + 1) % LOCALES.length];

  function handleClick() {
    startTransition(async () => {
      await switchLocale(nextLocale);
      window.location.href = "/";
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold outline-none transition-colors hover:bg-accent disabled:opacity-50"
    >
      {locale.toUpperCase()}
      <span className="sr-only">Switch to {nextLocale} locale</span>
    </button>
  );
}
