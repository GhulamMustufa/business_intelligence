"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { setAuthCookie } from "../actions/auth";

export default function LoginPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await setAuthCookie(data.token);
        toast.success("Successfully signed in!");
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("SignIn Error:", err);
      toast.error("An error occurred during sign in. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast.error("Google login is disabled for now.");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 relative w-full overflow-y-auto">
      {/* Atmospheric Background Shader */}
      <div 
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-50"
        style={{
          background: "radial-gradient(circle at 15% 20%, #171f33 0%, transparent 45%), radial-gradient(circle at 85% 80%, #0b1326 0%, transparent 45%)"
        }}
      />
      
      {/* Main Content Container */}
      <main className="w-full max-w-[440px] relative z-10 my-auto shrink-0">
        {/* Header / Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <Image src="/logo.png" alt="BizRadar Logo" width={40} height={40} className="object-contain" />
            <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">BizRadar</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Accelerate your enterprise intelligence.</p>
        </div>

        {/* Login Card */}
        <div className="glass-card ai-glow rounded-xl p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-md text-headline-md text-on-surface">Welcome back</h2>
            <p className="font-body-md text-body-md text-outline">Please enter your details to sign in.</p>
          </div>

          {/* Social Login */}
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-12 flex items-center justify-center gap-3 bg-surface-container-high hover:bg-surface-container-highest transition-all border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface group"
          >
            <svg className="group-hover:scale-110 transition-transform" height="18" viewBox="0 0 18 18" width="18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"></path>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"></path>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"></path>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"></path>
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-outline-variant flex-1 opacity-50"></div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">or continue with email</span>
            <div className="h-px bg-outline-variant flex-1 opacity-50"></div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSignIn} noValidate>
            <div className="flex flex-col gap-2">
              <label className={`font-label-sm text-label-sm uppercase ${focusedInput === 'email' ? 'text-primary' : 'text-on-surface-variant'}`}>
                Email Address
              </label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-outline/50" 
                placeholder="name@company.com" 
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className={`font-label-sm text-label-sm uppercase ${focusedInput === 'password' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  Password
                </label>
                <a className="font-body-md text-body-md text-primary hover:text-primary-container transition-colors" href="#">Forgot password?</a>
              </div>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-outline/50" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 mt-2 bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm rounded-lg transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN TO FORGE'}
              {!isLoading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <p className="text-center mt-10 font-body-md text-body-md text-outline">
          Don't have an account? 
          <a className="text-primary font-semibold hover:text-primary-container transition-colors ml-1" href="/signup">Sign up for a free trial</a>
        </p>
      </main>

      {/* Decorative Illustration (Bento Style Floating Detail) */}
      <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-72 h-auto overflow-hidden pointer-events-none">
        <div className="glass-card w-full rounded-xl p-6 border-outline-variant/30 flex flex-col gap-6 opacity-30">
          <div className="aspect-video rounded bg-surface-container-highest overflow-hidden relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADUsPISaiQ8KZpONb0CFQNLWdl4MAZ7rccBpsXTXKNhL01IbuyvFIoq0a4YdajL3qzVQ2Usfn0pHeGNXqk2F-a1bGbBvKDEi7-wIXExBIfxdzWLmfiCvaIPf_aZauedG4MHVHQmg9rTP1tNXhfmw9EG8In481ZYCqZcjfsWwaYo07TvV6opUGJWfFTcxNCWYrA7SZd23DklJF1kCwl5b395Z6yTcXudCjuf0a4ShpfObcUTwCBJ1mVBg" 
              alt="A macro close-up of a high-tech microprocessor"
              fill
              className="object-cover grayscale"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-2 w-3/4 bg-primary/20 rounded"></div>
            <div className="h-2 w-1/2 bg-outline/30 rounded"></div>
            <div className="h-2 w-2/3 bg-outline/30 rounded"></div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10"></div>
            <div className="h-4 w-20 bg-outline/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
