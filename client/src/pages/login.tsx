import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signUpSchema, type LoginData, type SignUpData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      console.log("Making API request with data:", data);
      const response = await apiRequest("POST", "/api/auth/login", data);
      const result = await response.json();
      console.log("API response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Login successful, saving token:", data.token);
      localStorage.setItem("auth_token", data.token);
      // Trigger login event
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      // Trigger login event
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      setError("فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى");
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    setError("");
    console.log("Submitting login data:", data);
    loginMutation.mutate(data);
  };

  const onSignUpSubmit = (data: SignUpData) => {
    setError("");
    console.log("Submitting signup data:", data);
    signUpMutation.mutate(data);
  };

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginSubmit(onLoginSubmit)(e);
  };

  const handleSignUpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUpSubmit(onSignUpSubmit)(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 sm:pb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isSignUp
              ? "أدخل بياناتك لإنشاء حساب جديد"
              : "نظام إدارة حجوزات ملعب كرة القدم المصغر"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUpFormSubmit : handleLoginFormSubmit} method="post" className="space-y-4 sm:space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isSignUp ? (
              // Login Form
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-right flex items-center gap-2">
                    <User className="w-4 h-4" />
                    اسم المستخدم
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    {...registerLogin("username")}
                    className="text-right"
                    placeholder="أدخل اسم المستخدم"
                    autoComplete="username"
                  />
                  {loginErrors.username && (
                    <p className="text-sm text-red-600 text-right">{loginErrors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...registerLogin("password")}
                      className="text-right pr-10"
                      placeholder="أدخل كلمة المرور"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-red-600 text-right">{loginErrors.password.message}</p>
                  )}
                </div>
              </>
            ) : (
              // Sign Up Form
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-right flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم الأول
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    {...registerSignUp("firstName")}
                    className="text-right"
                    placeholder="أدخل اسمك الأول"
                  />
                  {signUpErrors.firstName && (
                    <p className="text-sm text-red-600 text-right">{signUpErrors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-right flex items-center gap-2">
                    <User className="w-4 h-4" />
                    اسم الأب
                  </Label>
                  <Input
                    id="fatherName"
                    type="text"
                    {...registerSignUp("fatherName")}
                    className="text-right"
                    placeholder="أدخل اسم والدك"
                  />
                  {signUpErrors.fatherName && (
                    <p className="text-sm text-red-600 text-right">{signUpErrors.fatherName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...registerSignUp("phone")}
                    className="text-right"
                    placeholder="07xxxxxxxxx"
                  />
                  {signUpErrors.phone && (
                    <p className="text-sm text-red-600 text-right">{signUpErrors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-right flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      {...registerSignUp("password")}
                      className="text-right pr-10"
                      placeholder="أدخل كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signUpErrors.password && (
                    <p className="text-sm text-red-600 text-right">{signUpErrors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-right flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    تأكيد كلمة المرور
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registerSignUp("confirmPassword")}
                    className="text-right"
                    placeholder="أعد إدخال كلمة المرور"
                  />
                  {signUpErrors.confirmPassword && (
                    <p className="text-sm text-red-600 text-right">{signUpErrors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold"
              disabled={isSignUp ? signUpMutation.isPending : loginMutation.isPending}
            >
              {isSignUp
                ? (signUpMutation.isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب")
                : (loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول")
              }
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp
                  ? "لديك حساب بالفعل؟ تسجيل الدخول"
                  : "ليس لديك حساب؟ إنشاء حساب جديد"
                }
              </button>
            </div>
          </form>

          {!isSignUp && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>نظام محمي بتشفير عالي الأمان</span>
                </div>
                <p>للإدارة فقط</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}