"use client"
import { MessageSquare, MoreHorizontal, MapPin, Building2, Gavel, Briefcase, ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const AdvocateProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Advocate Profile</h1>
          </div>
          <p className="text-gray-600">Professional profile and credentials</p>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-0">
            {/* Cover Section */}
            <div className="relative h-32 bg-gray-100 border-b border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
            </div>

            {/* Profile Content */}
            <div className="px-8 py-6">
              {/* Profile Photo */}
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 bg-slate-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">Priya Sharma</h2>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        Senior Advocate
                      </Badge>
                    </div>
                    <p className="text-xl text-gray-700 mb-4">
                      Advocate at Supreme Court | Specializing in Constitutional & Criminal Law
                    </p>

                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>New Delhi, India</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">500+ connections</span>
                      <span className="text-gray-400">•</span>
                      <button className="text-gray-900 font-medium hover:underline">Contact info</button>
                    </div>
                  </div>

                  {/* Notable Achievement */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">
                      <span className="font-medium">Notable Achievement:</span> Represented in 50+ High-Profile Cases,
                      including Landmark Constitutional Cases
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" className="border-gray-300">
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      More
                    </Button>
                  </div>
                </div>

                {/* Right Column - Firm & Education */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Current Position
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Sharma & Associates</h4>
                            <p className="text-sm text-gray-600">Law Firm</p>
                            <p className="text-xs text-gray-500">2015 - Present</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Gavel className="w-5 h-5" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Gavel className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">National Law School, Delhi</h4>
                            <p className="text-sm text-gray-600">LLM, Constitutional Law</p>
                            <p className="text-xs text-gray-500">2010 - 2012</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Areas of Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Constitutional Law</span>
                  <Badge variant="secondary">Expert</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Criminal Law</span>
                  <Badge variant="secondary">Expert</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Civil Rights</span>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Corporate Law</span>
                  <Badge variant="secondary">Intermediate</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Professional Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years of Experience</span>
                  <span className="font-semibold text-gray-900">15+ Years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cases Handled</span>
                  <span className="font-semibold text-gray-900">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-gray-900">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bar Council Registration</span>
                  <span className="font-semibold text-gray-900">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Professional Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <h4 className="font-medium text-gray-900">Landmark Constitutional Case Victory</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Successfully argued a significant constitutional law case before the Supreme Court
                </p>
                <p className="text-xs text-gray-500 mt-2">2 weeks ago</p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <h4 className="font-medium text-gray-900">Legal Seminar Speaker</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Delivered keynote address on "Modern Constitutional Challenges" at Delhi Law University
                </p>
                <p className="text-xs text-gray-500 mt-2">1 month ago</p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <h4 className="font-medium text-gray-900">Published Legal Article</h4>
                <p className="text-sm text-gray-600 mt-1">
                  "The Evolution of Criminal Justice Reform" published in Indian Law Review
                </p>
                <p className="text-xs text-gray-500 mt-2">2 months ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdvocateProfile
