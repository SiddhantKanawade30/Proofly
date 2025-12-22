"use client"
import { GalleryVerticalEnd, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GoogleAuthButton } from "@/components/googleAuthButton"
import axios from "axios"
import { useRouter } from "next/navigation"
import { rateLimitHandlers } from "@/lib/rateLimitHandler"
import { toast } from "sonner"
import { useState } from "react"

 

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
  
    try {
      if (!name || !email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      setIsLoading(true);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        name,
        email,
        password
      });

      if(res.status === 201) {
        toast.success("Account created successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      } else {
        toast.error("Failed to create account");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      rateLimitHandlers.auth.handleError(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Testimonials</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Testimonials</h1>
            <FieldDescription>
              Already have an account? <a href="/signin">Sign in</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </Field>
          
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="flex justify-center">
            <GoogleAuthButton />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
