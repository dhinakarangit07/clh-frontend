"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  FileText,
  User,
  Scale,
  Clock,
  CheckCircle,
  AlertCircle,
  Gavel,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface CaseDetails {
  case_details: string[][]
  case_status: string[][]
  petitioner_advocate: string[][]
  respondent_advocate: string[][]
  acts: string[][]
  case_history: string[][]
  order: string[][]
}

const ECourtsSearch: React.FC = () => {
  const [cnrNumber, setCnrNumber] = useState("")
  const [caseData, setCaseData] = useState<CaseDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()

  const BASE_API_URL = import.meta.env.VITE_API_URL

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setCaseData(null)

    if (!cnrNumber.trim()) {
      setError("Please enter a CNR number")
      setLoading(false)
      toast({
        title: "Error",
        description: "CNR number is required.",
        variant: "destructive",
      })
      return
    }

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        throw new Error('No access token found. Please log in.')
      }

      const response = await axios.get(`${BASE_API_URL}/api/case/scrape/${cnrNumber}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setCaseData(response.data)
      toast({
        title: "Success",
        description: "Case details loaded successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSearch(e))
      } else {
        const errorMessage = error.response?.data?.detail || "Case not found. Please check the CNR number and try again."
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token found. Please log in again.')
      }
      const response = await axios.post(`${BASE_API_URL}/api/token/refresh/`, {
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

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("disposed") || lowerStatus.includes("closed")) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Disposed
        </Badge>
      )
    } else if (lowerStatus.includes("pending") || lowerStatus.includes("awaiting")) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gray-50 text-gray-700 border-gray-200">
          <FileText className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "()") return "Not specified"
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  const parseKeyValue = (arr: string[][]) => {
    const result: Record<string, string> = {}
    arr.forEach((row) => {
      for (let i = 0; i < row.length; i += 2) {
        if (row[i] && row[i + 1]) {
          result[row[i]] = row[i + 1]
        }
      }
    })
    return result
  }

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
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">E-Courts Case Search</h1>
          </div>
          <p className="text-gray-600">Search for case details using CNR number</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search by CNR Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CNR Number</label>
                <input
                  type="text"
                  value={cnrNumber}
                  onChange={(e) => setCnrNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="e.g., MHAU010012342022"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Enter the complete CNR (Case Number Register) number to search for case details
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Searching..." : "Search Case"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Case Details */}
        {caseData && (
          <div className="space-y-6">
            {/* Case Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Case Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parseKeyValue(caseData.case_details) &&
                    Object.entries(parseKeyValue(caseData.case_details)).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">{key}</p>
                        <p className="text-gray-900">{value}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Case Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parseKeyValue(caseData.case_status) &&
                    Object.entries(parseKeyValue(caseData.case_status)).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-gray-600">{key}</span>
                        <div className="text-right">
                          {key === "Case Status" ? (
                            getStatusBadge(value)
                          ) : (
                            <span className="text-gray-900">{formatDate(value)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Parties */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Petitioner & Advocate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {caseData.petitioner_advocate.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{item[0]}</pre>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Respondent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {caseData.respondent_advocate.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{item[0]}</pre>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acts */}
            {caseData.acts.some((act) => act.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Legal Acts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {caseData.acts
                      .filter((act) => act.length > 0)
                      .map((act, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline">
                            {act[0]} - Section {act[1]}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Case History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Case History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.case_history.slice(1).map((hearing, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Judge</p>
                          <p className="text-sm text-gray-900 mt-1">{hearing[0]}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Business Date</p>
                          <p className="text-sm text-gray-900 mt-1">{formatDate(hearing[1])}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Hearing Date</p>
                          <p className="text-sm text-gray-900 mt-1">
                            {hearing[2] ? formatDate(hearing[2]) : "Not scheduled"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Purpose</p>
                          <Badge
                            variant={hearing[3] === "Disposed" ? "default" : "secondary"}
                            className={hearing[3] === "Disposed" ? "bg-emerald-50 text-emerald-700" : ""}
                          >
                            {hearing[3]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        
      </div>
    </div>
  )
}

export default ECourtsSearch