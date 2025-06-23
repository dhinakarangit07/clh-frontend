"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Search,
  FileText,
  Clock,
  CalendarIcon,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Shield,
  Eye,
  MessageSquare,
  Upload,
  File,
  Download,
  Paperclip,
  FileSpreadsheet,
  FileImage,
  FileIcon as FilePdf,
  FileVideo,
  FileAudio,
  Archive,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: string // Changed from url to file to match FileField
  uploaded_at: string // Changed to match backend field name
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
  created_at: string
  updated_at: string
  created_by: number | null
  assigned_to: number | null
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

const TaskView = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // Changed to store File objects
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    document_type: "",
    start_date: "",
    review_date: "",
    deadline: "",
    priority: "",
    nda_details: "",
    review_feedback: "",
    uploaded_files: [] as File[], // Changed to store File objects temporarily
  })

  const { toast } = useToast()
  const navigate = useNavigate()

  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setIsInitialLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/task/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setTasks(response.data)
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

  // File handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
    setNewTask((prev) => ({
      ...prev,
      uploaded_files: [...prev.uploaded_files, ...validFiles],
    }))
  }

  const removeSelectedFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName))
    setNewTask((prev) => ({
      ...prev,
      uploaded_files: prev.uploaded_files.filter((file) => file.name !== fileName),
    }))
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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!newTask.title || !newTask.deadline || !newTask.priority) {
      toast({
        title: "Error",
        description: "Title, deadline, and priority are required.",
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

      const formData = new FormData()
      formData.append("title", newTask.title)
      formData.append("description", newTask.description || "")
      formData.append("document_type", newTask.document_type || "Other")
      if (newTask.start_date) formData.append("start_date", newTask.start_date)
      if (newTask.review_date) formData.append("review_date", newTask.review_date)
      formData.append("deadline", newTask.deadline)
      formData.append("priority", newTask.priority)
      if (newTask.review_feedback) formData.append("review_feedback", newTask.review_feedback)
      if (newTask.nda_details) formData.append("nda_details", newTask.nda_details)

      // Append files
      newTask.uploaded_files.forEach((file) => {
        formData.append("files", file)
      })

      let response
      if (editingTask) {
        response = await axios.put(`${API_URL}/task/${editingTask.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? response.data : task)),
        )
        toast({
          title: "Success",
          description: "Task updated successfully!",
        })
        setEditingTask(null)
      } else {
        response = await axios.post(`${API_URL}/task/`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        setTasks((prev) => [response.data, ...prev])
        toast({
          title: "Success",
          description: "Task created successfully!",
        })
      }

      resetForm()
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleAddTask(e))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to save task.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description || "",
      document_type: task.document_type,
      start_date: task.start_date || "",
      review_date: task.review_date || "",
      deadline: task.deadline || "",
      priority: task.priority,
      nda_details: task.nda_details || "",
      review_feedback: task.review_feedback || "",
      uploaded_files: [], // Files will be re-uploaded during update
    })
    setSelectedFiles([])
    setShowAddForm(true)
  }

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    setDeletingTaskId(id)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      await axios.delete(`${API_URL}/task/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteTask(id))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to delete task.",
          variant: "destructive",
        })
      }
    } finally {
      setDeletingTaskId(null)
    }
  }

  const resetForm = () => {
    setShowAddForm(false)
    setEditingTask(null)
    setNewTask({
      title: "",
      description: "",
      document_type: "",
      start_date: "",
      review_date: "",
      deadline: "",
      priority: "",
      nda_details: "",
      review_feedback: "",
      uploaded_files: [],
    })
    setSelectedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus

    return matchesSearch && matchesPriority && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Document Review Tasks
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your document review workflow with priority-based organization
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border">
              <span className="font-bold text-gray-900">{filteredTasks.length}</span>
              <span className="ml-1">tasks found</span>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group px-6 py-3 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Task
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search tasks by title or description..."
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
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden animate-fade-in">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetForm}
                  className="hover:bg-gray-100 rounded-full w-12 h-12"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleAddTask} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-bold text-gray-700">
                      Task Title *
                    </Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                      placeholder="Enter task title"
                      disabled={isLoading}
                      className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="document_type" className="text-base font-bold text-gray-700">
                      Document Type
                    </Label>
                    <Select
                      value={newTask.document_type}
                      onValueChange={(value) => setNewTask({ ...newTask, document_type: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NDA">NDA</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Agreement">Agreement</SelectItem>
                        <SelectItem value="Legal Brief">Legal Brief</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="priority" className="text-base font-bold text-gray-700">
                      Priority *
                    </Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="deadline" className="text-base font-bold text-gray-700">
                      Deadline *
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="start_date" className="text-base font-bold text-gray-700">
                      Start Date
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newTask.start_date}
                      onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                      disabled={isLoading}
                      className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="review_date" className="text-base font-bold text-gray-700">
                      Review Date
                    </Label>
                    <Input
                      id="review_date"
                      type="date"
                      value={newTask.review_date}
                      onChange={(e) => setNewTask({ ...newTask, review_date: e.target.value })}
                      disabled={isLoading}
                      className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-bold text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    disabled={isLoading}
                    className="min-h-[100px] border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="nda_details" className="text-base font-bold text-gray-700">
                    NDA Details
                  </Label>
                  <Textarea
                    id="nda_details"
                    value={newTask.nda_details}
                    onChange={(e) => setNewTask({ ...newTask, nda_details: e.target.value })}
                    placeholder="Enter NDA details and confidentiality requirements"
                    disabled={isLoading}
                    className="min-h-[80px] border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="review_feedback" className="text-base font-bold text-gray-700">
                    Review Feedback
                  </Label>
                  <Textarea
                    id="review_feedback"
                    value={newTask.review_feedback}
                    onChange={(e) => setNewTask({ ...newTask, review_feedback: e.target.value })}
                    placeholder="Enter review feedback and comments"
                    disabled={isLoading}
                    className="min-h-[80px] border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold text-gray-700">Document Upload</Label>
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
                      dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-gray-50/50",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Supports PDF, DOC, XLS, PPT, images and more (Max 10MB per file)
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Selected Files</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSelectedFile(file.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-base font-semibold rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    {isLoading ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors px-8 py-3 text-base font-semibold rounded-xl"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
                  {searchTerm || selectedPriority !== "all" || selectedStatus !== "all"
                    ? "No tasks match your search criteria. Try adjusting your filters."
                    : "You currently have no document review tasks assigned."}
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
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={cn(getPriorityColor(task.priority))}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                            <Badge className={cn(getStatusColor(task.status))}>
                              {task.status.replace("_", " ").charAt(0).toUpperCase() +
                                task.status.replace("_", " ").slice(1)}
                            </Badge>
                            {isOverdue && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {isUrgent && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <CalendarIcon className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">
                              Deadline: {format(new Date(task.deadline), "PPP")}
                              {daysUntilDeadline >= 0 && (
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
                          onClick={() => handleEditTask(task)}
                          disabled={deletingTaskId === task.id}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deletingTaskId === task.id}
                        >
                          {deletingTaskId === task.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          {deletingTaskId === task.id ? "Deleting..." : "Delete"}
                        </Button>
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

export default TaskView