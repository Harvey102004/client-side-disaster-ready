"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { IoIosCamera } from "react-icons/io";
import { successToast, errorToast } from "@/app/components/toast";

// 🔵 Image compression function
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 900; // target width
        const scale = maxWidth / img.width;

        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const compressed = new File([blob!], file.name, {
              type: "image/jpeg",
            });
            resolve(compressed);
          },
          "image/jpeg",
          0.7 // compression quality
        );
      };
    };
    reader.readAsDataURL(file);
  });
};

export default function SendReport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let id: string | number;
    if (window.innerWidth < 768) {
      id = toast.error(
        <p className="overflow-hidden text-xs break-words whitespace-normal">
          Location Access Notice
        </p>,
        {
          description: (
            <p className="overflow-hidden text-[10px] break-words whitespace-normal text-zinc-800">
              We’ll automatically include your location when you submit a
              report.
            </p>
          ),
          duration: Infinity,
          className:
            "!max-w-[330px] !gap-3 whitespace-normal !overflow-hidden rounded-lg py-3",
          action: (
            <button
              onClick={() => toast.dismiss(id)}
              className="shrink-0 rounded-full bg-red-600 px-2 py-1.5 text-[10px] font-medium text-white"
            >
              OK
            </button>
          ),
        }
      );
    }

    return () => {
      if (id) toast.dismiss(id);
    };
  }, []);

  // ✅ useForm setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      status: "",
      lat: "",
      lng: "",
      name: "",
      phone: "",
      description: "",
      address: "",
    },
  });

  // ✅ Get user location (lat, lng, and formatted address)
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setValue("lat", "");
      setValue("lng", "");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Set lat/lng for backend
        setValue("lat", latitude.toString());
        setValue("lng", longitude.toString());
      },
      (error) => {
        console.error("Location error:", error);
        setValue("lat", "");
        setValue("lng", "");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setValue]);

  // ✅ Camera logic
  const handleOpenCamera = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔵 Compress image first
    const compressed = await compressImage(file);
    setPhotoFile(compressed);

    // 🔵 Create preview from compressed file
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(compressed);
  };

  // ✅ Submit to backend
  const onSubmit = async (data: any) => {
    if (!photoFile) return errorToast("Please take a photo first.");

    if (!data.status) return errorToast("Please select severity.");

    if (!data.phone || !data.description)
      return errorToast("Please fill in all required fields.");

    let phoneNumber = data.phone.trim();
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "63" + phoneNumber.substring(1);
    }

    setSubmitting(true);

    try {
      data.phone = phoneNumber;

      const formData = new FormData();
      formData.append("reporter_name", data.name.trim());
      formData.append("reporter_contact", phoneNumber);
      formData.append("description", data.description.trim());
      formData.append("severity", data.status);
      formData.append("lat", data.lat);
      formData.append("lng", data.lng);
      formData.append("media", photoFile);

      const response = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/createIncident.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      // success message
      if (result.success) {
        successToast(
          "Report Sent!",
          result.message || "Incident reported successfully!"
        );
        reset();
        setPhotoFile(null);
        setPhotoPreview(null);
        setSubmitted(true);
      } else {
        errorToast(
          "Request Failed!",
          result.error || result.message || "Failed to send report."
        );
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      errorToast(
        "Request Failed!",
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to connect to backend."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || "";
      setIsMobile(/Mobi|Android/i.test(ua));
    }
  }, []);

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[75vh] text-gray-500 px-4">
        <img
          src="https://media.lordicon.com/icons/wired/outline/721-hand-with-phone.gif"
          alt="Mobile only"
          className="md:w-28 md:h-28 h-20 w-20 mb-4 opacity-90 rounded-full"
        />
        <p className="font-medium text-xs md:text-base">
          Incident reporting is only accessible on mobile browsers.
        </p>
        <p className="text-[11px] not-odd:md:text-xs mt-2 text-gray-400">
          Please open this page using your smartphone browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex   justify-center  px-4 pb-10">
      <div className="w-full max-w-lg rounded-2xl px-4 space-y-5 relative flex flex-col ">
        {submitting && (
          <div className="fixed inset-0 flex  items-center justify-center z-40 ">
            <div className="flex flex-col md:gap-5 gap-4 items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-7 w-7 md:h-10 md:w-10 border-4 border-gray-300 border-t-dark-blue"></div>
            </div>
          </div>
        )}
        {!submitted ? (
          <>
            {" "}
            <h1 className="text-xl font-semibold text-center">Send a Report</h1>
            <p className="text-xs text-center text-gray-500 leading-normal tracking-wide -mt-3">
              Please provide accurate details and a clear photo to help
              authorities respond quickly and properly.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Camera */}
              <div className="flex flex-col items-center">
                {!photoPreview ? (
                  <div
                    onClick={handleOpenCamera}
                    className="w-full h-56 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="text-4xl">
                      <IoIosCamera />
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs font-medium">
                      Capture Incident Area
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <img
                      src={photoPreview}
                      alt="Captured"
                      onClick={() => setShowFull(true)}
                      className="rounded-lg border w-full h-64 object-cover cursor-zoom-in"
                    />
                    <div className="flex gap-3 justify-center mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoFile(null);
                        }}
                        className="px-5 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Hidden lat/lng */}
              <input type="hidden" {...register("lat")} />
              <input type="hidden" {...register("lng")} />

              {/* Name */}
              <div className="mt-8">
                <label className="block text-xs mb-2">Full Name *</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-md border outline-none p-3 text-xs"
                  placeholder="Enter your full name..."
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {String(errors.name.message)}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="mt-8">
                <label className="block text-xs mb-2">Phone Number *</label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="w-full rounded-md border outline-none p-3 text-xs"
                  placeholder="e.g. 09123456789"
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {String(errors.phone.message)}
                  </p>
                )}
              </div>

              {/* Severity */}
              <div className="mt-8">
                <label className="block text-xs mb-2">
                  Incident Severity *
                </label>
                <Select
                  onValueChange={(value) =>
                    setValue("status", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full rounded-md border !bg-transparent !p-5 text-xs">
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        Critical
                      </div>
                    </SelectItem>

                    <SelectItem value="moderate">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                        Moderate
                      </div>
                    </SelectItem>

                    <SelectItem value="minor">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                        Minor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-[10px] mt-1">
                    Severity is required
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mt-8">
                <label className="block text-xs mb-2">
                  Description / Details *
                </label>
                <textarea
                  {...register("description", { required: true })}
                  className="w-full rounded-md border p-4 outline-none text-xs min-h-[250px]"
                  placeholder="Describe what happened (landmark, nearby places, etc.)..."
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-[10px] mt-1">
                    Description is required
                  </p>
                )}
              </div>

              {/*
                <div className="absolute h-0">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    size="invisible"
                    ref={recaptchaRef}
                    onChange={(token: string | null) =>
                      setValue("captcha", token || "")
                    }
                  />
                </div>
                */}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-sm mt-2 bg-blue-600 text-white text-sm  hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {submitting ? "Sending..." : "Send Report"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center h-[600px]  justify-center text-center py-20">
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

            <h2 className="text-lg font-semibold text-dark-blue">
              Report Submitted!
            </h2>
            <p className="text-xs text-gray-500 mt-2 px-3">
              Your report has been successfully submitted. Please wait for a
              text message for updates regarding your report.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-5 py-2 rounded-md transition"
            >
              Send Another Report
            </button>

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
          </div>
        )}
      </div>
    </div>
  );
}
