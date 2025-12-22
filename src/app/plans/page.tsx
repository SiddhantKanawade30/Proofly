"use client";

import { Check, X } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PlanCard = ({
  name,
  price,
  badge,
  features,
  limitations,
  ctaText,
  ctaDisabled,
  onCtaClick,
  isPrimary,
  isCurrent,
}) => {
  return (
    <div
      className={`relative flex flex-col p-6 rounded-lg border transition-all duration-200 ${
        isPrimary
          ? "border-violet-500 shadow-sm bg-white dark:bg-neutral-950"
          : "border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-950"
      }`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-md text-xs font-medium border ${
            isPrimary
              ? "bg-violet-500 text-white border-violet-500"
              : "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
          }`}
        >
          {badge}
        </div>
      )}

      <div className="mb-6 mt-2">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
          {name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {price}
          </span>
          {price !== "₹0" && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              / month
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow mb-6">
        <ul className="space-y-2.5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {feature}
              </span>
            </li>
          ))}
          {limitations &&
            limitations.map((limitation: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <X className="w-4 h-4 text-neutral-400 dark:text-neutral-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-500 dark:text-neutral-500">
                  {limitation}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {isCurrent && (
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 rounded border border-violet-200 dark:border-violet-800">
            Current plan
          </span>
        </div>
      )}

      <button
        onClick={onCtaClick}
        disabled={ctaDisabled}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          isPrimary
            ? "bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {ctaText}
      </button>
    </div>
  );
};

export default function PlansPage() {
  const currentPlan = "FREE";

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handelPayment = async () => {
    const response = await axios.post(
      `${BACKEND_URL}/payments/create-order`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    var options = {
      key: response.data.keyId, // Enter the Key ID generated from the Dashboard
      amount: response.data.amount, // Amount is in currency subunits.
      currency: "INR",
      name: "Testimonials", //your business name
      description: "Test Transaction",
      // "image": "https://example.com/your_logo",
      order_id: response.data.orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response: any) {
        try {
          // Send payment details to backend for verification
          const verifyResponse = await axios.post(
            `${BACKEND_URL}/payments/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (verifyResponse.data.success) {
            alert("Payment successful! Your plan has been upgraded.");
            // Redirect or refresh the page
            window.location.reload();
          }
        } catch (error) {
          console.error("Verification error:", error);
          alert("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: response.data.name || "",
        email: response.data.email || "",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      badge: "Free Forever",
      features: [
        "Create up to 2 video testimonials",
        "Create up to 5 text testimonials per campaign",
        "Unlimited campaigns",
        "Basic testimonial embed widget",
        "Email notifications",
      ],
      limitations: ["No custom branding", "No advanced analytics"],
      ctaText: "Current Plan",
      ctaDisabled: currentPlan === "FREE",
      onCtaClick: () => {},
      isPrimary: false,
      isCurrent: currentPlan === "FREE",
    },
    {
      name: "Premium",
      price: "₹499",
      badge: "Most Popular",
      features: [
        "Unlimited video testimonials",
        "Unlimited text testimonials",
        "Unlimited campaigns",
        "Custom branding (logo & colors)",
        "Advanced analytics dashboard",
        "Priority support",
        "Remove watermark",
      ],
      limitations: null,
      ctaText: "Upgrade to Premium",
      ctaDisabled: false,
      onCtaClick: handelPayment,
      isPrimary: true,
      isCurrent: currentPlan === "PREMIUM",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Collect testimonials that build trust and convert users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <PlanCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
