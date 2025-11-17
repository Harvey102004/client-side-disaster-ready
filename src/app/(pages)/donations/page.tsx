"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BiSolidDonateHeart } from "react-icons/bi";
import Image from "next/image";
import { successToast, errorToast } from "@/app/components/toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const donationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  amount: z.number().min(1, "Amount must be at least 1"),
  description: z.string().min(3, "Description is required"),
  type: z.enum(["card", "gcash", "paymaya", "grab_pay"]),
  card_number: z.string().optional(),
  exp_month: z.number().optional(),
  exp_year: z.number().optional(),
  cvc: z.number().optional(),
  captcha: z.string(),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function DonationsPage() {
  const [loading, setLoading] = useState(false);
  const [cardInputDisplay, setCardInputDisplay] = useState("");

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: undefined,
      description: "",
      type: "gcash",
      card_number: "",
      exp_month: undefined,
      exp_year: undefined,
      cvc: undefined,
      captcha: "",
    },
  });
  const type = watch("type");

  const onSubmit = async (formData: DonationFormData) => {
    setLoading(true);

    try {
      // Prepare payload
      const payload: any = {
        name: formData.name,
        email: formData.email,
        amount: formData.amount! * 100,
        description: formData.description,
        type: formData.type,
        return_url: "https://client-side-disaster-ready.vercel.app/success",
      };

      if (formData.type === "card") {
        payload.details = {
          card_number: formData.card_number!.replace(/\D/g, ""),
          exp_month: Number(formData.exp_month),
          exp_year: Number(formData.exp_year),
          cvc: formData.cvc!.toString(),
        };
      }

      // Execute reCAPTCHA
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        errorToast("Oops!", "Captcha verification failed. Try again.");
        return;
      }

      const payloadWithCaptcha = { ...payload, captcha: token };

      // Send donation request
      const { data, status } = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/donation.php",
        payloadWithCaptcha,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Backend error handling
      if (status !== 200 || data.error) {
        console.error("Donation error:", data);
        errorToast("Donation Failed!", ` ${data.error || "Unknown error"}`);
        return;
      }

      const redirectUrl =
        data?.attach_result?.data?.attributes?.next_action?.redirect?.url;

      if (redirectUrl) {
        // For GCash / PayMaya / GrabPay
        successToast("Success!", "Redirecting to payment page...");
        window.location.href = redirectUrl;
      } else if (formData.type === "card") {
        // For CARD payments (no redirect from PayMongo)
        successToast("Payment successful!");
        window.location.href =
          "https://client-side-disaster-ready.vercel.app/success";
      } else {
        // Fallback
        successToast("Success!", "Donation created successfully!");
      }
    } catch (err: any) {
      errorToast("Oops!", "Error sending donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md md:hidden mx-auto p-4 pb-14">
      {loading && (
        <div className="fixed inset-0 flex  items-center justify-center z-40 ">
          <div className="flex flex-col md:gap-5 gap-4 items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-7 w-7 md:h-10 md:w-10 border-4 border-gray-300 border-t-dark-blue"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center px-2.5">
        <BiSolidDonateHeart className="text-3xl mb-2" />
        <h1 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-300">
          Your Help Matters
        </h1>
        <p className="text-xs text-center text-gray-600 dark:text-zinc-400">
          Your small help can give hope and support to people in need. Every
          donation matters.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mt-10 px-4"
        noValidate
      >
        <div>
          <label className="text-xs">Full Name *</label>
          <input
            type="text"
            id="fullName"
            autoComplete="off"
            placeholder="Enter your name"
            {...register("name")}
            className="w-full  border  border-gray-400 dark:border-gray-600 outline-none rounded mt-2 text-xs p-3"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-[10px] mt-2">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs">Email *</label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Enter your email"
            {...register("email")}
            className="w-full  border  border-gray-400 dark:border-gray-600  outline-none rounded mt-2 text-xs p-3"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-2">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs">Amount *</label>
          <input
            type="number"
            autoComplete="off"
            placeholder="Enter donation amount"
            {...register("amount", { valueAsNumber: true })}
            className="w-full  border  border-gray-400 dark:border-gray-600  outline-none rounded mt-2 text-xs p-3"
            disabled={loading}
          />
          {errors.amount && (
            <p className="text-red-500 text-[10px] mt-2">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs">Description *</label>
          <textarea
            placeholder="Description"
            {...register("description")}
            className="w-full  border  border-gray-400 dark:border-gray-600  outline-none rounded mt-2 text-xs p-3"
            rows={7}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-red-500 text-[10px] mt-2">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="">
          <p className="text-xs">Choose Payment Method * </p>
          <div className="grid mt-3 grid-cols-3 justify-center gap-2 ">
            {[
              {
                id: "card",
                label: "Card",
                icon: <Image src={`/logos/card.png`} alt="cards" fill />,
              },
              {
                id: "gcash",
                label: "GCash",
                icon: <Image src={`/logos/gcash.png`} alt="cards" fill />,
              },
              {
                id: "paymaya",
                label: "PayMaya",
                icon: (
                  <Image
                    src={`/logos/paymaya.png`}
                    alt="cards"
                    className="object-cover object-center"
                    fill
                  />
                ),
              },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() =>
                  setValue("type", option.id as "card" | "gcash" | "paymaya", {
                    shouldValidate: true,
                  })
                }
                className={`flex flex-col cursor-pointer items-center  border px-8 py-2 rounded-lg ${
                  watch("type") === option.id
                    ? "border-blue-500 bg-blue-50 dark:bg-transparent"
                    : "border-gray-300 dark:border-gray-500"
                }`}
              >
                <div
                  className={`flex flex-col items-center  rounded-lg p-3  transition-all h-12 relative w-12`}
                >
                  {option.icon}
                </div>

                <p className="text-[11px] mt-2 font-medium text-gray-700 dark:text-zinc-400">
                  {option.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden input for selected type */}
        <input type="hidden" {...register("type")} />

        {type === "card" && (
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs">Card Number *</label>
            <input
              type="text"
              placeholder="Enter your card number"
              autoComplete="off"
              value={cardInputDisplay}
              maxLength={19} // 16 digits + 3 dashes
              onChange={(e) => {
                // alisin lahat ng non-digit
                const rawValue = e.target.value.replace(/\D/g, "").slice(0, 16);
                // format every 4 digits
                const formatted = rawValue
                  .replace(/(.{4})/g, "$1-")
                  .slice(0, 19);
                setCardInputDisplay(formatted);

                // update hidden input para sa backend
                setValue("card_number", rawValue as string, {
                  shouldValidate: true,
                });
              }}
              className="w-full p-3 text-xs  border-gray-400 dark:border-gray-600  outline-none border rounded"
              disabled={loading}
            />
            <input
              type="hidden"
              {...register("card_number")}
              value={watch("card_number") || ""}
            />
            {errors.card_number && (
              <p className="text-red-500 text-[10px] mt-2">
                {errors.card_number.message}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <p className="text-xs">Expiration Date:</p>
              <div className="flex gap-2 ">
                {/* Month */}

                <div className="flex flex-col w-1/3">
                  <label className="text-xs mb-2"> Month *</label>
                  <Select
                    onValueChange={(val) => setValue("exp_month", Number(val))}
                    defaultValue="1"
                  >
                    <SelectTrigger className="w-full !bg-transparent  outline-none p-2  border-gray-400 dark:border-gray-600 border rounded text-xs">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { label: "Jan", value: 1 },
                        { label: "Feb", value: 2 },
                        { label: "Mar", value: 3 },
                        { label: "Apr", value: 4 },
                        { label: "May", value: 5 },
                        { label: "Jun", value: 6 },
                        { label: "Jul", value: 7 },
                        { label: "Aug", value: 8 },
                        { label: "Sep", value: 9 },
                        { label: "Oct", value: 10 },
                        { label: "Nov", value: 11 },
                        { label: "Dec", value: 12 },
                      ].map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value.toString()}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div className="w-1/3 flex flex-col ">
                  <label className="text-xs mb-2">Year *</label>
                  <Select
                    onValueChange={(val) => setValue("exp_year", Number(val))}
                    defaultValue="25"
                  >
                    <SelectTrigger className="w-full  !bg-transparent  border-gray-400 dark:border-gray-600  outline-none p-2 border rounded text-xs">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => 2025 + i).map(
                        (year) => (
                          <SelectItem
                            key={year}
                            value={(year % 100).toString()}
                          >
                            {year}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* CVC */}
                <div className="w-1/3 flex flex-col">
                  <label className="text-xs mb-2">CVC *</label>
                  <input
                    type="number"
                    autoComplete="off"
                    placeholder="eg.(123) "
                    {...register("cvc", {
                      valueAsNumber: true,
                      max: 999,
                      min: 0,
                    })}
                    maxLength={3}
                    className="w-full  border-gray-400  outline-none dark:border-gray-600 p-2.5 border text-xs rounded"
                    onInput={(e: any) => {
                      if (e.target.value.length > 3)
                        e.target.value = e.target.value.slice(0, 3);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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

        <button
          type="submit"
          className={`bg-blue-600 text-white text-xs mt-2 p-3 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Donate"}
        </button>
      </form>
    </div>
  );
}
