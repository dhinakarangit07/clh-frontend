"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  BookOpen,
  Building2,
  Clock,
  CreditCard,
  Database,
  FileText,
  Gift,
  Globe,
  HandHeart,
  Hotel,
  MessageSquare,
  Search,
  Shield,
  Trophy,
  User,
  Zap,
  CheckCircle,
  Grid3X3,
} from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/DashboardHeader"

export default function Index() {
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const navigate = useNavigate()
  const { toast } = useToast()

  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  const getUserInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : ""
    const lastInitial = lastName ? lastName[0].toUpperCase() : ""
    return `${firstInitial}${lastInitial}`
  }

  const handleTokenRefresh = async (originalError, retryFn) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) {
        throw new Error("No refresh token found. Please log in again.")
      }
      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken,
      })
      localStorage.setItem("accessToken", response.data.access)
      await retryFn()
    } catch (refreshError) {
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      })
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      navigate("/login")
    }
  }

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/user_profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setUserProfile(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchUserProfile())
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user profile.",
          variant: "destructive",
        })
        navigate("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const benefitCategories = [
    { id: "all", label: "All Benefits" },
    { id: "tools", label: "Tools" },
    { id: "education", label: "Education" },
    { id: "financial", label: "Financial" },
    { id: "insurance", label: "Insurance" },
    { id: "networking", label: "Networking" },
  ]

  const benefits = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Digital Diary Access",
      category: "tools",
      description: "Access to Advocate's Digital Diary exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/digital-diary",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Co-working Space Discounts",
      category: "workspace",
      description:
        "Discount rates to book Co-working office spaces across major cities of India exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/coworking-spaces",
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: "Free Advocate Handbag",
      category: "perks",
      description: "Free Advocate Handbag worth INR 999 exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/advocate-handbag",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Discussion Board",
      category: "community",
      description:
        "Access to CLH Advocate Discussion Board – an exclusive discussion forum only for CLH registered members",
      activated: "May 17, 2025",
      url: "/forum",
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "E-courts Search",
      category: "tools",
      description: "One click Legal Database search for e-courts of India",
      activated: "May 17, 2025",
      url: "/ecourt-search",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Training Programs",
      category: "education",
      description: "Advocate Training & Upskilling programs exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/training-program",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Star Health Insurance",
      category: "insurance",
      description: "Star Health Insurance Mediclaim Policy with flexi-EMI options exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/health-insurance",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Annual Awards",
      category: "recognition",
      description: "Advocate Annual Awards - Celebrating excellence in Advocacy for CLH Members",
      activated: "May 17, 2025",
      url: "/annual-awards",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Free Membership Profile",
      category: "profile",
      description: "Complete membership profile for all Advocates registering with CLH",
      activated: "May 17, 2025",
      url: "/membership-profile",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "International Network",
      category: "networking",
      description: "Platform to connect International Counsels/Lawyers/Arbitrators exclusively through CLH portal",
      activated: "May 17, 2025",
      url: "/international-network",
    },
    {
      icon: <HandHeart className="w-5 h-5" />,
      title: "Virtual Mentorship",
      category: "mentorship",
      description: "Virtual Mentorship Program – Exclusive for CLH Budding Advocates",
      activated: "May 17, 2025",
      url: "/virtual-mentorship",
    },
    {
      icon: <Hotel className="w-5 h-5" />,
      title: "Hotel Discounts",
      category: "travel",
      description: "Discount rates to book hotel rooms across major cities of India exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/hotel-discount",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "AI Case Management",
      category: "tools",
      description: "AI-Enabled Case Management Application exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/ai-case-management",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Free Zero Balance Account",
      category: "financial",
      description: "Free Zero Balance Current Account with IDFC First Bank exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/zero-balance-account",
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Legal Database Access",
      category: "resources",
      description:
        "Access to CLH Database having bare acts (Indian & Foreign Acts) & Landmark Judgement exclusively for CLH Members",
      activated: "May 17, 2025",
      url: "/legal-database-access",
    },
  ]

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || benefit.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userProfile={userProfile} isLoading={isLoading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Member Benefits</h1>
          </div>
          <p className="text-gray-600">Explore and access your exclusive CLH member benefits</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search benefits by title or description..."
                className="pl-10 focus:ring-slate-500 focus:border-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Benefits</p>
                  <p className="text-2xl font-bold text-gray-900">{benefits.length}</p>
                </div>
                <Grid3X3 className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Benefits</p>
                  <p className="text-2xl font-bold text-gray-900">{benefits.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{benefitCategories.length - 1}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Search Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredBenefits.length}</p>
                </div>
                <Search className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="benefits" className="w-full">
          <TabsContent value="benefits" className="space-y-6">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {benefitCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={
                    activeCategory === category.id
                      ? "bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-medium"
                      : "text-gray-600 hover:text-gray-900 border-gray-300 px-3 py-1.5 text-xs font-medium"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBenefits.length > 0 ? (
                filteredBenefits.map((benefit, index) => (
                  <Card
                    key={index}
                    className="h-full flex flex-col hover:shadow-lg hover:border-slate-200 transition-all duration-300 group cursor-pointer border border-gray-100"
                    onClick={() => benefit.url && navigate(benefit.url)}
                  >
                    <CardHeader className="pb-3 flex-shrink-0 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-1.5 bg-slate-900 rounded-md flex-shrink-0">
                          <div className="text-white">{React.cloneElement(benefit.icon, { className: "w-4 h-4" })}</div>
                        </div>
                        <Badge className="bg-green-50 text-green-700 border-green-200 flex-shrink-0 text-xs px-2 py-0.5">
                          <CheckCircle className="w-2.5 h-2.5 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-slate-700 transition-colors duration-200 leading-tight mb-1">
                          {benefit.title}
                        </CardTitle>
                        <p className="text-xs text-gray-500 capitalize font-medium">{benefit.category}</p>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col justify-between flex-grow pt-0 px-4 pb-4">
                      <p className="text-xs text-gray-600 leading-relaxed mb-3 flex-grow">{benefit.description}</p>

                      <div className="flex items-center pt-2 border-t border-gray-50">
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate text-xs">Activated: {benefit.activated}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No benefits found</h3>
                      <p className="text-gray-500 mb-6">
                        No benefits match your current criteria. Try adjusting your filters.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("")
                          setActiveCategory("all")
                        }}
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm"
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
