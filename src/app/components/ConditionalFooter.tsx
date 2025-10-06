"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  const hideFooterRoutes = ["/realtime-updates"];

  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
