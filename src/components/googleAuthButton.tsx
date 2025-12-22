import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { rateLimitHandlers } from "@/lib/rateLimitHandler";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
  handleGoogleLogin?: (credentialResponse: any) => void;
}


export function GoogleAuthButton({ handleGoogleLogin }: GoogleAuthButtonProps) {
  const defaultHandleGoogleLogin = async (credentialResponse: any) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("No credential received from Google");
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        toast.error("Backend URL not configured. Please check your environment variables.");
        console.error("NEXT_PUBLIC_BACKEND_URL is not set");
        return;
      }

      const url = `${backendUrl}/auth/google`;
      console.log("Sending request to:", url);

      const res = await axios.post(
        url,
        { token: credentialResponse.credential },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful! Redirecting...");
        console.log("User:", res.data.user);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url,
      });
      
      if (err.response?.status === 404) {
        const attemptedUrl = err.config?.url || "unknown";
        toast.error(`Backend endpoint not found. Please check your server connection.`);
      } else {
        rateLimitHandlers.auth.handleError(err);
      }
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin || defaultHandleGoogleLogin}
      onError={() => {
        console.log("Login Failed");
        toast.error("Google login failed");
      }}
    />
  );
}
