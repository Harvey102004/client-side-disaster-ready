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
import { IoIosCamera, IoIosCheckmarkCircle } from "react-icons/io";

export default function SendReport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      const id = toast.error(
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ✅ Submit to backend
  const onSubmit = async (data: any) => {
    if (!photoFile)
      return toast.error("Please take a photo first.", {
        className: "!text-xs",
      });
    if (!data.status)
      return toast.error("Please select severity.", {
        className: "!text-xs",
      });
    if (!data.phone || !data.description)
      return toast.error("Please fill in all required fields.", {
        className: "!text-xs",
      });

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("reporter_name", data.name.trim());
      formData.append("reporter_contact", data.phone.trim());
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

      // Show message from backend
      if (result.success) {
        toast.success(result.message || "Incident reported successfully!", {
          className: "!text-xs",
        });
        reset();
        setPhotoFile(null);
        setPhotoPreview(null);
        setSubmitted(true);
      } else {
        toast.error(result.message || "Failed to send report.", {
          className: "!text-xs",
        });
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to connect to backend.",
        { className: "!text-xs" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center  justify-center min-h-screen px-4 pb-10">
      <div className="w-full max-w-lg rounded-2xl px-4 space-y-5 relative flex flex-col md:hidden">
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
                    pattern: {
                      value: /^63\d{10}$/,
                      message: "Enter a valid PH number (e.g. 639123456789)",
                    },
                  })}
                  className="w-full rounded-md border outline-none p-3 text-xs"
                  placeholder="e.g. 639123456789"
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
          <div className="flex flex-col items-center justify-center text-center py-20">
            <IoIosCheckmarkCircle className="text-green-500 text-3xl mb-2" />
            <h2 className="text-lg font-semibold text-green-600">
              Report Submitted!
            </h2>
            <p className="text-xs text-gray-500 mt-2 px-6">
              Your report has been successfully submitted. Please wait for a
              text message for updates regarding your report.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-3 rounded-md transition"
            >
              Send Another Report
            </button>
          </div>
        )}
      </div>

      {/* ✅ DESKTOP NOTICE */}
      <div className="hidden md:flex flex-col items-center justify-center text-center text-gray-500 text-base  ">
        <img
          src="https://media.lordicon.com/icons/wired/outline/721-hand-with-phone.gif"
          alt="Mobile only"
          className="w-28 h-28 mb-4 opacity-90 rounded-full dark:brightness-90"
        />
        <p className="font-medium">
          Incident reporting is accessible only on mobile web.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Please open this page using your smartphone browser.
        </p>
      </div>
    </div>
  );
}
