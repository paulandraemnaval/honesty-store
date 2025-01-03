"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import SignInForm from "./SignInForm";
const AuthForm = () => {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setIsProcessing(true);

      const request = await fetch("/api/admin/signin", {
        method: "POST",
        body: formData,
      });
      const data = await request.json();
      if (request.ok) {
        toast.success("Login successful!", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        console.log(data.message);
        setIsCompleted(true);
        router.replace("/admin/user");
        console.log("Login successful.");
      } else {
        toast.error(`Login failed. Check username or password`, {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
        console.log(data.message);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.", {
        duration: 3000,
        style: {
          fontSize: "1.2rem",
          padding: "16px",
        },
      });
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-2 min-w-[30dvw] custom_shadow rounded-md">
      <h1 className="text-center font-bold text-[2rem] bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">
        Honesty Store
      </h1>
      <SignInForm
        handleSignIn={handleSignIn}
        isProcessing={isProcessing}
        isCompleted={isCompleted}
      />

      <p className="underline text-center mb-1 cursor-pointer">
        Forgot Password?
      </p>
    </div>
  );
};

export default AuthForm;
