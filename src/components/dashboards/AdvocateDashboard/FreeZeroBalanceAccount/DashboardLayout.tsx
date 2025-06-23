"use client"
import { ArrowLeft, CreditCard, Zap, Smartphone, Shield, CheckCircle, DollarSign, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function FreeZeroBalanceAccount() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const features = [
    {
      icon: DollarSign,
      title: "No Fees",
      description: "Enjoy banking without monthly maintenance or transaction fees.",
      color: "text-emerald-600",
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Open your account in minutes with our seamless online process.",
      color: "text-blue-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Banking",
      description: "Manage your money anytime, anywhere with our top-rated app.",
      color: "text-purple-600",
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Secure Banking",
      description: "Bank-grade security with 256-bit encryption and fraud protection.",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Access your account and customer support around the clock.",
    },
    {
      icon: Users,
      title: "Customer Support",
      description: "Dedicated support team ready to help with all your banking needs.",
    },
    {
      icon: CheckCircle,
      title: "No Hidden Charges",
      description: "Complete transparency with no surprise fees or charges.",
    },
  ]

  const stats = [
    { label: "Happy Customers", value: "100K+", description: "Trust ZeroBank" },
    { label: "Zero Fees", value: "₹0", description: "Monthly Charges" },
    { label: "Setup Time", value: "5 min", description: "Account Opening" },
    { label: "App Rating", value: "4.9★", description: "User Reviews" },
  ]

  const accountFeatures = [
    { feature: "Zero Minimum Balance", included: true },
    { feature: "Free Debit Card", included: true },
    { feature: "Mobile Banking App", included: true },
    { feature: "Online Banking", included: true },
    { feature: "UPI Payments", included: true },
    { feature: "24/7 Customer Support", included: true },
    { feature: "ATM Access Nationwide", included: true },
    { feature: "SMS & Email Alerts", included: true },
  ]

  const steps = [
    {
      step: "1",
      title: "Apply Online",
      description: "Fill out our simple online application form in just 5 minutes.",
    },
    {
      step: "2",
      title: "Verify Documents",
      description: "Upload your KYC documents for quick verification.",
    },
    {
      step: "3",
      title: "Get Approved",
      description: "Receive instant approval and account details via email.",
    },
    {
      step: "4",
      title: "Start Banking",
      description: "Begin using your account immediately with our mobile app.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Free Zero Balance Account</h1>
          </div>
          <p className="text-gray-600">Banking Made Simple, Smart, and Free</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-slate-50 to-gray-100 border-0">
          <CardContent className="p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                <DollarSign className="w-3 h-3 mr-1" />
                Zero Balance Required
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Open a Free Zero Balance Account Today
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                No minimum balance, no hidden fees, and instant account setup. Start banking smarter with ZeroBank and
                enjoy complete financial freedom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Get Started Now
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Choose a Zero Balance Account?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Account Features & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-slate-600" />
                Account Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accountFeatures.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700">{item.feature}</span>
                  <div className="flex items-center gap-2">
                    {item.included && <Badge className="bg-emerald-100 text-emerald-700">Included</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                Additional Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">How to Open Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-600" />
              What You Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Required Documents:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Aadhaar Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">PAN Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Passport Size Photo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Mobile Number</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Eligibility Criteria:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Age: 18 years or above</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Indian Resident</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Valid KYC Documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Active Mobile Number</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
