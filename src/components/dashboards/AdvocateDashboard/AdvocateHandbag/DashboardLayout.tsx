"use client"

import { ArrowLeft, Leaf, Shield, Sparkles, Gift } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export default function FreeAdvocateHandbag() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const features = [
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Crafted from 100% recycled materials to reduce environmental impact.",
      color: "text-emerald-600",
    },
    {
      icon: Shield,
      title: "Durable Design",
      description: "Built to last with high-quality stitching and sturdy handles.",
      color: "text-blue-600",
    },
    {
      icon: Sparkles,
      title: "Stylish & Versatile",
      description: "Sleek design perfect for work, shopping, or casual outings.",
      color: "text-purple-600",
    },
  ]

  const stats = [
    { label: "Eco-Friendly", value: "100%", description: "Recycled Materials" },
    { label: "Durability", value: "5+", description: "Years Lifespan" },
    { label: "Capacity", value: "15L", description: "Storage Space" },
    { label: "Weight", value: "0.8kg", description: "Lightweight" },
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
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Free Advocate Handbag</h1>
          </div>
          <p className="text-gray-600">Claim Your Stylish Eco-Friendly Handbag Today!</p>
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
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Limited Time Offer</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get Your Free Advocate Handbag</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join our sustainability movement and receive a free, eco-friendly Advocate Handbag made from recycled
                materials. Perfect for everyday use, stylish, and kind to the planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to = "/handbag-request">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Claim Now
                </Button>
                </Link>
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
            <CardTitle className="text-center text-2xl">Why Choose the Advocate Handbag?</CardTitle>
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

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Sustainability Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">100% Recycled Materials</p>
                  <p className="text-sm text-gray-600">Made from post-consumer recycled plastic bottles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Carbon Neutral Shipping</p>
                  <p className="text-sm text-gray-600">Offset shipping emissions for every order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Plastic-Free Packaging</p>
                  <p className="text-sm text-gray-600">Biodegradable and compostable packaging materials</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Quality & Durability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Reinforced Stitching</p>
                  <p className="text-sm text-gray-600">Double-stitched seams for maximum durability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Water-Resistant</p>
                  <p className="text-sm text-gray-600">Protects your belongings from light rain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">5-Year Warranty</p>
                  <p className="text-sm text-gray-600">We stand behind our quality with a comprehensive warranty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  )
}
