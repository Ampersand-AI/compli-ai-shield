import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function AuthDialog({
  isOpen,
  onClose,
  initialTab = "signin",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "signin" | "signup";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Sign-in error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      onClose();
      reset();
      toast({
        title: "Success",
        description: "Successfully signed in!",
        variant: "success"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      onClose();
      reset();
      toast({
        title: "Success",
        description: "Check your email for the confirmation link!",
        variant: "success"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      setShowResetPassword(false);
      reset();
      toast({
        title: "Success",
        description: "Password reset link has been sent to your email.",
        variant: "success"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] pt-8">
        {showResetPassword ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setShowResetPassword(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  {...register("email")}
                  type="email"
                  placeholder={touchedFields.email && errors.email ? errors.email.message : "name@example.com"}
                  className={cn(
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    touchedFields.email && errors.email ? "placeholder:text-red-500" : "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    touchedFields.email && errors.email && "border-red-500"
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending reset link..." : "Send Reset Link"}
              </Button>
            </form>
          </div>
        ) : (
          <Tabs defaultValue={initialTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder={touchedFields.email && errors.email ? errors.email.message : "name@example.com"}
                    className={cn(
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      touchedFields.email && errors.email ? "placeholder:text-red-500" : "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                      touchedFields.email && errors.email && "border-red-500"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        touchedFields.password && errors.password && "border-red-500"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touchedFields.password && errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 -mt-1"
                      onClick={() => setShowResetPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder={touchedFields.email && errors.email ? errors.email.message : "name@example.com"}
                    className={cn(
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      touchedFields.email && errors.email ? "placeholder:text-red-500" : "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                      touchedFields.email && errors.email && "border-red-500"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        touchedFields.password && errors.password && "border-red-500"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touchedFields.password && errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={cn(
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        touchedFields.confirmPassword && errors.confirmPassword && "border-red-500"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touchedFields.confirmPassword && errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
} 