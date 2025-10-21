"use client";

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-16 ">
      <div className="relative w-full md:h-[650px]  h-[400px] ">
        <Image
          src={"/images/municipalhall.jpg"}
          alt=""
          fill
          className="object-cover object-[20%_30%]"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col  justify-center text-center text-white px-4">
          <h1 className="text-2xl mb-2  md:text-5xl font-bold md:mb-4 drop-shadow-lg">
            Disaster Ready
          </h1>

          <h2 className="md:text-xl text-xs md:mb-5 mb-3 md:font-bold font-semibold">
            helps you with
          </h2>

          <TypeAnimation
            sequence={[
              "Map Updates",
              2000,
              "Emergency Reports",
              2000,
              "Evacuation Updates",
              2000,
              "Community Safety",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-xs md:text-3xl font-bold text-white"
          />
        </div>

        <button className="absolute text-[10px] md:text-base bottom-6 left-1/2 py-2 px-4 md:py-3 md:px-7 rounded-full shadow bg-dark-blue text-white -translate-x-1/2">
          Get started
        </button>
      </div>

      <h2 className="text-sm ">News & Updates</h2>

      <div className=""></div>
    </div>
  );
}
