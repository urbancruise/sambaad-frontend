"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/src/features/auth/slices/authSlice";

import { login } from "@/src/features/auth/services/auth.service";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    dispatch(loginStart());
    setIsLoading(true);

    try {
      const response = await login(data.username, data.password);
      const user = response.data?.data?.user || response.data?.user;

      if (!user || !user.role) {
        throw new Error("Authentication succeeded, but no user data or role was found in response.");
      }

      dispatch(loginSuccess({ user }));

      switch (user.role) {
        case "ADMIN":
          router.replace("/tasks/admin");
          break;
        case "MANAGER":
          router.replace("/tasks/manager");
          break;
        case "TEAM_LEAD":
          router.replace("/teamlead/dashboard");
          break;
        case "EMPLOYEE":
          router.replace("/employee/dashboard");
          break;
        default:
          router.replace("/");
      }
    } catch (err: any) {
      dispatch(loginFailure());
      const message = err.response?.data?.message || err.message || "Invalid username or password.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      {/* Container Box */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-visible flex flex-col md:flex-row min-h-[600px] relative">
        
        {/* LEFT SIDE: Branding Banner */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-600 to-emerald-500 text-white flex-col justify-between p-12 text-center relative overflow-hidden rounded-l-3xl">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl translate-x-10 translate-y-10" />

          <div className="my-auto space-y-8 z-10">
            <img
              src="/assets/sambad.png"
              className="w-auto mx-auto object-contain transition-all duration-300 hover:scale-105 drop-shadow-md"
              alt="Sambad Logo"
            />
            
            <div className="space-y-3">
              <div className="inline-flex flex-col items-center gap-1 bg-white/15 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles size={19} className="text-emerald-200 animate-pulse" />
                  <p className="text-white text-sm font-semibold tracking-wide uppercase">
                    The Success Network
                  </p>
                </div>
                <p className="text-emerald-100 text-xs font-medium">
                  By Urban Cruise
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 justify-center max-w-sm mx-auto">
                {[
                  "Messaging",
                  "Performance",
                  "Meeting",
                  "Workspaces",
                  "Task Management",
                  "Documentation"
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10 hover:bg-white/20 transition-all duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-6 text-emerald-100/80 z-10">
            <p className="text-xs font-light tracking-wide">
              © 2026 SAMVAAD. All rights reserved.
            </p>
            <p className="text-xs mt-0.5">
              Powered by <span className="font-semibold text-white">Urban Cruise</span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Authentication Form */}
        <section className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-r-3xl relative p-6 pt-24 md:pt-20">
          
          {/* Floating Logo Header */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-gray-100 shadow-xl p-4 w-44 h-28 flex flex-col items-center justify-center z-20">
            <img 
              src="/assets/urbanlogo1.png"
              alt="Urban Cruise" 
              className="h-full w-full object-contain drop-shadow-md"
            />
          </div>

          <div className="w-full max-w-md space-y-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                Welcome to SamVaad
              </h1>
              <p className="text-gray-500 text-sm flex items-center justify-center md:justify-start gap-2">
                <span>Sign in to your workspace dashboard</span>
                <ArrowRight size={14} className="text-green-600 animate-pulse" />
              </p>
            </div>

            {/* Error Message Alert Box */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 transition-all animate-in fade-in duration-300">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Input Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 tracking-wider uppercase">username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    {...register("username", { required: "username is required" })}
                    type="text"
                    placeholder="username"
                    className={`w-full border ${errors.username ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-green-100 focus:border-green-500'} rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Password</label>
                  <a href="#" className="text-xs font-semibold text-green-600 hover:text-green-700 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    {...register("password", { required: "Password is required" })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full border ${errors.password ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-green-100 focus:border-green-500'} rounded-xl pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-green-600/10 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}