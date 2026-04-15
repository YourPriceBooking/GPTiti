"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PageNav() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-blue-600 font-medium hover:underline"
        >
          ← Back
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/icons/rabbit.svg" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tighter">
            GPT<span className="text-blue-600">iti</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}
