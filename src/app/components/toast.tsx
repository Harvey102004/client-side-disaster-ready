"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";

export function successToast(
  message: string,
  description?: string | ReactNode
) {
  toast.success(message, {
    description: description && (
      <p className="overflow-hidden !text-[10px] break-words whitespace-normal text-green-900">
        {description}
      </p>
    ),
    duration: 5000,
    className:
      "!max-w-[350px] !gap-3 whitespace-normal !overflow-hidden " +
      "bg-green-100 text-green-900 border border-green-300 shadow-md " +
      "rounded-lg py-3 px-4 flex items-start",
    icon: (
      <CheckCircle2 className="h-6 w-6 shrink-0 fill-green-700 text-white" />
    ),
    classNames: {
      title: "!font-semibold !text-green-900 !text-xs",
    },
  });
}

export function errorToast(message: string, description?: string | ReactNode) {
  toast.error(message, {
    description: description && (
      <p className="overflow-hidden !text-[10px] break-words whitespace-normal text-red-900">
        {description}
      </p>
    ),
    duration: 5000,
    className:
      "!max-w-[350px] !gap-3 whitespace-normal !overflow-hidden " +
      "bg-red-100 text-red-900 border border-red-300 shadow-md " +
      "rounded-lg py-3 px-4 flex items-start",
    icon: <XCircle className="h-6 w-6 shrink-0 fill-red-700 text-white" />,
    classNames: {
      title: "!font-semibold !text-red-900 !text-xs",
    },
  });
}
