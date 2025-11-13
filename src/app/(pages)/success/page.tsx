"use client";

import { BiCheckCircle } from "react-icons/bi";
import Link from "next/link";

export default function SuccessDonate() {
  return (
    <div className="md:hidden h-[75vh] flex flex-col items-center justify-center  p-4">
      <BiCheckCircle className="text-dark-blue text-4xl mb-6" />
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

      <Link
        href="/"
        className="    rounded-lg text-xs mt-6 underline underline-offset-8 text-gray-500 dark:text-gray-400"
      >
        Go to homepage
      </Link>
    </div>
  );
}
