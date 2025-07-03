"use client";

import { authClient } from "@/lib/auth-client";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { GithubIcon, Loader } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { useRouter } from "next/navigation";

export default function UserLogin() {
  const [isGitPending, startGitTransaction] = useTransition();
  const [isGooglePending, startGoogleTransaction] = useTransition();
  const [isEmailPending, startEmailTransaction] = useTransition();

  const router = useRouter();

  const [email, setEmail] = useState("");

  function handleGitLogin() {
    startGitTransaction(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("You have successfully Logged In");
          },
          onError: () => {
            toast.error("Invalid server error! Please Try Again");
          },
        },
      });
    });
  }

  function handleGoogleLogin() {
    startGoogleTransaction(async () => {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success("User SUccessfully logged in from Google");
          },
          onError: (error) => {
            toast.error("Invalid server error");
            console.log(error);
          },
        }
      );
    });
  }

  function signInWithEmail() {
    startEmailTransaction(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification email send");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("'Error sending otp");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl mb-1 mt-2 font-semibold">
          Welcome Back
        </CardTitle>
        <CardDescription>
          {" "}
          <div className="mt-3 mb-5 text-sm text-gray-500">
            Login with your Github,Google or Email Account
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className=" space-y-4">
        <Button
          disabled={isGitPending}
          onClick={handleGitLogin}
          variant={"outline"}
          className="w-full px-5 cursor-pointer"
        >
          <GithubIcon />
          {isGitPending ? (
            <>
              <Loader size={4} className=" animate-spin" />
              <span>Loading ...</span>
            </>
          ) : (
            "Continue With GitHub"
          )}
        </Button>
        <Button
          variant={"outline"}
          disabled={isGooglePending}
          onClick={handleGoogleLogin}
          className="w-full px-5 cursor-pointer mt-1"
        >
          <FaGoogle />
          {isGooglePending ? (
            <>
              <Loader size={4} className=" animate-spin" />
              <span>Loading ...</span>
            </>
          ) : (
            "Continue With Google"
          )}
        </Button>
        <div
          className="relative w-full text-center text-sm after:absolute after:inset-0 after:top-3 after:z-0 after:flex after:items-center
          after:border-t after:border-border
          "
        >
          <span className=" relative bg-card z-10 px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="space-y-4">
          <div className="space-y-2 py-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <Button
            disabled={isEmailPending}
            onClick={signInWithEmail}
            className="w-full mb-7 cursor-pointer"
          >
            {isEmailPending ? (
              <>
                <Loader size={4} className=" animate-spin" />
                <span>Loading ...</span>
              </>
            ) : (
              "Continue With Email"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
