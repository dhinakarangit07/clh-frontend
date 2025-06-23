"use client"
import { ArrowLeft, GraduationCap, Users, Clock, Award, BookOpen, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TrainingProgram() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const highlights = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry leaders with years of experience in their fields.",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Access courses at your own pace with our online and hybrid options.",
      color: "text-emerald-600",
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn recognized credentials to boost your career prospects.",
      color: "text-purple-600",
    },
  ]

  const stats = [
    { label: "Success Rate", value: "95%", description: "Graduate Success" },
    { label: "Duration", value: "6-12", description: "Months Program" },
    { label: "Students", value: "500+", description: "Enrolled Annually" },
    { label: "Instructors", value: "25+", description: "Expert Faculty" },
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
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Education Training Program</h1>
          </div>
          <p className="text-gray-600">Empowering Future Leaders with Cutting-Edge Skills</p>
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
              <Badge className="mb-4 bg-slate-100 text-slate-700 hover:bg-slate-100">
                <BookOpen className="w-3 h-3 mr-1" />
                Professional Development
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Transform Your Career Today</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join our comprehensive training program designed to equip you with the skills and knowledge needed to
                excel in today's competitive world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Enroll Now
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Program Highlights</CardTitle>
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

        {/* Program Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-600" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Industry-Relevant Skills</p>
                  <p className="text-sm text-gray-600">Master the latest tools and technologies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Practical Experience</p>
                  <p className="text-sm text-gray-600">Work on real-world projects and case studies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-slate-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Career Advancement</p>
                  <p className="text-sm text-gray-600">Build skills for leadership and growth</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-600" />
                Program Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Foundation Modules</p>
                  <p className="text-sm text-gray-600">Core concepts and fundamental principles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Advanced Training</p>
                  <p className="text-sm text-gray-600">Specialized skills and expert techniques</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Capstone Project</p>
                  <p className="text-sm text-gray-600">Apply learning in a comprehensive project</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
