import { useState } from "react";
import { Briefcase, Mail, Phone, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { auth } from "../lib/api";

interface AuthScreenProps {
  onLogin: (user: any) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      await auth.loginOtp(email, phone);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      setError("");
      const { data } = await auth.verifyOtp(email, phone, otp);
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (otpSent) {
      handleVerifyOtp();
    } else {
      handleRequestOtp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 bg-primary rounded-xl mb-4">
            <Briefcase className="size-6 text-primary-foreground" />
          </div>
          <h1 className="mb-2">Welcome to JobAlert</h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <Tabs defaultValue="login" className="w-full" onValueChange={(v) => {
            setIsLogin(v === 'login');
            setOtpSent(false);
            setOtp("");
            setError("");
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-phone">Phone (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="login-phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="pl-10"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      OTP sent to {email || phone}. Check console for Dev OTP.
                    </p>
                  </div>
                )}

                <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Get OTP')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {/* Reusing same logic for signup as it's just OTP based for now */}
              <div className="space-y-4">
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                {!otpSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp-signup">Enter OTP</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        id="otp-signup"
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="pl-10"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : (otpSent ? 'Verify & Create Account' : 'Sign Up with OTP')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
