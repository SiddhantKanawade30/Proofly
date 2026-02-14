import { toast } from "sonner";

interface RateLimitError {
  status: number;
  data?: {
    success?: boolean;
    message?: string;
    retryAfter?: number;
  };
}

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

export function handleRateLimitError(error: any): boolean {
  if (error?.response?.status === 429) {
    const errorData = error.response.data;
    const message = errorData?.message || "Too many requests. Please try again later.";
    const retryAfter = errorData?.retryAfter;

    let fullMessage = message;
    if (retryAfter && typeof retryAfter === "number") {
      const retryTime = formatRetryTime(retryAfter);
      fullMessage = `${message} Try again ${retryTime}.`;
    }

    
    toast.error(fullMessage, {
      duration: 5000,
      position: "top-center",
    });

    return true;
  }
  return false;
}

export function getRateLimitInfo(error: any): RateLimitError | null {
  if (error?.response?.status === 429) {
    return {
      status: 429,
      data: error.response.data,
    };
  }
  return null;
}

export function handleApiError(error: any, genericMessage: string = "An error occurred"): void {
  if (handleRateLimitError(error)) {
    return;
  }

  const errorMessage = error?.response?.data?.message || error?.message || genericMessage;
  toast.error(errorMessage, {
    duration: 4000,
    position: "top-center",
  });
}


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
