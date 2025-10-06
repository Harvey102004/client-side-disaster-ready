import Image from "next/image";
import { FaFacebook, FaGlobe, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-light-black t relative mt-20 w-full pb-4 md:mt-32 md:p-5 md:pb-10">
      <div className="flex max-w-[1500px] flex-col items-center md:flex-row md:justify-around">
        <div className="relative h-20 w-[200px] md:h-44 md:w-[350px]">
          <Image
            src={"/images/lb-logo.png"}
            fill
            alt="lb-logo"
            className="object-contain"
          ></Image>
        </div>
        <div className="text-light flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <p className="text-[10px] md:text-[14px]">Get in touch</p>
            <div className="flex items-center gap-2 md:gap-3">
              <a href="https://www.facebook.com/elbilagunaph/?locale=tl_PH">
                <FaFacebook className="text-sm md:text-lg" />
              </a>
              <a href="mailto:lbmunicipality@gmail.com">
                <MdEmail className="md:text-xl" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-[9px] md:gap-5 md:text-[12px]">
            <div className="flex items-center gap-2 md:gap-3">
              <HiLocationMarker className="md:text-lg text-sm" />
              <p>Barangay Timugan, Los Baños, Philippines, 4030</p>
            </div>
            <div className="flex items-center gap-3 ">
              <FaPhone className="md:text-lg text-xs        " />
              <p>(049) 530-2589</p>
            </div>
            <div className="flex items-center gap-3 ">
              <FaGlobe className="md:text-lg text-xs" />

              <a href="https://losbanos.gov.ph/">
                <p>losbanos.gov.ph</p>
              </a>
            </div>
          </div>

          <div className="mt-3 text-center text-[6px] md:absolute md:bottom-3 md:left-1/2 md:-translate-x-1/2 md:text-[9px]">
            <p>&copy; Disaster Map Evacuation System. </p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
