"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Search,
  FileText,
  Clock,
  CalendarIcon,
  User,
  AlertTriangle,
  Loader2,
  Shield,
  Eye,
  MessageSquare,
  Download,
  Paperclip,
  FileSpreadsheet,
  FileImage,
  FileIcon as FilePdf,
  FileVideo,
  FileAudio,
  Archive,
  File,
  UserPlus,
  Users,
  X,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: string
  uploaded_at: string
}

interface JuniorAdvocate {
  id: number
  name: string
  email: string
  mobile_no: string
  can_add_cases: boolean
  can_modify_cases: boolean
  can_view_all_cases: boolean
  can_view_assigned_cases: boolean
  can_view_case_fees: boolean
  created_at: string
  created_by: number
}

interface Client {
  id: number
  name: string
  email: string
  contact_number: string
  address: string
  created_at: string
  created_by: number
  is_corporate: boolean
  payment_amount: string
}

interface Task {
  id: number
  title: string
  description: string
  document_type: "NDA" | "Contract" | "Agreement" | "Legal Brief" | "Other"
  start_date: string
  review_date: string
  deadline: string
  priority: "critical" | "high" | "medium" | "low"
  status: "pending" | "in_review" | "feedback_required" | "completed" | "rejected"
  review_feedback: string | null
  nda_details: string | null
  uploaded_files: UploadedFile[]
  assigned_junior_advocate: JuniorAdvocate | null
  created_at: string
  updated_at: string
  created_by_client: string
  completed_at?: string
  completed_by?: string
}

const TaskCardSkeleton = () => (
  <Card className="animate-pulse border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="h-6 bg-gray-200 rounded-lg w-64"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-20"></div>
              <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const AdvocateTaskView = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [juniorAdvocates, setJuniorAdvocates] = useState<JuniorAdvocate[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState(false)
  const [assigningTaskId, setAssigningTaskId] = useState<number | null>(null)
  const [changingStatusTaskId, setChangingStatusTaskId] = useState<number | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all")
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedJuniorAdvocate, setSelectedJuniorAdvocate] = useState<string>("0")

  const { toast } = useToast()
  const navigate = useNavigate()

  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  useEffect(() => {
    fetchClients()
    fetchTasks()
    fetchJuniorAdvocates()
  }, [])

  const fetchClients = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/client/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setClients(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchClients())
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to fetch clients.",
          variant: "destructive",
        })
      }
    }
  }

  const fetchTasks = async () => {
    try {
      setIsInitialLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/task/assigned/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Map API response to Task interface
      const mappedTasks: Task[] = await Promise.all(
        response.data.map(async (task: any) => {
          let client: Client = clients.find((c) => c.id === task.created_by) || {
            id: task.created_by,
            name: "Loading...",
            email: "",
            contact_number: "",
            address: "",
            created_at: "",
            created_by: 0,
            is_corporate: false,
            payment_amount: "0.00",
          }

          // If client not found in local state, fetch from API
          if (!clients.find((c) => c.id === task.created_by)) {
            try {
              const clientResponse = await axios.get(`${API_URL}/client/${task.created_by}/`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              client = clientResponse.data
              setClients((prev) => [...prev, clientResponse.data])
            } catch (clientError: any) {
              console.error(`Failed to fetch client ${task.created_by}:`, clientError)
              client.name = "Client Not Found"
            }
          }

          return {
            id: task.id,
            title: task.title,
            description: task.description || "",
            document_type: task.document_type,
            start_date: task.start_date || "",
            review_date: task.review_date || "",
            deadline: task.deadline || "",
            priority: task.priority,
            status: task.status,
            review_feedback: task.review_feedback || null,
            nda_details: task.nda_details || null,
            uploaded_files: task.uploaded_files.map((file: any) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              type: file.type,
              file: file.file,
              uploaded_at: file.uploaded_at,
            })),
            assigned_junior_advocate: task.assigned_junior_advocate
              ? juniorAdvocates.find((ja) => ja.id === task.assigned_junior_advocate) || null
              : null,
            created_at: task.created_at,
            updated_at: task.updated_at,
            created_by_client: client.name,
            completed_at: task.status === "completed" ? task.updated_at : undefined,
            completed_by: task.status === "completed" ? "Senior Advocate" : undefined,
          }
        })
      )

      setTasks(mappedTasks)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchTasks())
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to fetch tasks.",
          variant: "destructive",
        })
        if (error.message === "No access token found. Please log in.") {
          navigate("/login")
        }
      }
    } finally {
      setIsInitialLoading(false)
    }
  }

  const fetchJuniorAdvocates = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/advocate/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Filter for junior advocates only
      const juniorAdvs = response.data
      setJuniorAdvocates(juniorAdvs)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchJuniorAdvocates())
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to fetch junior advocates.",
          variant: "destructive",
        })
      }
    }
  }

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

  const handleAssignJuniorAdvocate = (task: Task) => {
    setSelectedTask(task)
    setSelectedJuniorAdvocate(task.assigned_junior_advocate?.id.toString() || "0")
    setShowAssignModal(true)
  }

  const handleSaveAssignment = async () => {
    if (!selectedTask) return

    setIsAssigning(true)
    setAssigningTaskId(selectedTask.id)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const formData = new FormData()
      formData.append("assigned_junior_advocate", selectedJuniorAdvocate === "0" ? "" : selectedJuniorAdvocate)

      await axios.put(`${API_URL}/task/${selectedTask.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      const juniorAdvocate = selectedJuniorAdvocate
        ? juniorAdvocates.find((ja) => ja.id === Number.parseInt(selectedJuniorAdvocate))
        : null

      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                assigned_junior_advocate: juniorAdvocate || null,
                updated_at: new Date().toISOString(),
              }
            : task,
        ),
      )

      toast({
        title: "Success",
        description: juniorAdvocate
          ? `Task assigned to ${juniorAdvocate.name} successfully!`
          : "Junior advocate assignment removed successfully!",
      })

      setShowAssignModal(false)
      setSelectedTask(null)
      setSelectedJuniorAdvocate("")
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSaveAssignment())
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to assign junior advocate.",
          variant: "destructive",
        })
      }
    } finally {
      setIsAssigning(false)
      setAssigningTaskId(null)
    }
  }

  const handleChangeStatus = async (task: Task, newStatus: string) => {
    setChangingStatusTaskId(task.id)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const formData = new FormData()
      formData.append("status", newStatus)

      await axios.patch(`${API_URL}/task/${task.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: newStatus as Task["status"],
                completed_at: newStatus === "completed" ? new Date().toISOString() : undefined,
                completed_by: newStatus === "completed" ? "Senior Advocate" : undefined,
                updated_at: new Date().toISOString(),
              }
            : t,
        ),
      )

      toast({
        title: "Status Updated",
        description: `"${task.title}" status changed to ${newStatus.replace("_", " ")} successfully!`,
        duration: 5000,
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleChangeStatus(task, newStatus))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to update task status.",
          variant: "destructive",
        })
      }
    } finally {
      setChangingStatusTaskId(null)
    }
  }

  const downloadFile = async (file: UploadedFile) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("Please log in to download files.")
      }

      const response = await axios.get(file.file, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download started",
        description: `Downloading ${file.name}...`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || `Failed to download ${file.name}.`,
        variant: "destructive",
      })
      if (error.message === "Please log in to download files.") {
        navigate("/login")
      }
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FilePdf className="w-5 h-5 text-red-500" />
    if (fileType.includes("image")) return <FileImage className="w-5 h-5 text-green-500" />
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    if (fileType.includes("video")) return <FileVideo className="w-5 h-5 text-purple-500" />
    if (fileType.includes("audio")) return <FileAudio className="w-5 h-5 text-blue-500" />
    if (fileType.includes("zip") || fileType.includes("rar")) return <Archive className="w-5 h-5 text-orange-500" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-0"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0"
      case "low":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white border-0"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
      case "in_review":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
      case "feedback_required":
        return "bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0"
      case "pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"
      case "rejected":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0"
    }
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "NDA":
        return <Shield className="w-5 h-5 text-blue-500" />
      case "Contract":
        return <FileText className="w-5 h-5 text-green-500" />
      case "Agreement":
        return <FileText className="w-5 h-5 text-purple-500" />
      case "Legal Brief":
        return <FileText className="w-5 h-5 text-orange-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const aPriority = priorityOrder[a.priority]
    const bPriority = priorityOrder[b.priority]

    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }

    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  const filteredTasks = sortedTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.created_by_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assigned_junior_advocate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    const matchesAssignment =
      selectedAssignment === "all" ||
      (selectedAssignment === "assigned" && task.assigned_junior_advocate) ||
      (selectedAssignment === "unassigned" && !task.assigned_junior_advocate)

    return matchesSearch && matchesPriority && matchesStatus && matchesAssignment
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Advocate Tasks
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Review client tasks, assign junior advocates, and update task status
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search tasks, clients, or junior advocates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/90 text-gray-900 placeholder:text-gray-500"
                  disabled={isInitialLoading}
                />
              </div>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="feedback_required">Feedback Required</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                  <SelectValue placeholder="Filter by assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {showAssignModal && selectedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Assign Junior Advocate</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAssignModal(false)}
                    className="hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Task: {selectedTask.title}</h4>
                  <p className="text-sm text-gray-600">Client: {selectedTask.created_by_client}</p>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-bold text-gray-700">Select Junior Advocate</Label>
                  <Select value={selectedJuniorAdvocate} onValueChange={setSelectedJuniorAdvocate}>
                    <SelectTrigger className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20">
                      <SelectValue placeholder="Choose junior advocate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Remove Assignment</SelectItem>
                      {juniorAdvocates.map((advocate) => (
                        <SelectItem key={advocate.id} value={advocate.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p className="font-medium">{advocate.name}</p>
                              <p className="text-xs text-gray-500">{advocate.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{advocate.mobile_no}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveAssignment}
                    disabled={isAssigning}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isAssigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isAssigning ? "Assigning..." : "Save Assignment"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignModal(false)}
                    disabled={isAssigning}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6">
          {isInitialLoading ? (
            <>
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No tasks found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || selectedPriority !== "all" || selectedStatus !== "all" || selectedAssignment !== "all"
                    ? "No tasks match your search criteria. Try adjusting your filters."
                    : "No client tasks are currently available for review."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const daysUntilDeadline = getDaysUntilDeadline(task.deadline)
              const isOverdue = daysUntilDeadline < 0
              const isUrgent = daysUntilDeadline <= 2 && daysUntilDeadline >= 0

              return (
                <Card
                  key={task.id}
                  className={cn(
                    "border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] animate-fade-in",
                    isOverdue && "ring-2 ring-red-200",
                    isUrgent && "ring-2 ring-orange-200",
                    task.status === "completed" && "ring-2 ring-green-200 bg-green-50/30",
                  )}
                >
                  <div
                    className={cn(
                      "h-1 bg-gradient-to-r",
                      task.priority === "critical"
                        ? "from-red-500 to-red-600"
                        : task.priority === "high"
                          ? "from-orange-500 to-orange-600"
                          : task.priority === "medium"
                            ? "from-yellow-500 to-yellow-600"
                            : "from-green-500 to-green-600",
                    )}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-3">
                            {getDocumentTypeIcon(task.document_type)}
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {task.title}
                            </h3>
                            {task.status === "completed" && <CheckCircle className="w-6 h-6 text-green-500" />}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={cn(getPriorityColor(task.priority))}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                            <Badge className={cn(getStatusColor(task.status))}>
                              {task.status.replace("_", " ").charAt(0).toUpperCase() +
                                task.status.replace("_", " ").slice(1)}
                            </Badge>
                            {isOverdue && task.status !== "completed" && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {isUrgent && task.status !== "completed" && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <User className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Client: {task.created_by_client}</span>
                          </div>
                          {task.assigned_junior_advocate && (
                            <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                              <UserPlus className="w-5 h-5 text-green-500" />
                              <span className="font-medium">Assigned: {task.assigned_junior_advocate.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <CalendarIcon className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">
                              Deadline: {format(new Date(task.deadline), "PPP")}
                              {daysUntilDeadline >= 0 && task.status !== "completed" && (
                                <span
                                  className={cn(
                                    "ml-2 text-xs px-2 py-1 rounded-full",
                                    isUrgent ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700",
                                  )}
                                >
                                  {daysUntilDeadline === 0 ? "Today" : `${daysUntilDeadline} days left`}
                                </span>
                              )}
                            </span>
                          </div>
                          {task.start_date && (
                            <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                              <CalendarIcon className="w-5 h-5 text-green-500" />
                              <span className="font-medium">Started: {format(new Date(task.start_date), "PPP")}</span>
                            </div>
                          )}
                          {task.review_date && (
                            <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                              <Eye className="w-5 h-5 text-indigo-500" />
                              <span className="font-medium">Review: {format(new Date(task.review_date), "PPP")}</span>
                            </div>
                          )}
                          {task.completed_at && (
                            <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="font-medium">
                                Completed: {format(new Date(task.completed_at), "PPP")}
                              </span>
                            </div>
                          )}
                        </div>

                        {task.description && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-2">
                              Description
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
                          </div>
                        )}

                        {task.nda_details && (
                          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">
                                NDA Details
                              </h4>
                            </div>
                            <p className="text-sm text-blue-800 leading-relaxed">{task.nda_details}</p>
                          </div>
                        )}

                        {task.review_feedback && (
                          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-amber-600" />
                              <h4 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">
                                Review Feedback
                              </h4>
                            </div>
                            <p className="text-sm text-amber-800 leading-relaxed">{task.review_feedback}</p>
                          </div>
                        )}

                        {task.status === "completed" && task.completed_at && (
                          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <h4 className="font-semibold text-green-900 text-sm uppercase tracking-wide">
                                Task Completed
                              </h4>
                            </div>
                            <div className="text-sm text-green-800">
                              <p>Completed on: {format(new Date(task.completed_at), "PPP 'at' p")}</p>
                              {task.completed_by && <p>Completed by: {task.completed_by}</p>}
                            </div>
                          </div>
                        )}

                        {task.assigned_junior_advocate && (
                          <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-400">
                            <div className="flex items-center gap-2 mb-2">
                              <UserPlus className="w-4 h-4 text-indigo-600" />
                              <h4 className="font-semibold text-indigo-900 text-sm uppercase tracking-wide">
                                Assigned Junior Advocate
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-indigo-800">{task.assigned_junior_advocate.name}</p>
                                <p className="text-sm text-indigo-700">{task.assigned_junior_advocate.email}</p>
                                <p className="text-xs text-indigo-600">{task.assigned_junior_advocate.mobile_no}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {task.uploaded_files && task.uploaded_files.length > 0 && (
                          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                            <div className="flex items-center gap-2 mb-3">
                              <Paperclip className="w-4 h-4 text-purple-600" />
                              <h4 className="font-semibold text-purple-900 text-sm uppercase tracking-wide">
                                Attached Documents ({task.uploaded_files.length})
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {task.uploaded_files.map((file) => (
                                <div
                                  key={file.id}
                                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
                                >
                                  {getFileIcon(file.type)}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                                    <p className="text-xs text-gray-500">
                                      {format(new Date(file.uploaded_at), "MMM d, yyyy")}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => downloadFile(file)}
                                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 p-2"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 lg:flex-col lg:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => handleAssignJuniorAdvocate(task)}
                          disabled={assigningTaskId === task.id || changingStatusTaskId === task.id}
                        >
                          {assigningTaskId === task.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4 mr-2" />
                          )}
                          {assigningTaskId === task.id
                            ? "Assigning..."
                            : task.assigned_junior_advocate
                              ? "Reassign"
                              : "Assign"}
                        </Button>

                        <Select
                          value={task.status}
                          onValueChange={(value) => handleChangeStatus(task, value)}
                          disabled={changingStatusTaskId === task.id || assigningTaskId === task.id}
                        >
                          <SelectTrigger className="h-9 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="feedback_required">Feedback Required</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvocateTaskView