"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Building2,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface CoworkingRequest {
  id: number
  location: string
  date_needed: string
  duration: string
  purpose_of_visit: string
  status: "approved" | "pending" | "rejected"
  created_at: string
  updated_at?: string
  notes?: string
}

// Loading skeleton for request cards
const RequestCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-5 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
)

const CoworkingDashboard: React.FC = () => {
  const [location, setLocation] = useState("")
  const [dateNeeded, setDateNeeded] = useState("")
  const [duration, setDuration] = useState("")
  const [purpose, setPurpose] = useState("")
  const [requests, setRequests] = useState<CoworkingRequest[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const API_URL = `${import.meta.env.VITE_API_URL}/api/coworking-request/`

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          throw new Error('No access token found. Please log in.')
        }
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setRequests(response.data)
      } catch (error: any) {
        if (error.response?.status === 401) {
          await handleTokenRefresh(error, fetchRequests)
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch coworking requests.",
            variant: "destructive",
          })
          if (error.message === 'No access token found. Please log in.') {
            navigate('/login')
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token found. Please log in again.')
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      })
      localStorage.setItem('accessToken', response.data.access)
      await retryFn()
    } catch (refreshError) {
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/login')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    if (!location || !dateNeeded || !duration || !purpose) {
      setError("Please fill out all fields")
      setIsSubmitting(false)
      return
    }

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        throw new Error('No access token found. Please log in.')
      }

      const payload = {
        location,
        date_needed: dateNeeded,
        duration,
        purpose_of_visit: purpose,
        status: "pending",
      }

      await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      toast({
        title: "Success",
        description: "Request submitted successfully!",
      })
      setSuccess("Request submitted successfully!")
      setLocation("")
      setDateNeeded("")
      setDuration("")
      setPurpose("")

      // Refresh requests
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setRequests(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSubmit(e))
      } else {
        const errorMessage = error.response?.data?.detail || Object.values(error.response?.data || {}).join(' ') || "Failed to submit request."
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: "Approved",
        }
      case "pending":
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-amber-50 text-amber-700 border-amber-200",
          label: "Pending Review",
        }
      case "rejected":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-50 text-red-700 border-red-200",
          label: "Rejected",
        }
      default:
        return {
          variant: "outline" as const,
          icon: AlertCircle,
          className: "bg-gray-50 text-gray-700 border-gray-200",
          label: "Unknown",
        }
    }
  }

  const getStats = () => {
    const total = requests.length
    const approved = requests.filter((r) => r.status === "approved").length
    const pending = requests.filter((r) => r.status === "pending").length
    const rejected = requests.filter((r) => r.status === "rejected").length

    return { total, approved, pending, rejected }
  }

  const stats = getStats()

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
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Coworking Space Management</h1>
          </div>
          <p className="text-gray-600">Submit requests and track your workspace bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Request Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Submit New Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-600 text-sm font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="e.g., Downtown Office"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Needed
                  </label>
                  <input
                    type="date"
                    value={dateNeeded}
                    onChange={(e) => setDateNeeded(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select duration</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="Half Day">Half Day</option>
                    <option value="1 Day">1 Day</option>
                    <option value="2 Days">2 Days</option>
                    <option value="1 Week">1 Week</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Purpose of Visit
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Describe the purpose of your visit..."
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <RequestCardSkeleton />
                <RequestCardSkeleton />
                <RequestCardSkeleton />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No requests found</p>
                <p className="text-gray-400 text-sm">Submit your first request above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const statusConfig = getStatusConfig(request.status)
                  const StatusIcon = statusConfig.icon

                  return (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                {request.location}
                              </h3>
                              <p className="text-gray-600 mt-1">{request.purpose_of_visit}</p>
                            </div>
                            <Badge className={statusConfig.className}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Date: {new Date(request.date_needed).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Duration: {request.duration}</span>
                            </div>
                            <div className="text-gray-500">
                              Submitted: {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {request.notes && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm text-gray-700">
                                <strong>Notes:</strong> {request.notes}
                              </p>
                            </div>
                          )}

                          {request.updated_at && (
                            <div className="text-xs text-gray-500">
                              Last updated: {new Date(request.updated_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CoworkingDashboard