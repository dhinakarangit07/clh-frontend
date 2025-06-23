"use client"

import { ArrowLeft, Package, CheckCircle, Truck, MapPin, User, Mail, Phone, Home } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  district: string
  state: string
  pinCode: string
  status: string
}

interface TrackingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "active" | "pending"
}

export default function HandbagRequest() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    district: "",
    state: "",
    pinCode: "",
    status: "Pending",
  })
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const API_URL = `${import.meta.env.VITE_API_URL}/api/handbag-request/`
  const PROFILE_API_URL = `${import.meta.env.VITE_API_URL}/api/user_profile/`
  const CHECK_API_URL = `${import.meta.env.VITE_API_URL}/api/handbag-request/check/`

  // Map backend status to step index
  const statusToStep: { [key: string]: number } = {
    Pending: 0,
    Approved: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
  }

  // Fetch user profile and check for existing handbag request
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) throw new Error("No access token found. Please log in.")

        // Fetch profile
        const profileResponse = await axios.get(PROFILE_API_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const profile = profileResponse.data
        setFormData((prev) => ({
          ...prev,
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || "",
          phone: profile.advocate_details?.[0]?.contact_number || "",
        }))

        // Check for existing handbag request
        const handbagResponse = await axios.get(CHECK_API_URL, { headers: { Authorization: `Bearer ${accessToken}` } })
        if (handbagResponse.data.exists !== false) {
          setFormData((prev) => ({
            ...prev,
            firstName: handbagResponse.data.first_name,
            lastName: handbagResponse.data.last_name,
            email: handbagResponse.data.email,
            phone: handbagResponse.data.phone,
            address1: handbagResponse.data.address1,
            address2: handbagResponse.data.address2 || "",
            district: handbagResponse.data.district,
            state: handbagResponse.data.state,
            pinCode: handbagResponse.data.pin_code,
            status: handbagResponse.data.status,
          }))
          setCurrentStep(statusToStep[handbagResponse.data.status] || 0)
          setSubmitted(true)
        }
      } catch (error: any) {
        // Handle errors as before
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) {
        throw new Error("No refresh token found. Please log in again.")
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
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
      // navigate('/login')
    }
  }

  const trackingSteps: TrackingStep[] = [
    {
      id: "pending",
      title: "Request Submitted",
      description: "Your handbag request has been received",
      icon: <Package className="w-5 h-5" />,
      status: currentStep >= 0 ? "completed" : "pending",
    },
    {
      id: "approved",
      title: "Request Approved",
      description: "Your request has been approved for processing",
      icon: <CheckCircle className="w-5 h-5" />,
      status: currentStep >= 1 ? "completed" : currentStep === 0 ? "active" : "pending",
    },
    {
      id: "processing",
      title: "Processing",
      description: "Your handbag is being prepared for shipment",
      icon: <Package className="w-5 h-5" />,
      status: currentStep >= 2 ? "completed" : currentStep === 1 ? "active" : "pending",
    },
    {
      id: "shipped",
      title: "Shipped",
      description: "Your handbag is on its way to you",
      icon: <Truck className="w-5 h-5" />,
      status: currentStep >= 3 ? "completed" : currentStep === 2 ? "active" : "pending",
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Your handbag has been delivered",
      icon: <MapPin className="w-5 h-5" />,
      status: currentStep >= 4 ? "completed" : currentStep === 3 ? "active" : "pending",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address1 ||
      !formData.district ||
      !formData.state ||
      !formData.pinCode
    ) {
      toast({
        title: "Error",
        description: "All required fields must be filled.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address1: formData.address1,
        address2: formData.address2 || null,
        district: formData.district,
        state: formData.state,
        pin_code: formData.pinCode,
        status: "Pending",
      }

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      toast({
        title: "Success",
        description: "Handbag request submitted successfully!",
      })
      setFormData((prev) => ({ ...prev, status: response.data.status }))
      setCurrentStep(statusToStep[response.data.status] || 0)
      setSubmitted(true)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSubmit(e))
      } else {
        toast({
          title: "Error",
          description:
            error.response?.data?.detail ||
            Object.values(error.response?.data || {}).join(" ") ||
            "Failed to submit request.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStepStyles = (step: TrackingStep) => {
    switch (step.status) {
      case "completed":
        return {
          circle: "bg-emerald-600 text-white border-emerald-600",
          text: "text-emerald-600",
          line: "bg-emerald-600",
        }
      case "active":
        return {
          circle: "bg-slate-900 text-white border-slate-900 animate-pulse",
          text: "text-slate-900",
          line: "bg-gray-300",
        }
      case "pending":
        return {
          circle: "bg-gray-200 text-gray-400 border-gray-300",
          text: "text-gray-400",
          line: "bg-gray-300",
        }
      default:
        return {
          circle: "bg-gray-200 text-gray-400 border-gray-300",
          text: "text-gray-400",
          line: "bg-gray-300",
        }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Handbag Request Form</h1>
          </div>
          <p className="text-gray-600">Submit your details to claim your free Advocate Handbag</p>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-900"></div>
          </div>
        )}

        {/* Form Section */}
        {!submitted && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Request Your Handbag</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <User className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mt-8">
                    <Home className="w-5 h-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="address1" className="text-sm font-medium text-gray-700">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        id="address1"
                        name="address1"
                        value={formData.address1}
                        onChange={handleInputChange}
                        placeholder="Street address, P.O. box, company name, c/o"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address2" className="text-sm font-medium text-gray-700">
                        Address Line 2 <span className="text-gray-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="address2"
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="district" className="text-sm font-medium text-gray-700">
                          District *
                        </label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="state" className="text-sm font-medium text-gray-700">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your state"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pinCode" className="text-sm font-medium text-gray-700">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          id="pinCode"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          placeholder="123456"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800" size="lg">
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tracking Section */}
        {submitted && (
          <div className="space-y-8">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span> {formData.firstName} {formData.lastName}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span> {formData.email}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span> {formData.phone}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">Address:</span> {formData.address1}
                    {formData.address2 && `, ${formData.address2}`}, {formData.district}, {formData.state}{" "}
                    {formData.pinCode}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Track Your Request</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-300 hidden md:block">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-1000 ease-in-out"
                      style={{ width: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
                    {trackingSteps.map((step, index) => {
                      const styles = getStepStyles(step)
                      return (
                        <div key={step.id} className="flex flex-col items-center text-center relative">
                          {/* Step Circle */}
                          <div
                            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 relative z-10 ${styles.circle}`}
                          >
                            {step.status === "completed" ? <CheckCircle className="w-6 h-6" /> : step.icon}
                          </div>

                          {/* Step Content */}
                          <div className="space-y-2">
                            <h4 className={`font-semibold ${styles.text}`}>{step.title}</h4>
                            <p className="text-sm text-gray-600 max-w-32">{step.description}</p>
                            {step.status === "active" && (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
