"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale, Eye, EyeOff, ArrowLeft, User, Lock, Mail, Phone, Shield, Sparkles, CheckCircle, AlertTriangle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed. Please check your credentials.")
      }

      const data = await response.json()
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)

      // Fetch user groups
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/`, {
        headers: {
          "Authorization": `Bearer ${data.access}`,
          "Content-Type": "application/json",
        },
      })

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details")
      }

      const userData = await userResponse.json()
      const groups = (userData.groups || []).map((group: string | { name: string }) => 
        typeof group === 'string' ? group.toLowerCase() : group.name.toLowerCase()
      );


      if (!groups.includes("advocates") && !groups.includes("client")) {
        toast({
          title: "Access Denied",
          description: "Only advocates and clients can login here.",
          variant: "destructive",
        })
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setIsLoading(false)
        return
      }

      toast({
        title: "Success",
        description: "Logged in successfully!",
      })

      if (groups.includes("client")) {
        navigate("/client-dashboard")
      } else if (groups.includes("advocates")) {
        navigate("/dashboard")
      }

    } catch (error: any) {
      console.error("Login Error:", error); // Debug: Log any errors
      toast({
        title: "Error",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Shield, text: "Secure & Encrypted" },
    { icon: CheckCircle, text: "Trusted Platform" },
    { icon: Sparkles, text: "Premium Features" },
  ]


    return (
    <div className="min-h-screen relative overflow-hidden bg-sky-50">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/10 via-sky-200/10 to-white/10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-sky-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-300/15 to-sky-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-300/10 to-sky-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
          {/* First Logo - Original Size */}
{/* Logo 1 - Top Left */}
<div className="absolute top-10 left-10 w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl rotate-12 animate-float shadow-lg flex items-center justify-center p-2">
  <img 
    src="src/assets/Star_Health_and_Allied_Insurance.svg.png" 
    alt="Awfis Logo" 
    className="w-full h-full object-contain"
  />
</div>

{/* Logo 2 - Bottom Left */}
<div className="absolute bottom-25 left-20 w-20 h-20 bg-gradient-to-br from-sky-100/50 to-blue-100/50 backdrop-blur-sm rounded-2xl animate-float delay-300 shadow-lg flex items-center justify-center p-2">
  <img 
    src="src/assets/idfc-removebg-preview.png" 
    alt="EaseMyTrip Logo" 
    className="w-full h-full object-contain"
  />
</div>

{/* Logo 3 - Middle Right */}
<div className="absolute top-1/3 right-10 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl -rotate-45 animate-float delay-600 shadow-lg flex items-center justify-center p-2">
  <img 
    src="src/assets/eazydiner.png" 
    alt="EazyDiner Logo" 
    className="w-full h-full object-contain"
  />
</div>

{/* Logo 4 - Top Right */}
<div className="absolute top-16 right-16 w-20 h-20 bg-gradient-to-br from-amber-100/50 to-orange-100/50 backdrop-blur-sm rounded-2xl rotate-6 animate-float delay-900 shadow-lg flex items-center justify-center p-2">
  <img 
    src="src/assets/EaseMyTrip_Logo.svg.png" 
    alt="Fourth Logo" 
    className="w-full h-full object-contain"
  />
</div>

{/* Logo 5 - Bottom Right */}
<div className="absolute bottom-16 right-24 w-20 h-20 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 backdrop-blur-sm rounded-2xl -rotate-12 animate-float delay-1200 shadow-lg flex items-center justify-center p-2">
  <img 
    src="src/assets/awfis.png" 
    alt="Fifth Logo" 
    className="w-full h-full object-contain"
  />
</div>

{/* Logo 6 - Center Bottom (New) */}
<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-purple-100/50 to-pink-100/50 backdrop-blur-sm rounded-2xl rotate-3 animate-float delay-1500 shadow-lg flex items-center justify-center p-2">
  <img 
    src="src/assets/ecourts-logo.png" 
    alt="Sixth Logo" 
    className="w-full h-full object-contain"
  />
</div>
          <div className="max-w-md text-center text-slate-800 space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Scale className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-sky-800 bg-clip-text text-transparent">
                  CLH 
                </h1>
                <p className="text-blue-600 font-medium">Professional Legal Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 text-lg leading-relaxed">
                Join India's most comprehensive legal community platform trusted by over 10,000 legal professionals.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 hover:bg-white transition-all duration-300 shadow-sm"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">10K+</div>
                <div className="text-blue-600 text-sm">Legal Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">500K+</div>
                <div className="text-blue-600 text-sm">Cases Managed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">99.9%</div>
                <div className="text-blue-600 text-sm">Uptime</div>
              </div>
            </div>
            {/* Added 4 basic logos
  <div className="flex justify-center items-center space-x-6 pt-6">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center p-2">
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-600">
        <path fill="currentColor" d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/>
      </svg>
    </div>
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center p-2">
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600">
        <path fill="currentColor" d="M18 13H6V11H18V13M18 17H6V15H18V17M12 7H6V5H12V7M13 1L12 0L6 6V9H5V5L13 1Z"/>
      </svg>
    </div>
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center p-2">
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600">
        <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,13.6 14.1,15.3 12,15.3C9.9,15.3 8.2,13.6 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7M7,17V18H17V17C17,14.3 14.7,12 12,12C9.3,12 7,14.3 7,17Z"/>
      </svg>
    </div>
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center p-2">
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600">
        <path fill="currentColor" d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 11.99H19C18.47 15.11 15.72 17.78 12 18.93V12H5V6.3L12 3.19V11.99Z"/>
      </svg>
    </div>
    </div> */}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Scale className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">CLH</h1>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
            </div>

            <Card className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                  <p className="text-slate-600">Sign in to access your account</p>
                </div>

                <div className="flex items-center space-x-2 bg-yellow-100 border border-yellow-200 rounded-xl p-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-slate-700 text-sm">Only advocates and clients can login here</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 pl-12 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 pl-12 pr-12 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-12 w-12 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <Label htmlFor="remember" className="text-slate-600 text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-slate-600">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>

                <div className="text-center space-y-2 pt-4 border-t border-slate-200">
                  <p className="text-slate-500 text-sm">Need assistance?</p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Phone className="w-3 h-3" />
                      <span>+91 97424 69777</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Mail className="w-3 h-3" />
                      <span>sales@clh.in</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-slate-600 shadow-sm">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm">Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float.delay-500 {
          animation-delay: 0.5s;
        }
        .animate-float.delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )

}

export default Login