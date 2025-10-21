"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SendReport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ useForm setup
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
    async function getLocation() {
      setLoadingLocation(true);
      if (!navigator.geolocation) {
        setValue("address", "Geolocation not supported by your browser.");
        setLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setValue("lat", latitude.toString());
          setValue("lng", longitude.toString());

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            if (data && data.address) {
              const a = data.address;
              const road = a.road || "Unnamed road";
              const purok =
                a.neighbourhood || a.suburb || a.hamlet || a.quarter || "";
              const barangay = a.village || a.town || a.city_district || "";
              const city = a.city || a.municipality || "";

              const formatted = [road, purok, barangay, city]
                .filter(Boolean)
                .join(", ");
              setValue("address", formatted);
            } else {
              setValue(
                "address",
                `Unnamed area near (${latitude.toFixed(5)}, ${longitude.toFixed(
                  5
                )})`
              );
            }
          } catch (err) {
            console.error("Location fetch error:", err);
            setValue(
              "address",
              "Failed to fetch location. Please enter manually."
            );
          } finally {
            setLoadingLocation(false);
          }
        },
        (err) => {
          console.error("Location error:", err);
          setValue("address", "Failed to get location.");
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    getLocation();
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
    if (!photoFile) return alert("Please take a photo first.");
    if (!data.status) return alert("Please select severity.");
    if (!data.phone || !data.description)
      return alert("Please fill in all required fields.");

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

      // 🔍 Debug logs (optional)
      console.log("🧾 Data before submit:", data);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch(
        "http://192.168.1.137/Disaster-backend/public/createIncident.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("📤 Backend response:", result);

      if (result.success) {
        alert("✅ Incident reported successfully!");
        reset();
        setPhotoFile(null);
        setPhotoPreview(null);
      } else {
        alert(result.error || "Failed to send report.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to connect to backend.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="w-full max-w-lg rounded-2xl px-6 space-y-5 relative md:hidden">
        <h1 className="text-xl font-bold text-center">Send a Report</h1>
        <p className="text-xs text-center text-gray-500 leading-normal tracking-wide -mt-3">
          Please provide accurate details and a clear photo to help authorities
          respond quickly and properly.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Camera */}
          <div className="flex flex-col items-center">
            {!photoPreview ? (
              <div
                onClick={handleOpenCamera}
                className="w-full h-56 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              >
                <span className="text-4xl">📷</span>
                <p className="text-gray-600 mt-2 text-sm font-medium">
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

          {/* Location */}
          <div className="mt-6">
            <label className="block text-xs mb-1">Location</label>
            <input
              {...register("address", { required: "Location is required" })}
              className="w-full rounded-md border p-3 text-xs"
              placeholder="Detecting location..."
              disabled={loadingLocation}
            />
            {errors.address?.message && (
              <p className="text-red-500 text-[10px] mt-1">
                {String(errors.address.message)}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="mt-8">
            <label className="block text-xs mb-1">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-md border p-3 text-xs"
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
            <label className="block text-xs mb-1">Phone Number</label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^63\d{10}$/,
                  message: "Enter a valid PH number (e.g. 639123456789)",
                },
              })}
              className="w-full rounded-md border p-3 text-xs"
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
            <label className="block text-xs mb-1">Incident Severity</label>
            <Select
              onValueChange={(value) =>
                setValue("status", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full rounded-md border p-3 text-xs">
                <SelectValue placeholder="Select severity..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
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
            <label className="block text-xs mb-1">Description / Details</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full rounded-md border p-3 text-xs min-h-[100px]"
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
            className="w-full py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {submitting ? "Sending..." : "Send Report"}
          </button>
        </form>
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
