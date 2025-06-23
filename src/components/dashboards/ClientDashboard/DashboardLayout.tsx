"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Menu,
  Bell,
  Settings,
  LogOut,
  Home,
  X,
  User,
  Scale,
  Receipt,
  ChevronDown,
  ChevronLeft,
  FileText,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
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
import RemindersView from "./RemindersView"
import InvoiceView from "./InvoiceView"
import TaskView from "./TaskView"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"

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

interface Invoice {
  id: number
  invoice_number: string
  client: number
  amount: string
  payment_date: string
  payment_mode: string
  reference_no: string
  remarks: string
  created_at: string
  created_by: number
  payments: Array<{
    id: number
    amount: string
    payment_date: string
    payment_mode: string
    reference_no: string
    remarks: string
    created_at: string
    created_by: number
  }>
  paid_amount: number
  pending_amount: number
}

interface UserProfile {
  first_name: string
  last_name: string
  email: string
  photo: string | null
  groups?: string[]
  client_details?: Array<{
    name: string
    email: string
    contact_number: string
    address: string
    is_corporate: boolean
    payment_amount: string
    created_at: string
  }>
  advocate_details?: any[]
  student_details?: any[]
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
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
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
  const [totalCases, setTotalCases] = useState(0)
  const [totalReminders, setTotalReminders] = useState(0)
  const [caseStatusData, setCaseStatusData] = useState([
    { name: "Active", value: 0, color: "#3b82f6" },
    { name: "Pending", value: 0, color: "#f59e0b" },
    { name: "Decided", value: 0, color: "#10b981" },
    { name: "Abandoned", value: 0, color: "#ef4444" },
  ])
  const [priorityDistribution, setPriorityDistribution] = useState([
    { name: "Critical", value: 0, color: "#dc2626" },
    { name: "High", value: 0, color: "#ea580c" },
    { name: "Medium", value: 0, color: "#ca8a04" },
    { name: "Low", value: 0, color: "#16a34a" },
  ])
  const navigate = useNavigate()
  const { toast } = useToast()

  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  // Chart configurations with proper colors
  const caseStatusConfig = {
    active: {
      label: "Active",
      color: "#3b82f6",
    },
    pending: {
      label: "Pending",
      color: "#f59e0b",
    },
    decided: {
      label: "Decided",
      color: "#10b981",
    },
    abandoned: {
      label: "Abandoned",
      color: "#ef4444",
    },
  }

  const priorityConfig = {
    critical: {
      label: "Critical",
      color: "#dc2626",
    },
    high: {
      label: "High",
      color: "#ea580c",
    },
    medium: {
      label: "Medium",
      color: "#ca8a04",
    },
    low: {
      label: "Low",
      color: "#16a34a",
    },
  }

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

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_URL}/client/invoice/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setInvoices(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchInvoices())
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch invoices.",
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

        // Fetch all data in parallel
        await Promise.all([
          fetchUserProfile(),
          (async () => {
            const casesResponse = await axios.get(`${API_URL}/client/case/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            const cases = casesResponse.data
            setRecentCases(cases.slice(0, 3))
            setTotalCases(cases.length)

            // Compute case status data
            const statusCounts = cases.reduce(
              (acc: Record<string, number>, case_: Case) => {
                acc[case_.status] = (acc[case_.status] || 0) + 1
                return acc
              },
              { active: 0, pending: 0, decided: 0, abandoned: 0 }
            )
            setCaseStatusData([
              { name: "Active", value: statusCounts.active, color: "#3b82f6" },
              { name: "Pending", value: statusCounts.pending, color: "#f59e0b" },
              { name: "Decided", value: statusCounts.decided, color: "#10b981" },
              { name: "Abandoned", value: statusCounts.abandoned, color: "#ef4444" },
            ])

            // Compute case priority data
            const priorityCounts = cases.reduce(
              (acc: Record<string, number>, case_: Case) => {
                acc[case_.priority] = (acc[case_.priority] || 0) + 1
                return acc
              },
              { critical: 0, high: 0, medium: 0, low: 0 }
            )
            setPriorityDistribution([
              { name: "Critical", value: priorityCounts.critical, color: "#dc2626" },
              { name: "High", value: priorityCounts.high, color: "#ea580c" },
              { name: "Medium", value: priorityCounts.medium, color: "#ca8a04" },
              { name: "Low", value: priorityCounts.low, color: "#16a34a" },
            ])
          })(),
          (async () => {
            const remindersResponse = await axios.get(`${API_URL}/client/reminder/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            const reminders = remindersResponse.data
            setUpcomingReminders(reminders.slice(0, 3))
            setTotalReminders(reminders.length)
          })(),
          (async () => {
            const clientsResponse = await axios.get(`${API_URL}/client/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            setClients(
              clientsResponse.data.map((client: Omit<Client, "status">) => ({
                ...client,
                status: "Active" as const,
              })),
            )
          })(),
          fetchInvoices(),
          fetchStates(),
          fetchCourtDetails(),
        ])
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

  // Navigation items based on is_corporate
  const navigationItems = useMemo(() => {
    const isCorporate = userProfile?.client_details?.[0]?.is_corporate || false
    return [
      { icon: Home, label: "DASHBOARD", key: "dashboard", href: "#" },
      { icon: Calendar, label: "CALENDAR", key: "calendar", href: "#" },
      { icon: Scale, label: "CASES", key: "cases", href: "#", hasDropdown: false },
      { icon: Bell, label: "REMINDERS", key: "reminders", href: "#" },
      { icon: Receipt, label: "INVOICE", key: "invoice", href: "#" },
      ...(isCorporate ? [{ icon: CheckSquare, label: "TASK", key: "task", href: "#" }] : []),
    ]
  }, [userProfile])

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

  // Calculate statistics
  const getTotalCases = () => {
    return totalCases
  }

  const getTotalReminders = () => {
    return totalReminders
  }

  const getPendingInvoices = () => {
    return invoices.filter((invoice) => invoice.pending_amount > 0).length
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
        case "reminders":
          return <RemindersView />
        case "invoice":
          return <InvoiceView />
        case "task":
          if (!userProfile?.client_details?.[0]?.is_corporate) {
            return <div className="p-4 sm:p-6 text-center">Access Denied: Task view is only available for corporate clients.</div>
          }
          return <TaskView />
        default:
          return <div className="p-4 sm:p-6 text-center">Coming Soon: {activeView}</div>
      }
    }

    if (isLoading) {
      return (
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border animate-pulse">
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
      <div className="space-y-6 sm:space-y-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">Total Cases</CardTitle>
                <div className="p-1 sm:p-2 bg-blue-500 rounded-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1 sm:mb-2">{getTotalCases()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-amber-700">Total Reminders</CardTitle>
                <div className="p-1 sm:p-2 bg-amber-500 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 mb-1 sm:mb-2">{getTotalReminders()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-700">Pending Invoices</CardTitle>
                <div className="p-1 sm:p-2 bg-green-500 rounded-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-900 mb-1 sm:mb-2">{getPendingInvoices()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Case Status Distribution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">Case Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartContainer config={caseStatusConfig} className="h-48 sm:h-64 w-full max-w-[300px] sm:max-w-[400px]">
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={caseStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {caseStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 px-4 sm:px-6">
              {caseStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Priority Distribution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">Case Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartContainer config={priorityConfig} className="h-48 sm:h-64 w-full max-w-[300px] sm:max-w-[400px]">
                <BarChart data={priorityDistribution} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">Recent Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentCases.slice(0, 5).map((case_, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-900">{case_.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{case_.client_name}</p>
                    </div>
                    <Badge
                      variant={
                        case_.status === "active" ? "default" : case_.status === "pending" ? "secondary" : "outline"
                      }
                      className="text-xs sm:text-sm"
                    >
                      {case_.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {upcomingReminders.slice(0, 5).map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm sm:text-base text-gray-900">{reminder.case_title}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{reminder.client_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{reminder.date}</p>
                      <p className="text-xs text-gray-600">{reminder.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 sm:space-x-8">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1 text-xs xl:text-sm font-medium px-2 xl:px-3 py-2 h-auto transition-colors",
                  activeView === item.key
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
                onClick={() => handleNavClick(item.key)}
              >
                <item.icon className="w-4 h-4 xl:w-5 xl:h-5" />
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 ml-1" />}
              </Button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 h-auto">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage src={userProfile?.photo || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs sm:text-sm">
                    {userProfile ? getUserInitials(userProfile.first_name, userProfile.last_name) : "JD"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm font-medium text-gray-900 hidden sm:block">
                  {userProfile ? userProfile.first_name : "JOHN"}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 sm:w-48" align="end">
              <DropdownMenuItem onClick={handleProfileClick} className="text-xs sm:text-sm">
                <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs sm:text-sm">
                <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 text-xs sm:text-sm">
                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
          <div className="fixed inset-y-0 left-0 w-64 sm:w-72 bg-white shadow-xl">
            <div className="p-4 sm:p-5 border-b">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base sm:text-lg text-gray-900">CLH Legal</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <nav className="p-4 sm:p-5 space-y-2">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant={activeView === item.key ? "default" : "ghost"}
                  className="w-full justify-start gap-2 sm:gap-3 text-sm sm:text-base"
                  onClick={() => handleNavClick(item.key)}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">{renderContent()}</main>
    </div>
  )
}

export default DashboardLayout