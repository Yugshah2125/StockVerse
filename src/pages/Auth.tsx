import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, GamepadIcon, Trophy, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-illustration.jpg";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Email validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Password validation
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password. Please check your credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Email validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Password validation
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/.test(password)) {
      setError("Password must contain at least one uppercase letter or number");
      return;
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    const result = await register(email, password);
    if (!result.success) {
      setError(result.error || "Registration failed");
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card-hover to-card p-8 lg:p-12 animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-profit/10" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 animate-float">
              <img src="/src/assets/logo.png" alt="StockVerse" className="h-12 w-auto" />
              <h1 className="text-2xl font-bold">StockVerse</h1>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Start with{" "}
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent animate-gold-shimmer bg-[length:200%_auto]">
                ₭10L Virtual Cash
              </span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Trade Indian stocks (NSE/BSE), compete in fantasy leagues, and climb the leaderboards. 
              No real Kuberon at risk - just pure gaming excitement meets Indian stock markets.
            </p>

            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center space-y-2">
                <GamepadIcon className="w-8 h-8 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Gamified Trading</p>
              </div>
              <div className="text-center space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-gold" />
                <p className="text-sm text-muted-foreground">Compete & Win</p>
              </div>
              <div className="text-center space-y-2">
                <DollarSign className="w-8 h-8 mx-auto text-profit" />
                <p className="text-sm text-muted-foreground">Virtual Portfolio</p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Stock market gaming interface" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="w-full max-w-md mx-auto animate-scale-in">
          <Card className="border-border/50 bg-card/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Join the Challenge</CardTitle>
              <CardDescription>
                Create an account or sign in to start trading
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="trader@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {error && (
                      <p className="text-sm text-loss">{error}</p>
                    )}
                    
                    <Button 
                      type="submit" 
                      variant="gaming" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Start Trading"}
                    </Button>
                  </form>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Forgot your password?{" "}
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Reset it
                    </Button>
                  </p>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="trader@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {error && (
                      <p className="text-sm text-loss">{error}</p>
                    )}
                    
                    <div className="bg-muted/30 p-4 rounded-lg border border-gold/20">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-gold" />
                        <span className="font-semibold text-gold">Starting Bonus</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get ₭10,00,000 virtual Kuberon to start your Indian stock trading journey
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Claim ₭10L & Start"}
                    </Button>
                  </form>
                  
                  <p className="text-center text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Button variant="link" className="p-0 h-auto text-xs text-primary">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-xs text-primary">
                      Privacy Policy
                    </Button>
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;