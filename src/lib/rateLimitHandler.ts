import { toast } from "sonner";

interface RateLimitError {
  status: number;
  data?: {
    success?: boolean;
    message?: string;
    retryAfter?: number;
  };
}

/**
 * Formats the retry time in a human-readable format
 * @param retryAfterTimestamp Unix timestamp when user can retry
 * @returns Formatted time string (e.g., "in 5 minutes" or "at 2:30 PM")
 */
function formatRetryTime(retryAfterTimestamp: number): string {
  const now = Date.now();
  const retryTimeMs = retryAfterTimestamp * 1000;
  const diffMs = retryTimeMs - now;

  if (diffMs <= 0) return "now";

  const minutes = Math.ceil(diffMs / (1000 * 60));
  const hours = Math.ceil(diffMs / (1000 * 60 * 60));

  if (minutes < 60) {
    return `in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return `in ${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const date = new Date(retryTimeMs);
    return `at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
}

/**
 * Checks if an error is a rate limit error and shows appropriate message
 * @param error The error from axios request
 * @returns boolean - true if it was a rate limit error, false otherwise
 */
export function handleRateLimitError(error: any): boolean {
  if (error?.response?.status === 429) {
    const errorData = error.response.data;
    const message = errorData?.message || "Too many requests. Please try again later.";
    const retryAfter = errorData?.retryAfter;

    // Format the full message with retry time if available
    let fullMessage = message;
    if (retryAfter && typeof retryAfter === "number") {
      const retryTime = formatRetryTime(retryAfter);
      fullMessage = `${message} Try again ${retryTime}.`;
    }

    // Show error toast with longer duration for rate limit errors
    toast.error(fullMessage, {
      duration: 5000,
      position: "top-center",
    });

    return true;
  }
  return false;
}

/**
 * Extracts rate limit information from error response
 * @param error The error from axios request
 * @returns Rate limit info object or null
 */
export function getRateLimitInfo(error: any): RateLimitError | null {
  if (error?.response?.status === 429) {
    return {
      status: 429,
      data: error.response.data,
    };
  }
  return null;
}

/**
 * Checks if error is rate limit and shows appropriate message, otherwise shows generic error
 * @param error The error from axios request
 * @param genericMessage Fallback message if not rate limit error
 */
export function handleApiError(error: any, genericMessage: string = "An error occurred"): void {
  // Check for rate limit error first
  if (handleRateLimitError(error)) {
    return;
  }

  // Handle other errors
  const errorMessage = error?.response?.data?.message || error?.message || genericMessage;
  toast.error(errorMessage, {
    duration: 4000,
    position: "top-center",
  });
}

/**
 * Custom hook-like error handler for specific error types
 * Useful for different endpoint types (auth, public, protected)
 */
export const rateLimitHandlers = {
  auth: {
    handleError: (error: any) => {
      if (handleRateLimitError(error)) return true;

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Authentication failed. Please check your credentials.";
      toast.error(message, { duration: 4000 });
      return false;
    },
  },

  public: {
    handleError: (error: any, customMessage?: string) => {
      if (handleRateLimitError(error)) return true;

      const message =
        error?.response?.data?.message ||
        error?.message ||
        customMessage ||
        "Submission failed. Please try again.";
      toast.error(message, { duration: 4000 });
      return false;
    },
  },

  protected: {
    handleError: (error: any, customMessage?: string) => {
      if (handleRateLimitError(error)) return true;

      const message =
        error?.response?.data?.message ||
        error?.message ||
        customMessage ||
        "Operation failed. Please try again.";
      toast.error(message, { duration: 4000 });
      return false;
    },
  },
};
