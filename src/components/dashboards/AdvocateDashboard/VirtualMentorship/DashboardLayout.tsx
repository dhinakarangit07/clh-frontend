"use client"
import { ArrowLeft, Users, Clock, Target, Star, Calendar, MessageCircle, Video, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VirtualMentorship() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const benefits = [
    {
      icon: Target,
      title: "Personalized Guidance",
      description: "Receive one-on-one support tailored to your career goals and aspirations.",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Connect with mentors at your convenience through our virtual platform.",
      color: "text-emerald-600",
    },
    {
      icon: Users,
      title: "Diverse Expertise",
      description: "Access mentors from various industries, including tech, finance, and more.",
      color: "text-purple-600",
    },
  ]

  const mentors = [
    {
      name: "Dr. Sarah Lee",
      title: "Tech Entrepreneur & AI Expert",
      description: "10+ years mentoring startups in tech innovation.",
      avatar: "/placeholder.svg?height=96&width=96",
      rating: 4.9,
      sessions: 150,
      expertise: ["AI", "Startups", "Tech Leadership"],
    },
    {
      name: "Michael Chen",
      title: "Finance Consultant",
      description: "Expert in financial planning and investments.",
      avatar: "/placeholder.svg?height=96&width=96",
      rating: 4.8,
      sessions: 120,
      expertise: ["Finance", "Investments", "Strategy"],
    },
    {
      name: "Aisha Patel",
      title: "Marketing Strategist",
      description: "Specialist in digital marketing and branding.",
      avatar: "/placeholder.svg?height=96&width=96",
      rating: 4.9,
      sessions: 200,
      expertise: ["Marketing", "Branding", "Digital"],
    },
  ]

  const stats = [
    { label: "Active Mentors", value: "500+", description: "Expert Professionals" },
    { label: "Success Rate", value: "95%", description: "Goal Achievement" },
    { label: "Sessions", value: "10K+", description: "Completed" },
    { label: "Industries", value: "20+", description: "Covered" },
  ]

  const features = [
    { feature: "1-on-1 Video Sessions", included: true },
    { feature: "Flexible Scheduling", included: true },
    { feature: "Goal Setting & Tracking", included: true },
    { feature: "Resource Library Access", included: true },
    { feature: "Progress Reports", included: true },
    { feature: "Community Forums", included: true },
  ]

  const programTypes = [
    {
      title: "Career Development",
      description: "Advance your career with strategic guidance and skill development.",
      duration: "3-6 months",
      sessions: "Bi-weekly",
      popular: false,
    },
    {
      title: "Leadership Coaching",
      description: "Develop leadership skills and executive presence.",
      duration: "6-12 months",
      sessions: "Weekly",
      popular: true,
    },
    {
      title: "Entrepreneurship",
      description: "Launch and scale your business with expert guidance.",
      duration: "6-18 months",
      sessions: "Weekly",
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
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Mentorship Program</h1>
          </div>
          <p className="text-gray-600">Empowering Growth Through Guided Mentorship</p>
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
                <MessageCircle className="w-3 h-3 mr-1" />
                Virtual Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Unlock Your Potential</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Connect with experienced mentors from around the world to gain personalized guidance, career advice, and
                skills development through our virtual mentorship platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Join Now
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Browse Mentors
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Types */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Mentorship Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programTypes.map((program, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                    program.popular ? "border-slate-900 bg-slate-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {program.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{program.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{program.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sessions:</span>
                        <span className="font-medium text-gray-900">{program.sessions}</span>
                      </div>
                    </div>
                    <Button
                      className={`w-full ${
                        program.popular
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

        {/* Benefits Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Choose Our Mentorship Program?</CardTitle>
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

        {/* Meet Our Mentors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Meet Our Mentors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{mentor.title}</p>
                    <p className="text-sm text-gray-600 mb-4">{mentor.description}</p>

                    <div className="flex justify-center items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{mentor.rating}</span>
                      </div>
                      <div className="text-gray-600">{mentor.sessions} sessions</div>
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {mentor.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Program Features & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-600" />
                Program Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((item, index) => (
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
                <Calendar className="w-5 h-5 text-slate-600" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Choose Your Mentor</p>
                  <p className="text-sm text-gray-600">Browse profiles and select the perfect mentor for your goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Schedule Sessions</p>
                  <p className="text-sm text-gray-600">Book convenient time slots that work for both of you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Learning</p>
                  <p className="text-sm text-gray-600">Begin your mentorship journey with personalized guidance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Track Progress</p>
                  <p className="text-sm text-gray-600">Monitor your growth and achieve your career goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
