"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn, fetchAPI } from "@/lib/utils";
import { Card } from "@/ui/card";
import { toast } from "@/ui/toast";
import { Icons } from "@/components/icons";
import { User } from "types";
import { useAuth } from "@/lib/auth-client";

const userEmailSchema = z.object({
  email: z.string().min(3).max(32),
});

type FormData = z.infer<typeof userEmailSchema>;

export function UserEmailForm({ user }: { user: User }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userEmailSchema),
    defaultValues: {
      email: user.email,
    },
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { setUser } = useAuth();

  async function onChangeSubmit(data: FormData) {
    if (data.email === user.email) {
      return toast({
        title: "No changes detected.",
        message: "Your email is already set to this value.",
        type: "default",
      });
    }

    setIsSaving(true);

    const form = new FormData();
    form.append("email", data.email);

    const success = await fetchAPI("/auth/update-profile", {
      method: "PATCH",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success === true) {
          setUser((prev) => ({ ...prev, email: data.email }));
          return true;
        }

        return false;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });

    setIsSaving(false);

    if (!success) {
      return toast({
        title: "Something went wrong.",
        message: "Your email was not updated. Please try again.",
        type: "error",
      });
    }

    toast({
      message: "Your email has been updated.",
      type: "success",
    });
  }

  async function onResendSubmit() {
    setIsSending(true);

    const form = new FormData();
    form.append("email", user.email);

    const success = await fetchAPI("/auth/resend-verification-email", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success === true) {
          return true;
        }

        return false;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });

    setIsSending(false);

    if (!success) {
      return toast({
        title: "Something went wrong.",
        message: "Your verification email could not be sent. Please try again.",
        type: "error",
      });
    }

    toast({
      message: "Your verification email has been sent.",
      type: "success",
    });
  }

  return (
    <form onSubmit={handleSubmit(onChangeSubmit)}>
      <Card>
        <Card.Header>
          <Card.Title>Your Email</Card.Title>
          <Card.Description>Enter your email address.</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="name">
              Email
            </label>

            {/* Put input and verified next to each other */}
            <div className="flex flex-col lg:flex-row">
              <input
                id="email"
                className="my-0 mb-2 block h-9 w-full max-w-[350px] rounded-md border border-slate-300 py-2 px-3 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1"
                size={32}
                name="email"
                {...register("email")}
              />
              <div className="flex ml-2 lg:self-center">
                {user.email_verified ? <Icons.check className="text-green-500" /> : <Icons.warning className="text-red-500" />}
                <span className="ml-2 text-sm text-slate-500 self-center">{user.email_verified ? "Verified" : "Not Verified"}</span>
              </div>
            </div>

            {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
        </Card.Content>
        <Card.Footer>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
            <button
              type="submit"
              className={cn(
                "w-fit relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                {
                  "cursor-not-allowed opacity-60": isSaving || isSending,
                }
              )}
              disabled={isSaving || isSending}
            >
              {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              <span>Save</span>
            </button>
            {!user.email_verified && (
              <button
                type="button"
                className={cn(
                  "w-fit relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                  {
                    "cursor-not-allowed opacity-60": isSaving || isSending,
                  }
                )}
                onClick={onResendSubmit}
                disabled={isSaving || isSending}
              >
                {isSending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                <span>Resend Verification Email</span>
              </button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </form>
  );
}
