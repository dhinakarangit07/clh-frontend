"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Scale,
  Eye,
  EyeOff,
  ArrowLeft,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  CheckCircle,
  UserPlus,
  User,
  Upload,
  GraduationCap,
  Briefcase,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

// Declare the turnstile property on the Window interface
interface CloudflareTurnstile {
  render: (container: HTMLElement | string, options: {
    sitekey: string;
    callback: (token: string) => void;
    "error-callback"?: () => void;
  }) => void;
  remove: (container: HTMLElement | string) => void;
}

declare global {
  interface Window {
    turnstile: CloudflareTurnstile;
  }
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const turnstileRef = useRef<HTMLDivElement>(null)

  // Advocate fields
  const [advocateData, setAdvocateData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    barCouncilName: "",
    enrollmentRollNo: "",
    enrollmentDate: "",
    advocateIdCard: null as File | null,
    placeOfPractice: "",
    areaOfPractice: "",
    dateOfBirth: "",
    communicationAddress: "",
    contactNumber: "",
    govtIdProof: null as File | null,
  })

  // LL.B Graduate/Student fields
  const [studentData, setStudentData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    institutionName: "",
    courseType: "",
    studentRollNo: "",
    currentYearOrPassingYear: "",
    studentIdCard: null as File | null,
    dateOfBirth: "",
    communicationAddress: "",
    contactNumber: "",
    govtIdProof: null as File | null,
  })

  const navigate = useNavigate()
  const { toast } = useToast()

  // Load Turnstile script and render widget
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (turnstileRef.current && window.turnstile) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAABh4oEamCkJmFMf0",
          callback: (token: string) => setTurnstileToken(token),
          "error-callback": () => {
            toast({
              title: "Error",
              description: "Turnstile verification failed. Please try again.",
              variant: "destructive",
            })
            setTurnstileToken(null)
          },
        })
      }
    }

    return () => {
      if (turnstileRef.current && window.turnstile) {
        window.turnstile.remove(turnstileRef.current)
      }
      document.body.removeChild(script)
    }
  }, [toast])

  const handleFileUpload = (field: string, file: File | null, isAdvocate = true) => {
    if (isAdvocate) {
      setAdvocateData((prev) => ({ ...prev, [field]: file }))
    } else {
      setStudentData((prev) => ({ ...prev, [field]: file }))
    }
  }

  const handleAdvocateChange = (field: string, value: string) => {
    setAdvocateData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStudentChange = (field: string, value: string) => {
    setStudentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic field validation
    if (!email || !password || !confirmPassword || !role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!turnstileToken) {
      toast({
        title: "Error",
        description: "Please complete the Turnstile verification",
        variant: "destructive",
      })
      return
    }

    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the Terms & Conditions",
        variant: "destructive",
      })
      return
    }

    // Role-specific validation
    if (role === "advocate") {
      const requiredFields = [
        "name", "fatherName", "motherName", "barCouncilName", "enrollmentRollNo",
        "enrollmentDate", "placeOfPractice", "areaOfPractice", "dateOfBirth",
        "communicationAddress", "contactNumber", "advocateIdCard", "govtIdProof"
      ]
      for (const field of requiredFields) {
        if (!advocateData[field as keyof typeof advocateData]) {
          toast({
            title: "Error",
            description: `Please fill in the ${field} field`,
            variant: "destructive",
          })
          return
        }
      }
    } else if (role === "student") {
      const requiredFields = [
        "name", "fatherName", "motherName", "institutionName", "courseType",
        "studentRollNo", "currentYearOrPassingYear", "dateOfBirth",
        "communicationAddress", "contactNumber", "studentIdCard", "govtIdProof"
      ]
      for (const field of requiredFields) {
        if (!studentData[field as keyof typeof studentData]) {
          toast({
            title: "Error",
            description: `Please fill in the ${field} field`,
            variant: "destructive",
          })
          return
        }
      }
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("username", email)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("confirm_password", confirmPassword)
      formData.append("first_name", role === "advocate" ? "Advocate" : "Student")
      formData.append("last_name", role)
      formData.append("role", role)
      formData.append("cf_turnstile_response", turnstileToken)

      if (role === "advocate") {
        const advocateFields = {
          fathers_name: advocateData.fatherName,
          mothers_name: advocateData.motherName,
          spouse_name: advocateData.spouseName,
          bar_council_name: advocateData.barCouncilName,
          enrollment_roll_no: advocateData.enrollmentRollNo,
          enrollment_date: advocateData.enrollmentDate,
          place_of_practice: advocateData.placeOfPractice,
          area_of_practice: advocateData.areaOfPractice,
          date_of_birth: advocateData.dateOfBirth,
          communication_address: advocateData.communicationAddress,
          contact_number: advocateData.contactNumber,
        }
        formData.append("advocate_data", JSON.stringify(advocateFields))
        if (advocateData.advocateIdCard) {
          formData.append("advocate_data[id_card]", advocateData.advocateIdCard)
        }
        if (advocateData.govtIdProof) {
          formData.append("advocate_data[govt_id_proof]", advocateData.govtIdProof)
        }
      } else if (role === "student") {
        const studentFields = {
          name: studentData.name,
          email: email,
          mobile_no: studentData.contactNumber,
          fathers_name: studentData.fatherName,
          mothers_name: studentData.motherName,
          spouse_name: studentData.spouseName,
          institution_name: studentData.institutionName,
          course_type: studentData.courseType,
          roll_number: studentData.studentRollNo,
          study_year: studentData.currentYearOrPassingYear,
          dob: studentData.dateOfBirth,
          address: studentData.communicationAddress,
        }
        formData.append("student_data", JSON.stringify(studentFields))
        if (studentData.studentIdCard) {
          formData.append("student_data[student_id_card]", studentData.studentIdCard)
        }
        if (studentData.govtIdProof) {
          formData.append("student_data[govt_id_proof]", studentData.govtIdProof)
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.detail ||
          errorData.email?.[0] ||
          errorData.role?.[0] ||
          errorData.advocate_data?.[0] ||
          errorData.advocate_data?.enrollment_roll_no?.[0] ||
          errorData.advocate_data?.fathers_name?.[0] ||
          errorData.student_data?.email?.[0] ||
          errorData.cf_turnstile_response?.[0] ||
          "Signup failed. Please try again."
        )
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: "Account created successfully! Please log in.",
      })
      navigate("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Shield, text: "Secure & Encrypted Platform" },
    { icon: CheckCircle, text: "15 Exclusive Member Benefits" },
    { icon: Sparkles, text: "AI-Powered Legal Tools" },
    { icon: UserPlus, text: "Join 10,000+ Legal Professionals" },
  ]

  const FileUploadField = ({
    label,
    field,
    isAdvocate = true,
    accept = ".pdf,.jpg,.jpeg,.png",
  }: {
    label: string
    field: string
    isAdvocate?: boolean
    accept?: string
  }) => (
    <div className="space-y-2">
      <Label className="text-white/90 font-medium">{label}</Label>
      <div className="relative">
        <Input
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null, isAdvocate)}
          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all duration-200"
        />
        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-slate-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 backdrop-blur-sm rounded-2xl rotate-12 animate-float"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm rounded-full animate-float delay-1000"></div>
          <div className="absolute top-1/3 right-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl -rotate-45 animate-float delay-500"></div>

          <div className="max-w-md text-center text-white space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Scale className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  CLH Advocates
                </h1>
                <p className="text-blue-200 font-medium">Professional Legal Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-blue-100/80 text-lg leading-relaxed">
                Create your account and unlock access to exclusive legal tools, databases, and a thriving community of
                legal professionals.
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-blue-200 text-sm">Exclusive Benefits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-blue-200 text-sm">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl space-y-6">
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Scale className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">CLH Advocates</h1>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardContent className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">Create Account</h2>
                  <p className="text-white/70">Join the legal community today</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Basic Account Information */}
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Account Information</span>
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90 font-medium">
                        Email Address *
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-black group-focus-within:text-blue-400 transition-colors duration-200" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-12 pl-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white/90 font-medium">
                          Password *
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-black group-focus-within:text-blue-400 transition-colors duration-200" />
                          </div>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 pl-12 pr-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                            required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute inset-y-0 right-0 h-12 w-12 text-black hover:text-black hover:bg-white/10 transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white/90 font-medium">
                        Confirm Password *
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-black group-focus-within:text-blue-400 transition-colors duration-200" />
                        </div>
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-12 pl-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification and Terms */}
                <div className="space-y-4 pb-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Verification</span>
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-white/90 font-medium">Cloudflare Verification *</Label>
                    <div ref={turnstileRef} className="cf-turnstile"></div>
                  </div>

                  <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="rounded-md w-5 h-5 border-2 border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-white/90 leading-relaxed cursor-pointer text-sm">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors duration-200"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors duration-200"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4 pb-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Select Your Role *</span>
                  </h3>

                  <RadioGroup value={role} onValueChange={setRole} className="space-y-3">
                    <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                      <RadioGroupItem value="advocate" id="advocate" className="border-white/30 text-blue-600" />
                      <Label
                        htmlFor="advocate"
                        className="text-white/90 font-medium cursor-pointer flex items-center space-x-2"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Advocate</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                      <RadioGroupItem value="student" id="student" className="border-white/30 text-blue-600" />
                      <Label
                        htmlFor="student"
                        className="text-white/90 font-medium cursor-pointer flex items-center space-x-2"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>LL.B Graduate / LL.B Student</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Advocate Fields */}
                {role === "advocate" && (
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <Briefcase className="w-5 h-5" />
                      <span>Advocate Registration Details</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Name of the Advocate *</Label>
                        <Input
                          placeholder="Enter full name"
                          value={advocateData.name}
                          onChange={(e) => handleAdvocateChange("name", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Father's Name *</Label>
                        <Input
                          placeholder="Enter father's name"
                          value={advocateData.fatherName}
                          onChange={(e) => handleAdvocateChange("fatherName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Mother's Name *</Label>
                        <Input
                          placeholder="Enter mother's name"
                          value={advocateData.motherName}
                          onChange={(e) => handleAdvocateChange("motherName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Spouse Name (if married)</Label>
                        <Input
                          placeholder="Enter spouse name"
                          value={advocateData.spouseName}
                          onChange={(e) => handleAdvocateChange("spouseName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Name of the Bar Council *</Label>
                        <Input
                          placeholder="Enter bar council name"
                          value={advocateData.barCouncilName}
                          onChange={(e) => handleAdvocateChange("barCouncilName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Enrollment Roll No *</Label>
                        <Input
                          placeholder="Enter enrollment roll number"
                          value={advocateData.enrollmentRollNo}
                          onChange={(e) => handleAdvocateChange("enrollmentRollNo", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Enrollment Date *</Label>
                        <Input
                          type="date"
                          value={advocateData.enrollmentDate}
                          onChange={(e) => handleAdvocateChange("enrollmentDate", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Place of Practice *</Label>
                        <Input
                          placeholder="Enter place of practice"
                          value={advocateData.placeOfPractice}
                          onChange={(e) => handleAdvocateChange("placeOfPractice", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Area of Practice *</Label>
                        <Input
                          placeholder="Enter area of practice"
                          value={advocateData.areaOfPractice}
                          onChange={(e) => handleAdvocateChange("areaOfPractice", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Date of Birth *</Label>
                        <Input
                          type="date"
                          value={advocateData.dateOfBirth}
                          onChange={(e) => handleAdvocateChange("dateOfBirth", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Contact Number (Mobile No) *</Label>
                        <Input
                          type="tel"
                          placeholder="Enter mobile number"
                          value={advocateData.contactNumber}
                          onChange={(e) => handleAdvocateChange("contactNumber", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90 font-medium">Communication Address *</Label>
                      <Textarea
                        placeholder="Enter complete address"
                        value={advocateData.communicationAddress}
                        onChange={(e) => handleAdvocateChange("communicationAddress", e.target.value)}
                        className="w-full min-h-[100px] bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField
                        label="Advocate ID Card / Bar Council Enrollment Certificate *"
                        field="advocateIdCard"
                        isAdvocate={true}
                      />
                      <FileUploadField label="Govt ID Proof (Aadhar Card) *" field="govtIdProof" isAdvocate={true} />
                    </div>
                  </div>
                )}

                {/* Student Fields */}
                {role === "student" && (
                  <div className="space-y-4 pb-6 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5" />
                      <span>LL.B Graduate/Student Registration Details</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Name of the LL.B Graduate/Student *</Label>
                        <Input
                          placeholder="Enter full name"
                          value={studentData.name}
                          onChange={(e) => handleStudentChange("name", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Father's Name *</Label>
                        <Input
                          placeholder="Enter father's name"
                          value={studentData.fatherName}
                          onChange={(e) => handleStudentChange("fatherName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Mother's Name *</Label>
                        <Input
                          placeholder="Enter mother's name"
                          value={studentData.motherName}
                          onChange={(e) => handleStudentChange("motherName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Spouse Name (if married)</Label>
                        <Input
                          placeholder="Enter spouse name"
                          value={studentData.spouseName}
                          onChange={(e) => handleStudentChange("spouseName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Name of the Institution/College/University *</Label>
                        <Input
                          placeholder="Enter institution name"
                          value={studentData.institutionName}
                          onChange={(e) => handleStudentChange("institutionName", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Course Type *</Label>
                        <Select
                          value={studentData.courseType}
                          onValueChange={(value) => handleStudentChange("courseType", value)}
                        >
                          <SelectTrigger className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white">
                            <SelectValue placeholder="Select course type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3-Year LL.B">3 Year LL.B</SelectItem>
                            <SelectItem value="5-Year LL.B">5 Year LL.B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Student Roll No *</Label>
                        <Input
                          placeholder="Enter student roll number"
                          value={studentData.studentRollNo}
                          onChange={(e) => handleStudentChange("studentRollNo", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Current Year of Study/Passing Year *</Label>
                        <Input
                          placeholder="e.g., 2nd Year or 2023"
                          value={studentData.currentYearOrPassingYear}
                          onChange={(e) => handleStudentChange("currentYearOrPassingYear", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Date of Birth *</Label>
                        <Input
                          type="date"
                          value={studentData.dateOfBirth}
                          onChange={(e) => handleStudentChange("dateOfBirth", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/90 font-medium">Contact Number (Mobile No) *</Label>
                        <Input
                          type="tel"
                          placeholder="Enter mobile number"
                          value={studentData.contactNumber}
                          onChange={(e) => handleStudentChange("contactNumber", e.target.value)}
                          className="w-full h-12 bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/90 font-medium">Communication Address *</Label>
                      <Textarea
                        placeholder="Enter complete address"
                        value={studentData.communicationAddress}
                        onChange={(e) => handleStudentChange("communicationAddress", e.target.value)}
                        className="w-full min-h-[100px] bg-white/10 border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl text-white placeholder:text-white/50 transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField
                        label="Student ID Card / LL.B Degree Passing Certificate *"
                        field="studentIdCard"
                        isAdvocate={false}
                      />
                      <FileUploadField
                        label="Govt ID Proof (Aadhar Card) *"
                        field="govtIdProof"
                        isAdvocate={false}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  disabled={isLoading || !role || !turnstileToken}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-white/70 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-300 hover:text-blue-200 font-semibold transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="text-center space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center space-x-2 text-white/60">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Your data is encrypted and secure</span>
                </div>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-white/60">
                    <Phone className="w-3 h-3" />
                    <span>+91 97424 69777</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/60">
                    <Mail className="w-3 h-3" />
                    <span>sales@clh.in</span>
                  </div>
                </div>
              </div>
            </CardContent>
            </Card>
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
  );
};

export default SignUp;