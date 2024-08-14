"use client";
import Link from "next/link";
import { instance } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { util, z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/, {
      message: "Invalid Password.",
    }),
});

export default function LoginForm() {
  const router = useRouter();
  const [success, setSuccess] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function toastMessage(message: string, status: number) {
    if (status === 200 || status === 201) {
      toast(message, {
        className: "bg-green-500",
        description: "Redirecting to your dashboard...",
      });
    } else {
      toast(message, {
        className: "bg-red-500 text-white",
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    }
  }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const jsonValues = JSON.stringify(values);
      const res = await instance.post("users/login", jsonValues);
      const { access_token } = res.data;
      console.log(res);
      localStorage.setItem("userAccessToken", access_token);
      toastMessage("User logged in successfully", res.status);
      if (res.status === 200 || res.status === 201) {
        setTimeout(() => router.push("users/dashboard"), 2000);
      }
    } catch (error: any) {
      console.log(error);
      toastMessage(error?.response?.data?.error, error?.response?.status);
    }
  }
  return (
    <div className="flex bg-green-800 h-screen justify-center items-center overflow-auto">
      <Card className="flex flex-col mx-auto my-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your existing account credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <Button variant="outline" className="w-full mt-3">
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Doesn't have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
