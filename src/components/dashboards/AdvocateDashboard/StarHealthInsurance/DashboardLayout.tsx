"use client"
import { ArrowLeft, Shield, Users, Heart, Star, CheckCircle, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function StarHealthInsurance() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const plans = [
    {
      title: "Individual Plan",
      description: "Comprehensive coverage for individuals, including hospitalization and outpatient care.",
      price: "$50/month",
      features: ["Hospitalization Coverage", "Outpatient Care", "Emergency Services", "Prescription Drugs"],
      popular: false,
    },
    {
      title: "Family Plan",
      description: "Protect your entire family with flexible coverage for all members.",
      price: "$120/month",
      features: ["Family Coverage", "Maternity Benefits", "Child Care", "Preventive Services"],
      popular: true,
    },
    {
      title: "Senior Plan",
      description: "Specialized coverage for seniors, including chronic illness and preventive care.",
      price: "$80/month",
      features: ["Chronic Care", "Preventive Screening", "Specialist Consultations", "Home Care"],
      popular: false,
    },
  ]

  const stats = [
    { label: "Coverage", value: "100%", description: "Medical Expenses" },
    { label: "Network", value: "5000+", description: "Partner Hospitals" },
    { label: "Claims", value: "24/7", description: "Support Available" },
    { label: "Satisfaction", value: "98%", description: "Customer Rating" },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description: "Complete protection for all your healthcare needs with extensive coverage options.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Family Protection",
      description: "Flexible plans that cover your entire family with customizable options.",
      color: "text-emerald-600",
    },
    {
      icon: Heart,
      title: "Preventive Care",
      description: "Focus on wellness with coverage for preventive services and health screenings.",
      color: "text-red-600",
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Star Health Insurance</h1>
          </div>
          <p className="text-gray-600">Secure Your Future with Comprehensive Health Coverage</p>
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
                <Star className="w-3 h-3 mr-1" />
                Trusted Healthcare Partner
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Protect Your Health Today</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Star Health Insurance offers tailored plans to ensure you and your family are covered for medical
                emergencies, routine care, and more. Get peace of mind with our trusted insurance solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Get a Quote
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Compare Plans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Choose Star Health Insurance?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                        <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Plans Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Insurance Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{plan.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{plan.description}</p>
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-slate-900 mb-1">
                        {plan.price.split("/")[0]}
                        <span className="text-lg font-normal text-gray-600">/{plan.price.split("/")[1]}</span>
                      </p>
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
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                Coverage Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Cashless Treatment</p>
                  <p className="text-sm text-gray-600">Direct billing at network hospitals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Pre & Post Hospitalization</p>
                  <p className="text-sm text-gray-600">Coverage for 30 days before and 60 days after</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Day Care Procedures</p>
                  <p className="text-sm text-gray-600">Coverage for treatments not requiring overnight stay</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-600" />
                Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">24/7 Helpline</p>
                  <p className="text-sm text-gray-600">Round-the-clock customer support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Quick Claim Settlement</p>
                  <p className="text-sm text-gray-600">Fast and hassle-free claim processing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Online Services</p>
                  <p className="text-sm text-gray-600">Manage your policy online anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
