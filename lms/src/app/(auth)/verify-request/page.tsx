"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [emailPending, startTransistion] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isComplete = otp.length === 6;
  const email = searchParams.get("email") as string;

  if (email === "" || email === undefined) {
    router.push("/");
  }

  function verifyOtp() {
    startTransistion(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verification successFult");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error?.error?.message || "Email expired");
            console.error(error);
          },
        },
      });
    });
  }

  return (
    <div className="h-full w-full text-center overflow-hidden">
      <Card className="w-md">
        <CardHeader>
          <CardTitle className="font-bold text-3xl pb-2 bt-3">
            Please Check Your Email
          </CardTitle>
          <CardDescription className=" font-medium text-md">
            {" "}
            We have send a Verification email code to your email address.
            Pleasse open the email and pasete the code below to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 items-center justify-center w-full">
            <InputOTP
              className="gap-1"
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className=" text-sm tracking-wider font-medium text-muted-foreground">
              Enter the 6-digit code send to your email
            </p>
          </div>
          <Button
            onClick={verifyOtp}
            disabled={emailPending || !isComplete}
            className="w-full"
          >
            {emailPending ? (
              <>
                <Loader2 className="animate-spin" size={4} />
                Loading....{" "}
              </>
            ) : (
              "verify Account"
            )}
            Verify Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
