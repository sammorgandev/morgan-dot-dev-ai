"use client";
import Link from "next/link";
import { ThemeToggle } from "./default-view/theme-toggle";

export default function Header() {
  return (
    <header className="flex justify-between w-full  top-0 right-0 p-6">
      <div className="text-md font-semibold flex gap-4">
        <Link href="/" className="hover:scale-105 transition-all duration-200">
          Home
        </Link>
        <Link
          href="/resume"
          className="hover:scale-105 transition-all duration-200"
        >
          Resume
        </Link>
        <Link
          href="/projects"
          className="hover:scale-105 transition-all duration-200"
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="hover:scale-105 transition-all duration-200"
        >
          Blog
        </Link>
        <Link
          href="/variations"
          className="hover:scale-105 transition-all duration-200"
        >
          Variations
        </Link>
      </div>
      <ThemeToggle />
    </header>
  );
}
