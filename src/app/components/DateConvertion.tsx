"use client";

import { useEffect, useState } from "react";

export default function DateTimeDisplay({ value }: { value: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const date = new Date(value);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setFormatted(formattedDate);
  }, [value]);

  return <span>{formatted || "Loading..."}</span>;
}
