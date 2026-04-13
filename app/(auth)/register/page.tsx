"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFacebookF, FaGoogle } from "react-icons/fa6";
import { Eye, EyeOff } from "lucide-react";

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
import { registerUser } from "@/lib/actions/user.actions";
import { RegisterInput, registerSchema } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError("");

    const result = await registerUser(data);

    if (!result.success) {
      setError(result.error || "حدث خطأ ما");
      setIsLoading(false);
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-16">
      <Card className="w-full border-border bg-card/95 shadow-lg backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <CardDescription className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            ابدأ الآن
          </CardDescription>
          <CardTitle className="text-3xl font-semibold text-foreground">
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription>انضم إلى طيبة وابدأ التسوق</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer gap-2 rounded-full border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}>
              <FaGoogle aria-hidden="true" className="size-4" />
              {isGoogleLoading ? "جاري التحميل..." : "Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer gap-2 rounded-full border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => signIn("facebook", { callbackUrl: "/" })}>
              <FaFacebookF aria-hidden="true" className="size-4" />
              Facebook
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">
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
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                type="text"
                placeholder="محمد أحمد"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              ) : null}
            </div>

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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  dir="ltr"
                  className="pl-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  className="absolute inset-y-0 left-2 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  dir="ltr"
                  className="pl-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "إخفاء تأكيد كلمة المرور"
                      : "إظهار تأكيد كلمة المرور"
                  }
                  className="absolute inset-y-0 left-2 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full"
              disabled={isLoading}>
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
