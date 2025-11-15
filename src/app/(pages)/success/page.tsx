"use client";

import Link from "next/link";

export default function SuccessDonate() {
  return (
    <div className="md:hidden h-[75vh] flex flex-col items-center justify-center  p-4">
      <svg
        className="w-10 h-10 mb-4"
        viewBox="0 0 52 52"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle outline */}
        <circle
          className="stroke-dark-blue"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          strokeWidth="2"
          strokeDasharray="157"
          strokeDashoffset="157"
          style={{ animation: "draw-circle 0.6s forwards" }}
        />
        {/* Check mark */}
        <path
          className="stroke-dark-blue"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 26 L24 34 L36 18"
          strokeDasharray="34"
          strokeDashoffset="34"
          style={{ animation: "draw-check 0.4s forwards 0.6s" }}
        />
      </svg>

      <style jsx>{`
        @keyframes draw-circle {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <h1 className="text-lg font-bold text-center text-dark-blue mb-2">
        Thank You for Your Donation!
      </h1>
      <p className="text-xs text-gray-500 dark:text-zinc-300 text-center mb-6">
        Your support brings hope to those in need.
      </p>
      <Link
        href="/donations"
        className="bg-dark-blue  text-white px-6 py-3 rounded-lg text-xs"
      >
        Make Another Donation
      </Link>

      <div className="w-1/2 flex items-center my-5">
        <div className="flex-1 h-px bg-gray-400/50"></div>
        <span className="mx-3 text-xs text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-400/50"></div>
      </div>

      <Link
        href="/"
        className=" rounded-lg text-xs  underline underline-offset-8 text-gray-500 dark:text-gray-400"
      >
        Go to homepage
      </Link>
    </div>
  );
}
