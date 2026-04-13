"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebookF, FaGoogle } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoginInput, loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-16">
      <Card className="w-full border-black/5 bg-white/90 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <CardDescription className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            أهلاً بعودتك
          </CardDescription>
          <CardTitle className="text-3xl font-semibold text-zinc-950">
            تسجيل الدخول
          </CardTitle>
          <CardDescription>ادخل إلى حسابك للمتابعة في طيبة</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer gap-2 rounded-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}>
              <FaGoogle aria-hidden="true" className="size-4" />
              {isGoogleLoading ? "جاري التحميل..." : "Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer gap-2 rounded-full"
              onClick={() => signIn("facebook", { callbackUrl })}>
              <FaFacebookF aria-hidden="true" className="size-4" />
              Facebook
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
              <span className="bg-white px-2 text-xs text-muted-foreground">
                أو
              </span>
            </span>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-3"
            noValidate>
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                dir="ltr"
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                dir="ltr"
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full"
              disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
