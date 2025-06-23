"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Menu,
  Bell,
  Settings,
  Plus,
  Users,
  LogOut,
  Home,
  X,
  User,
  Scale,
  Receipt,
  ChevronDown,
  Edit,
  Trash,
  ChevronLeft,
  CheckSquare,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import CalendarView from "./CalendarView"
import CasesView from "./CasesView"
import ClientsView from "./ClientsView"
import RemindersView from "./RemindersView"
import AdvocatesView from "./AdvocatesView"
import InvoiceView from "./InvoiceView"
import TaskView from "./TaskView"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, LabelList, Cell } from "recharts"

// Interfaces for API data
interface Case {
  id: number
  title: string
  client_name: string
  type: string
  status: "active" | "pending" | "decided" | "abandoned" | "assigned" | "running"
  priority: "critical" | "high" | "medium" | "low"
  last_update: string
  hearing_date?: string
  next_hearing?: string
}

interface Reminder {
  id: number
  client: string
  client_name: string
  case_title: string
  case: string
  description: string
  date: string
  time: string
  frequency: "Once" | "Daily" | "Weekly" | "Fort Nightly"
  status: "Active" | "Completed"
}

interface Client {
  id: number
  name: string
  status: "Active" | "Inactive"
}

interface UserProfile {
  first_name: string
  last_name: string
  email: string
  photo: string | null
}

interface CourtDetail {
  id: number
  state: string
  district: string
  court: string
  advocate_name: string
  state_code: string
  bar_code_number: string
  year: string
  last_sync: string
  status: "active" | "inactive"
}

interface State {
  id: string
  name: string
  version: string
}

interface District {
  id: string
  name: string
}

interface Complex {
  id: string
  name: string
}

const DashboardLayout = () => {
  const [activeView, setActiveView] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [recentCases, setRecentCases] = useState<Case[]>([])
  const [allCases, setAllCases] = useState<Case[]>([]) // New state for all cases
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [courtDetails, setCourtDetails] = useState<CourtDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editCourtId, setEditCourtId] = useState<number | null>(null)
  const [states, setStates] = useState<State[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [complexes, setComplexes] = useState<Complex[]>([])
  const [formData, setFormData] = useState({
    state: "",
    stateId: "",
    district: "",
    districtId: "",
    court: "",
    complexId: "",
    advocate_name: "",
    state_code: "",
    bar_code_number: "",
    year: "",
    status: "active",
  })
  const [isStatesLoading, setIsStatesLoading] = useState(false)
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false)
  const [isComplexesLoading, setIsComplexesLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  // Calculate case statistics
  const getTodayCases = () => {
    const today = new Date().toISOString().split("T")[0]
    return allCases.filter((case_) => case_.next_hearing === today).length
  }

  const getTomorrowCases = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split("T")[0]
    return allCases.filter((case_) => case_.next_hearing === tomorrowStr).length
  }

  const getRunningCases = () => {
    return allCases.filter((case_) => case_.status === "active" || case_.status === "pending").length
  }

  const getDecidedCases = () => {
    return allCases.filter((case_) => case_.status === "decided").length
  }

  // Chart data using actual case counts
  const getCaseStatusData = () => [
    {
      status: "Running Cases",
      count: getRunningCases(),
      fill: "#3B82F6", // Blue
    },
    {
      status: "Today's Cases",
      count: getTodayCases(),
      fill: "#10B981", // Green
    },
    {
      status: "Tomorrow's Cases",
      count: getTomorrowCases(),
      fill: "#F59E0B", // Orange
    },
    {
      status: "Decided Cases",
      count: getDecidedCases(),
      fill: "#8B5CF6", // Purple
    },
  ]

  const getCaseProgressData = () => [
    {
      category: "Running",
      count: getRunningCases(),
      fill: "#3B82F6",
    },
    {
      category: "Today",
      count: getTodayCases(),
      fill: "#10B981",
    },
    {
      category: "Tomorrow",
      count: getTomorrowCases(),
      fill: "#F59E0B",
    },
    {
      category: "Decided",
      count: getDecidedCases(),
      fill: "#8B5CF6",
    },
  ]

  const chartConfig = {
    count: {
      label: "Cases",
    },
    running: {
      label: "Running Cases",
      color: "#3B82F6",
    },
    today: {
      label: "Today's Cases",
      color: "#10B981",
    },
    tomorrow: {
      label: "Tomorrow's Cases",
      color: "#F59E0B",
    },
    decided: {
      label: "Decided Cases",
      color: "#8B5CF6",
    },
  }

  // Bright colors for pie chart
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"]

  // Format Last Sync date to a readable format
  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Fetch user profile data
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
    } catch (error: any) {
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
    }
  }

  // Fetch states
  const fetchStates = async () => {
    try {
      setIsStatesLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.post(
        `${API_URL}/fetch/states/`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      setStates(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch states.",
        variant: "destructive",
      })
    } finally {
      setIsStatesLoading(false)
    }
  }

  // Fetch districts based on stateId
  const fetchDistricts = async (stateId: string) => {
    try {
      setIsDistrictsLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.post(
        `${API_URL}/fetch/districts/`,
        { stateId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      setDistricts(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch districts.",
        variant: "destructive",
      })
    } finally {
      setIsDistrictsLoading(false)
    }
  }

  // Fetch complexes based on districtId
  const fetchComplexes = async (districtId: string) => {
    try {
      setIsComplexesLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.post(
        `${API_URL}/fetch/complexes/`,
        { district_id: districtId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      setComplexes(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch court complexes.",
        variant: "destructive",
      })
    } finally {
      setIsComplexesLoading(false)
    }
  }

  // Fetch court details
  const fetchCourtDetails = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_URL}/court/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setCourtDetails(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchCourtDetails())
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch court details.",
          variant: "destructive",
        })
      }
    }
  }

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          throw new Error("No access token found. Please log in.")
        }

        // Fetch user profile
        await fetchUserProfile()

        // Fetch all cases
        const casesResponse = await axios.get(`${API_URL}/case/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setAllCases(casesResponse.data)
        setRecentCases(casesResponse.data.slice(0, 3))

        // Fetch upcoming reminders
        const remindersResponse = await axios.get(`${API_URL}/reminder/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setUpcomingReminders(remindersResponse.data.slice(0, 3))

        // Fetch clients
        const clientsResponse = await axios.get(`${API_URL}/client/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setClients(
          clientsResponse.data.map((client: Omit<Client, "status">) => ({
            ...client,
            status: "Active" as const,
          })),
        )

        // Fetch states and court details
        await Promise.all([fetchStates(), fetchCourtDetails()])
      } catch (error: any) {
        if (error.response?.status === 401) {
          await handleTokenRefresh(error, () => fetchData())
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch dashboard data.",
            variant: "destructive",
          })
          navigate("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.stateId) {
      fetchDistricts(formData.stateId)
      setFormData((prev) => ({ ...prev, district: "", districtId: "", court: "", complexId: "" }))
      setDistricts([])
      setComplexes([])
    }
  }, [formData.stateId])

  // Fetch complexes when district changes
  useEffect(() => {
    if (formData.districtId) {
      fetchComplexes(formData.districtId)
      setFormData((prev) => ({ ...prev, court: "", complexId: "" }))
      setComplexes([])
    }
  }, [formData.districtId])

  // Handle token refresh
  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
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

  // Function to get user initials for AvatarFallback
  const getUserInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : ""
    const lastInitial = lastName ? lastName[0].toUpperCase() : ""
    return `${firstInitial}${lastInitial}`
  }

  // Navigation items based on the image
  const navigationItems = [
    { icon: Home, label: "DASHBOARD", key: "dashboard", href: "#" },
    { icon: Calendar, label: "CALENDAR", key: "calendar", href: "#" },
    { icon: Scale, label: "CASES", key: "cases", href: "#", hasDropdown: false },
    { icon: Users, label: "CLIENTS", key: "clients", href: "#" },
    { icon: Scale, label: "JUNIOR ADVOCATES", key: "advocates", href: "#" },
    { icon: Receipt, label: "INVOICE", key: "invoice", href: "#" },
    { icon: Bell, label: "REMINDERS", key: "reminders", href: "#" },
    { icon: CheckSquare, label: "TASK", key: "task", href: "#" }, 
  ]

  const handleNavClick = (key: string) => {
    setActiveView(key)
    setMobileMenuOpen(false)
  }

  const handleProfileClick = () => {
    navigate("/profile")
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string, id?: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(id && { [`${name}Id`]: id }),
    }))
  }

  const handleSaveDetails = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const payload = {
        state: formData.state,
        district: formData.district,
        court: formData.court,
        advocate_name: formData.advocate_name,
        state_code: formData.state_code,
        bar_code_number: formData.bar_code_number,
        year: Number.parseInt(formData.year),
        status: formData.status,
      }
      await axios.post(`${API_URL}/court/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      await fetchCourtDetails()
      setShowForm(false)
      setFormData({
        state: "",
        stateId: "",
        district: "",
        districtId: "",
        court: "",
        complexId: "",
        advocate_name: "",
        state_code: "",
        bar_code_number: "",
        year: "",
        status: "active",
      })
      toast({
        title: "Success",
        description: "Court details saved successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSaveDetails())
      } else {
        toast({
          title: "Error",
          description: "Failed to save court details.",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditCourt = async (court: CourtDetail) => {
    setEditCourtId(court.id)
    const selectedState = states.find((state) => state.name === court.state)
    const stateId = selectedState?.id || ""
    if (stateId) {
      await fetchDistricts(stateId)
      const selectedDistrict = districts.find((district) => district.name === court.district)
      const districtId = selectedDistrict?.id || ""
      if (districtId) {
        await fetchComplexes(districtId)
      }
    }
    setFormData({
      state: court.state,
      stateId: stateId,
      district: court.district,
      districtId: districts.find((district) => district.name === court.district)?.id || "",
      court: court.court,
      complexId: complexes.find((complex) => complex.name === court.court)?.id || "",
      advocate_name: court.advocate_name,
      state_code: court.state_code,
      bar_code_number: court.bar_code_number,
      year: court.year,
      status: court.status,
    })
    setShowEditForm(true)
  }

  const handleUpdateCourt = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const payload = {
        state: formData.state,
        district: formData.district,
        court: formData.court,
        advocate_name: formData.advocate_name,
        state_code: formData.state_code,
        bar_code_number: formData.bar_code_number,
        year: Number.parseInt(formData.year),
        status: formData.status,
      }
      await axios.put(`${API_URL}/court/${editCourtId}/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      await fetchCourtDetails()
      setShowEditForm(false)
      setEditCourtId(null)
      setFormData({
        state: "",
        stateId: "",
        district: "",
        districtId: "",
        court: "",
        complexId: "",
        advocate_name: "",
        state_code: "",
        bar_code_number: "",
        year: "",
        status: "active",
      })
      toast({
        title: "Success",
        description: "Court details updated successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleUpdateCourt())
      } else {
        toast({
          title: "Error",
          description: "Failed to update court details.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteCourt = async (id: number) => {
    if (!confirm("Are you sure you want to delete this court detail?")) return
    try {
      const accessToken = localStorage.getItem("accessToken")
      await axios.delete(`${API_URL}/court/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      await fetchCourtDetails()
      toast({
        title: "Success",
        description: "Court details deleted successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteCourt(id))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete court details.",
          variant: "destructive",
        })
      }
    }
  }

  const renderContent = () => {
    if (activeView !== "dashboard") {
      switch (activeView) {
        case "calendar":
          return <CalendarView />
        case "cases":
          return <CasesView />
        case "clients":
          return <ClientsView />
        case "reminders":
          return <RemindersView />
        case "advocates":
          return <AdvocatesView />
        case "invoice":
          return <InvoiceView />
        case "task":
          return <TaskView/>
        default:
          return <div className="p-8 text-center">Coming Soon: {activeView}</div>
      }
    }

    if (isLoading) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        {/* Running Cases Section */}
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Running Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-1">{getRunningCases()}</div>
                <p className="text-sm text-gray-600">
                  You have {getRunningCases()} running case{getRunningCases() !== 1 ? "s" : ""} scheduled .
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Today's Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-1">{getTodayCases()}</div>
                <p className="text-sm text-gray-600">
                  You have {getTodayCases() === 0 ? "no" : getTodayCases()} case{getTodayCases() !== 1 ? "s" : ""}{" "}
                  scheduled for today.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-orange-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tomorrow's Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-1">{getTomorrowCases()}</div>
                <p className="text-sm text-gray-600">
                  You have {getTomorrowCases() === 0 ? "no" : getTomorrowCases()} case
                  {getTomorrowCases() !== 1 ? "s" : ""} scheduled for tomorrow.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Decided Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 mb-1">{getDecidedCases()}</div>
                <p className="text-sm text-gray-600">
                  You have {getDecidedCases() === 0 ? "no" : getDecidedCases()} decided case
                  {getDecidedCases() !== 1 ? "s" : ""}.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart - Case Status Distribution */}
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Case Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer config={chartConfig} className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
                  <PieChart>
                    <Pie
                      dataKey="count"
                      data={getCaseStatusData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 640 ? 80 : 120} // Smaller radius on mobile
                      innerRadius={window.innerWidth < 640 ? 40 : 60}
                    >
                      {getCaseStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <LabelList
                        dataKey="count"
                        className="fill-white font-bold"
                        stroke="none"
                        fontSize={window.innerWidth < 640 ? 12 : 16} // Smaller font on mobile
                        formatter={(value: number) => (value > 0 ? value : "")}
                      />
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{data.status}</p>
                              <p className="text-blue-600 font-bold">{data.count} cases</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Column Chart - Case Progress */}
            <Card className="bg-white shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Cases Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[300px] sm:h-[350px]">
                  <BarChart
                    data={getCaseProgressData()}
                    margin={{
                      top: window.innerWidth < 640 ? 10 : 20,
                      right: window.innerWidth < 640 ? 10 : 30,
                      left: window.innerWidth < 640 ? 0 : 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: window.innerWidth < 640 ? 10 : 12, fill: "#6B7280" }}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{label}</p>
                              <p className="font-bold" style={{ color: payload[0].payload.fill }}>
                                {payload[0].value} cases
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} fill={(entry: any) => entry.fill}>
                      {getCaseProgressData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Court Details Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">COURT DETAILS</h2>

            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <p className="text-gray-600 mb-4">
                Free yourself from the hassle of adding cases manually. Provide your practicing court details and the
                cases will be fetched automatically from e-court as and when they are registered.
              </p>
              <p className="text-sm text-gray-500 mb-4">Note: This feature is available from BASIC plan and above.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                ADD NOW
              </Button>
            </div>

            {/* Court Details Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Court
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Advocate Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bar Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Sync
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courtDetails.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                          No court details found. Click "ADD NOW" to add your court details.
                        </td>
                      </tr>
                    ) : (
                      courtDetails.map((court) => (
                        <tr key={court.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.state}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.district}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.court}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.advocate_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.state_code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.bar_code_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatLastSync(court.last_sync)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={court.status === "active" ? "default" : "secondary"}>{court.status}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCourt(court)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCourt(court.id)}>
                              <Trash className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Court Details Form */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl min-h-[500px]">
                  <h3 className="text-lg font-bold mb-6">Add District Court Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {isStatesLoading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={formData.state}
                          onValueChange={(value) => {
                            const selectedState = states.find((state) => state.name === value)
                            handleSelectChange("state", value, selectedState?.id)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.id} value={state.name}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isDistrictsLoading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={formData.district}
                          onValueChange={(value) => {
                            const selectedDistrict = districts.find((district) => district.name === value)
                            handleSelectChange("district", value, selectedDistrict?.id)
                          }}
                          disabled={!formData.stateId || isDistrictsLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district.id} value={district.name}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isComplexesLoading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={formData.court}
                          onValueChange={(value) => {
                            const selectedComplex = complexes.find((complex) => complex.name === value)
                            handleSelectChange("court", value, selectedComplex?.id)
                          }}
                          disabled={!formData.districtId || isComplexesLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Court Complex" />
                          </SelectTrigger>
                          <SelectContent>
                            {complexes.map((complex) => (
                              <SelectItem key={complex.id} value={complex.name}>
                                {complex.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        name="advocate_name"
                        placeholder="Advocate Name"
                        value={formData.advocate_name}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <Input
                        name="state_code"
                        placeholder="State Code"
                        value={formData.state_code}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <Input
                        name="bar_code_number"
                        placeholder="Bar Code Number"
                        value={formData.bar_code_number}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        name="year"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <div></div>
                    </div>
                    <p className="text-sm text-orange-600">
                      Cases get synced automatically every 3 hrs. Please wait for at least 3 hours for the cases to get
                      added. For any queries, please contact support on +91 963638 2423
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      CANCEL
                    </Button>
                    <Button onClick={handleSaveDetails}>SAVE DETAILS</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Court Details Form */}
            {showEditForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl min-h-[500px]">
                  <h3 className="text-lg font-bold mb-6">Edit District Court Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {isStatesLoading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={formData.state}
                          onValueChange={(value) => {
                            const selectedState = states.find((state) => state.name === value)
                            handleSelectChange("state", value, selectedState?.id)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.id} value={state.name}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isDistrictsLoading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={formData.district}
                          onValueChange={(value) => {
                            const selectedDistrict = districts.find((district) => district.name === value)
                            handleSelectChange("district", value, selectedDistrict?.id)
                          }}
                          disabled={!formData.stateId || isDistrictsLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district.id} value={district.name}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {isComplexesLoading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <Select
                          value={formData.court}
                          onValueChange={(value) => {
                            const selectedComplex = complexes.find((complex) => complex.name === value)
                            handleSelectChange("court", value, selectedComplex?.id)
                          }}
                          disabled={!formData.districtId || isComplexesLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Court Complex" />
                          </SelectTrigger>
                          <SelectContent>
                            {complexes.map((complex) => (
                              <SelectItem key={complex.id} value={complex.name}>
                                {complex.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        name="advocate_name"
                        placeholder="Advocate Name"
                        value={formData.advocate_name}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <Input
                        name="state_code"
                        placeholder="State Code"
                        value={formData.state_code}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <Input
                        name="bar_code_number"
                        placeholder="Bar Code Number"
                        value={formData.bar_code_number}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        name="year"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <div></div>
                    </div>
                    <p className="text-sm text-orange-600">
                      Cases get synced automatically every 3 hrs. Please wait for at least 3 hours for the cases to get
                      updated. For any queries, please contact support on +91 963638 2423
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditForm(false)
                        setEditCourtId(null)
                        setFormData({
                          state: "",
                          stateId: "",
                          district: "",
                          districtId: "",
                          court: "",
                          complexId: "",
                          advocate_name: "",
                          state_code: "",
                          bar_code_number: "",
                          year: "",
                          status: "active",
                        })
                      }}
                    >
                      CANCEL
                    </Button>
                    <Button onClick={handleUpdateCourt}>UPDATE DETAILS</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg px-3 py-2"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </Button>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-3 py-2 h-auto transition-colors",
                  activeView === item.key
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
                onClick={() => handleNavClick(item.key)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3 ml-1" />}
              </Button>
            ))}
          </nav>
        </div>

        {/* User Profile
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile?.photo || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {userProfile ? getUserInitials(userProfile.first_name, userProfile.last_name) : "JD"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  {userProfile ? userProfile.first_name : "JOHN"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </header>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">CLH Legal</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant={activeView === item.key ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => handleNavClick(item.key)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  )
}

export default DashboardLayout
