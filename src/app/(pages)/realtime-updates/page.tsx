"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const RiskMappingMap = dynamic(
  () => import("../../components/maps/risk-mapping"),
  { ssr: false }
);

export default function DisasterRiskMapping() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <RiskMappingMap />
    </div>
  );
}
