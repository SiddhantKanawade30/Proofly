import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface GoogleAuthButtonProps {
  handleGoogleLogin?: (credentialResponse: any) => void;
}


export function GoogleAuthButton({ handleGoogleLogin }: GoogleAuthButtonProps) {
  const defaultHandleGoogleLogin = async (credentialResponse: any) => {
    try {
      if (!credentialResponse?.credential) {
        alert("No credential received from Google");
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        alert("Backend URL not configured. Please check your environment variables.");
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
        alert("Login successful!");
        console.log("User:", res.data.user);
        window.location.href = "/";
      } else {
        alert("Login failed: No token received");
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
        alert(`Backend endpoint not found (404). Please check:\n1. Backend server is running\n2. URL is correct: ${attemptedUrl}\n3. Route is properly registered`);
      } else {
        const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || "Google login failed";
        alert(`Login failed: ${errorMessage}`);
      }
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin || defaultHandleGoogleLogin}
      onError={() => {
        console.log("Login Failed");
        alert("Google login failed");
      }}
    />
  );
}
