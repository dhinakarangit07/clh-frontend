
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Mail, User, Lock, Loader2, Shield, Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const Profile = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    photo: null as File | null,
    oldPassword: "",
    newPassword: "",
    reenterPassword: "",
  })
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  // Fetch user profile data on mount
  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/user_profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setFormData((prev) => ({
        ...prev,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        photo: null,
      }))
      if (response.data.photo) {
        setPhotoPreview(response.data.photo)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchUserProfile())
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch profile data.",
          variant: "destructive",
        })
        navigate("/login")
      }
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsProfileLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const profileFormData = new FormData()
      profileFormData.append("first_name", formData.first_name)
      profileFormData.append("last_name", formData.last_name)
      profileFormData.append("email", formData.email)
      if (formData.photo) {
        profileFormData.append("photo", formData.photo)
      }

      const response = await axios.put(`${API_URL}/user_profile/`, profileFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.photo) {
        setPhotoPreview(response.data.photo)
      }

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSaveProfile())
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || error.message || "Failed to save profile changes.",
          variant: "destructive",
        })
      }
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handleSavePassword = async () => {
    setIsPasswordLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      if (!formData.oldPassword || !formData.newPassword || !formData.reenterPassword) {
        throw new Error("All password fields are required.")
      }

      if (formData.newPassword !== formData.reenterPassword) {
        throw new Error("New passwords do not match.")
      }

      await axios.post(
        `${API_URL}/user_profile/password/change/`,
        {
          current_password: formData.oldPassword,
          new_password: formData.newPassword,
          confirm_password: formData.reenterPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      toast({
        title: "Success",
        description: "Password updated successfully.",
      })

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        reenterPassword: "",
      }))
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSavePassword())
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || error.message || "Failed to save password changes.",
          variant: "destructive",
        })
      }
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleResetPassword = async () => {
    try {
      await axios.post(`${API_URL}/password/reset/`, { email: resetEmail })
      toast({
        title: "Success",
        description: "Password reset email sent. Check your inbox.",
      })
      setIsResetModalOpen(false)
      setResetEmail("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to send reset email.",
        variant: "destructive",
      })
    }
  }

  const handleBackToDashboard = () => {
    navigate(-1)
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Profile</h3>
                <p className="text-gray-600">Please wait while we fetch your profile data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBackToDashboard} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account and security preferences</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("photo")?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500">Recommended size: 200x200 pixels</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-gray-700 font-medium">
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="Enter your first name"
                      className="focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-gray-700 font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Enter your last name"
                      className="focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isProfileLoading}
                    className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2"
                  >
                    {isProfileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isProfileLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleBackToDashboard} disabled={isProfileLoading}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword" className="text-gray-700 font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={formData.oldPassword}
                      onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                      placeholder="Enter your current password"
                      className="focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="Enter new password"
                        className="focus:ring-slate-500 focus:border-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reenterPassword" className="text-gray-700 font-medium">
                        Confirm New Password
                      </Label>
                      <Input
                        id="reenterPassword"
                        type="password"
                        value={formData.reenterPassword}
                        onChange={(e) => handleInputChange("reenterPassword", e.target.value)}
                        placeholder="Re-enter new password"
                        className="focus:ring-slate-500 focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleSavePassword}
                      disabled={isPasswordLoading}
                      className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2"
                    >
                      {isPasswordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isPasswordLoading ? "Updating..." : "Update Password"}
                    </Button>
                    <Button variant="outline" onClick={handleBackToDashboard} disabled={isPasswordLoading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with helpful information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">Use a strong password with at least 12 characters</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">Include uppercase, lowercase, numbers, and symbols</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">Keep your email address updated for security notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Password Reset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Forgot your password? You can request a password reset email to be sent to your registered email address.
                </p>
                <Button variant="outline" onClick={() => setIsResetModalOpen(true)} className="w-full border-gray-300">
                  Request Password Reset
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Reset Password</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter your email address to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className="bg-slate-900 hover:bg-slate-800 text-white">
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile
