"use client";

import * as React from "react";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import { useTheme } from "next-themes";

import { Button } from "../components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
      className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer 
                 bg-dark-blue text-white dark:text-itim dark:bg-puti transition-colors duration-300"
    >
      <MdSunny className="scale-100 rotate-0 dark:scale-0 dark:-rotate-90 text-sm" />
      <IoMoon className="absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}

export function ModeToggleSideBar() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={"sm"}
      className="bg-dark-blue text-light dark:text-itim dark:bg-puti transition-none"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
    >
      <MdSunny className="scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <IoMoon className="absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function SegmentedThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer select-none overflow-hidden">
      {/* Sliding background */}
      <div
        className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-8 bg-dark-blue  rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Light option */}
      <div
        onClick={() => setTheme("light")}
        className={`relative z-10 flex-1 flex items-center text-xs justify-center font-medium transition-colors duration-300 ${
          theme === "light" ? "text-white" : "text-gray-500"
        }`}
      >
        Light
      </div>

      {/* Dark option */}
      <div
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex-1 flex items-center text-xs justify-center font-medium transition-colors duration-300 ${
          theme === "dark" ? "text-white" : "text-gray-500"
        }`}
      >
        Dark
      </div>
    </div>
  );
}
