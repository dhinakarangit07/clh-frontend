"use client"
import { ArrowLeft, Database, Search, BookOpen, Scale, Zap, Shield, Clock, Users, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LegalDatabaseAccess() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Library",
      description: "Access millions of legal documents, including case law, statutes, and regulations.",
      color: "text-blue-600",
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Find what you need quickly with our powerful, AI-driven search engine.",
      color: "text-emerald-600",
    },
    {
      icon: Zap,
      title: "Cross-Platform Access",
      description: "Research on-the-go with seamless access on desktop, tablet, or mobile.",
      color: "text-purple-600",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Time-Saving Research",
      description: "Reduce research time by up to 70% with intelligent search algorithms.",
    },
    {
      icon: Shield,
      title: "Verified Content",
      description: "All documents are verified and updated regularly for accuracy.",
    },
    {
      icon: Users,
      title: "Collaborative Tools",
      description: "Share research and collaborate with team members seamlessly.",
    },
    {
      icon: Scale,
      title: "Legal Citations",
      description: "Automatic citation generation in multiple legal formats.",
    },
  ]

  const stats = [
    { label: "Legal Documents", value: "10M+", description: "In Database" },
    { label: "Search Speed", value: "<1s", description: "Average Query" },
    { label: "Accuracy Rate", value: "99.8%", description: "Document Verification" },
    { label: "Users Worldwide", value: "50K+", description: "Legal Professionals" },
  ]

  const databaseFeatures = [
    { feature: "Case Law Database", included: true },
    { feature: "Statutory Materials", included: true },
    { feature: "Legal Journals & Articles", included: true },
    { feature: "International Law Resources", included: true },
    { feature: "AI-Powered Search", included: true },
    { feature: "Citation Generator", included: true },
    { feature: "Document Annotations", included: true },
    { feature: "Offline Access", included: true },
  ]

  const searchCapabilities = [
    {
      type: "Boolean Search",
      description: "Use AND, OR, NOT operators for precise results",
      example: "contract AND breach NOT employment",
    },
    {
      type: "Natural Language",
      description: "Search using everyday language queries",
      example: "What are the requirements for a valid contract?",
    },
    {
      type: "Citation Search",
      description: "Find cases by citation or reference",
      example: "Brown v. Board of Education, 347 U.S. 483",
    },
    {
      type: "Concept Search",
      description: "Find related concepts and similar cases",
      example: "Similar cases to negligence in medical practice",
    },
  ]

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "$99/month",
      description: "Perfect for solo practitioners",
      features: ["Access to case law", "Basic search", "5 downloads/day"],
      popular: false,
    },
    {
      name: "Professional",
      price: "$199/month",
      description: "Ideal for law firms",
      features: ["Full database access", "Advanced search", "Unlimited downloads", "Team collaboration"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: ["Custom integrations", "API access", "Priority support", "Training sessions"],
      popular: false,
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
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Database Access</h1>
          </div>
          <p className="text-gray-600">Comprehensive Legal Research at Your Fingertips</p>
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
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Scale className="w-3 h-3 mr-1" />
                Legal Research Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Access the Ultimate Legal Database</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Unlock a comprehensive collection of legal documents, case law, and statutes with LexiBase. Research
                smarter, faster, and with confidence using our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Start Your Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Watch Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Choose LexiBase?</CardTitle>
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

        {/* Search Capabilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Advanced Search Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchCapabilities.map((capability, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{capability.type}</h3>
                  <p className="text-gray-600 mb-3">{capability.description}</p>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-700 font-mono">{capability.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database Features & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-600" />
                Database Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {databaseFeatures.map((item, index) => (
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
                <Zap className="w-5 h-5 text-slate-600" />
                Key Benefits
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

        {/* Subscription Plans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Choose Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                    plan.popular ? "border-slate-900 bg-slate-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-slate-900 mb-1">{plan.price}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
