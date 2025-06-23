"use client"
import { ArrowLeft, Globe, Users, Calendar, Database, MapPin, Zap, Network, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function InternationalNetwork() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const highlights = [
    {
      icon: Globe,
      title: "Global Collaboration",
      description: "Connect with professionals from over 50 countries to share knowledge and opportunities.",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Attend virtual and in-person events, including webinars, workshops, and summits.",
      color: "text-emerald-600",
    },
    {
      icon: Database,
      title: "Resource Access",
      description: "Gain access to premium tools, research, and industry insights.",
      color: "text-purple-600",
    },
  ]

  const locations = [
    {
      city: "New York, USA",
      region: "North America Hub",
      members: "2,500+",
      icon: Building,
    },
    {
      city: "London, UK",
      region: "Europe Hub",
      members: "3,200+",
      icon: Building,
    },
    {
      city: "Singapore",
      region: "Asia-Pacific Hub",
      members: "1,800+",
      icon: Building,
    },
    {
      city: "Cape Town, SA",
      region: "Africa Hub",
      members: "950+",
      icon: Building,
    },
  ]

  const stats = [
    { label: "Countries", value: "50+", description: "Global Reach" },
    { label: "Members", value: "8,500+", description: "Active Network" },
    { label: "Events", value: "200+", description: "Annual Events" },
    { label: "Industries", value: "25+", description: "Sectors Covered" },
  ]

  const benefits = [
    { benefit: "Global Networking Opportunities", included: true },
    { benefit: "Monthly Virtual Events", included: true },
    { benefit: "Industry Research Reports", included: true },
    { benefit: "Premium Webinar Access", included: true },
    { benefit: "1-on-1 Mentorship Program", included: true },
    { benefit: "Regional Hub Access", included: true },
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
              <Network className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">International Network</h1>
          </div>
          <p className="text-gray-600">Connecting Innovators Across the Globe</p>
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
                <Globe className="w-3 h-3 mr-1" />
                Global Community
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Join Our Global Community</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our International Network brings together professionals, entrepreneurs, and innovators from around the
                world to collaborate, share ideas, and drive progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Become a Member
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Explore Network
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Join Our Network?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {highlights.map((highlight, index) => {
                const IconComponent = highlight.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                        <IconComponent className={`w-8 h-8 ${highlight.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{highlight.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Global Locations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Global Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((location, index) => {
                const IconComponent = location.icon
                return (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-center"
                  >
                    <div className="mb-3 flex justify-center">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-slate-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{location.city}</h3>
                    <p className="text-sm text-gray-600 mb-2">{location.region}</p>
                    <Badge variant="outline" className="text-xs">
                      {location.members} members
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Network Benefits & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Membership Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700">{item.benefit}</span>
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
                Network Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Global Meetups</p>
                  <p className="text-sm text-gray-600">Virtual networking sessions across time zones</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Industry Workshops</p>
                  <p className="text-sm text-gray-600">Skill-building sessions led by experts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Collaboration Projects</p>
                  <p className="text-sm text-gray-600">Cross-border innovation initiatives</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Annual Summit</p>
                  <p className="text-sm text-gray-600">Global conference with keynote speakers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-600" />
              Network Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Cross-Border Partnerships</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Over 150 successful business partnerships formed through our network connections.
                </p>
                <Badge className="bg-emerald-100 text-emerald-700">Success Story</Badge>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Innovation Projects</h3>
                <p className="text-sm text-gray-600 mb-3">
                  25+ collaborative innovation projects launched across different continents.
                </p>
                <Badge className="bg-blue-100 text-blue-700">Active Projects</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
