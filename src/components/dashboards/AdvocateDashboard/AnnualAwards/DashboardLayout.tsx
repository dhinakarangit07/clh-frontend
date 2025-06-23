"use client"
import { ArrowLeft, Award, Trophy, Star, Users, Lightbulb, Heart, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AnnualAwards() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const categories = [
    {
      icon: Lightbulb,
      title: "Innovation Award",
      description: "Recognizing groundbreaking ideas and technological advancements.",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      title: "Community Impact Award",
      description: "Honoring contributions that uplift and strengthen our community.",
      color: "text-emerald-600",
    },
    {
      icon: Crown,
      title: "Leadership Award",
      description: "Celebrating exceptional leadership and vision in any field.",
      color: "text-purple-600",
    },
  ]

  const pastWinners = [
    {
      year: "2024",
      category: "Innovation Award",
      winner: "TechVision Inc.",
      description: "Recognized for their revolutionary AI-driven healthcare solutions.",
      icon: Lightbulb,
    },
    {
      year: "2024",
      category: "Community Impact Award",
      winner: "GreenFuture Foundation",
      description: "Honored for their environmental education and sustainability initiatives.",
      icon: Heart,
    },
    {
      year: "2023",
      category: "Leadership Award",
      winner: "Sarah Johnson",
      description: "Celebrated for transformative leadership in sustainable business practices.",
      icon: Crown,
    },
    {
      year: "2023",
      category: "Innovation Award",
      winner: "NextGen Solutions",
      description: "Awarded for breakthrough renewable energy storage technology.",
      icon: Lightbulb,
    },
  ]

  const stats = [
    { label: "Years Running", value: "15+", description: "Annual Tradition" },
    { label: "Categories", value: "8", description: "Award Types" },
    { label: "Nominees", value: "200+", description: "This Year" },
    { label: "Attendees", value: "500+", description: "Expected" },
  ]

  const timeline = [
    { phase: "Nominations Open", date: "Jan 15 - Mar 15", status: "active" },
    { phase: "Review Period", date: "Mar 16 - Apr 30", status: "upcoming" },
    { phase: "Finalist Selection", date: "May 1 - May 15", status: "upcoming" },
    { phase: "Awards Ceremony", date: "June 20", status: "upcoming" },
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
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Annual Awards 2025</h1>
          </div>
          <p className="text-gray-600">Celebrating Excellence and Innovation</p>
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
              <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Star className="w-3 h-3 mr-1" />
                Nominations Open
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Honor the Best in Our Community</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join us in recognizing outstanding achievements across various fields. Nominate individuals or
                organizations who have made a significant impact this year.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Nominate Now
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  View Categories
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Awards Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {timeline.map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      item.status === "active" ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.phase}</h3>
                  <p className="text-sm text-gray-600">{item.date}</p>
                  {item.status === "active" && (
                    <Badge className="mt-2 bg-slate-100 text-slate-700">Current Phase</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Award Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Award Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                        <IconComponent className={`w-8 h-8 ${category.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{category.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Past Winners */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Past Winners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastWinners.map((winner, index) => {
                const IconComponent = winner.icon
                return (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <IconComponent className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {winner.year}
                          </Badge>
                          <h3 className="font-semibold text-gray-900">{winner.category}</h3>
                        </div>
                        <p className="font-medium text-slate-700 mb-1">Winner: {winner.winner}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{winner.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-600" />
                Nomination Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Submit Nomination</p>
                  <p className="text-sm text-gray-600">Complete the online nomination form</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Review Process</p>
                  <p className="text-sm text-gray-600">Expert panel evaluates all nominations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Winner Selection</p>
                  <p className="text-sm text-gray-600">Finalists selected and winners announced</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Awards Ceremony</p>
                  <p className="text-sm text-gray-600">June 20, 2025 at Grand Convention Center</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Networking Reception</p>
                  <p className="text-sm text-gray-600">Pre-ceremony networking from 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Live Streaming</p>
                  <p className="text-sm text-gray-600">Available for remote attendees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
