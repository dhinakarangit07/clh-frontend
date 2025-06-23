"use client"
import { ArrowLeft, Brain, FileText, Zap, TrendingUp, Clock, Shield, BarChart3, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AICaseManagement() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const aiFeatures = [
    {
      icon: FileText,
      title: "Smart Case Analysis",
      description: "Automatically analyze case documents and extract key insights using advanced AI.",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Task Automation",
      description: "Automate repetitive tasks like scheduling, reminders, and document filing.",
      color: "text-emerald-600",
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      description: "Leverage predictive analytics to anticipate case outcomes and optimize strategies.",
      color: "text-purple-600",
    },
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Increased Efficiency",
      description: "Reduce manual work and save time with automated workflows and intelligent tools.",
    },
    {
      icon: CheckCircle,
      title: "Enhanced Accuracy",
      description: "Minimize errors with AI-driven document analysis and data validation.",
    },
    {
      icon: BarChart3,
      title: "Scalable Solutions",
      description: "Easily manage growing caseloads with our cloud-based, scalable platform.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Ensure data security and compliance with industry-standard encryption.",
    },
  ]

  const stats = [
    { label: "Cases Processed", value: "50K+", description: "Monthly Volume" },
    { label: "Time Saved", value: "75%", description: "Average Reduction" },
    { label: "Accuracy Rate", value: "99.2%", description: "AI Analysis" },
    { label: "Client Satisfaction", value: "96%", description: "User Rating" },
  ]

  const capabilities = [
    { capability: "Document Analysis & OCR", included: true },
    { capability: "Automated Task Scheduling", included: true },
    { capability: "Predictive Case Outcomes", included: true },
    { capability: "Real-time Collaboration", included: true },
    { capability: "Custom Workflow Builder", included: true },
    { capability: "Advanced Reporting & Analytics", included: true },
  ]

  const useCases = [
    {
      industry: "Legal",
      description: "Streamline legal case management with AI-powered document review and analysis.",
      features: ["Contract Analysis", "Legal Research", "Case Prediction"],
    },
    {
      industry: "Healthcare",
      description: "Manage patient cases efficiently with automated workflows and insights.",
      features: ["Patient Records", "Treatment Plans", "Outcome Prediction"],
    },
    {
      industry: "Insurance",
      description: "Accelerate claims processing with intelligent case assessment and fraud detection.",
      features: ["Claims Processing", "Fraud Detection", "Risk Assessment"],
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
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Case Management</h1>
          </div>
          <p className="text-gray-600">Streamline Your Workflow with Intelligent Solutions</p>
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
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Revolutionize Case Management</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Leverage AI-driven insights to manage cases efficiently, automate routine tasks, and make informed
                decisions. Our platform empowers legal, medical, and business professionals to focus on what matters
                most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Watch Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">AI-Powered Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aiFeatures.map((feature, index) => {
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

        {/* Use Cases */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Industry Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.industry}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits & Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-slate-600" />
                Platform Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {capabilities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700">{item.capability}</span>
                  <div className="flex items-center gap-2">
                    {item.included && <Badge className="bg-emerald-100 text-emerald-700">Included</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Implementation Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              Implementation Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
                <p className="text-sm text-gray-600">Analyze your current workflow and requirements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Configuration</h3>
                <p className="text-sm text-gray-600">Customize the platform to match your processes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Training</h3>
                <p className="text-sm text-gray-600">Train your team on the new AI-powered tools</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Launch</h3>
                <p className="text-sm text-gray-600">Go live with ongoing support and optimization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
