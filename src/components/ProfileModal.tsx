
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Badge } from "@/components/ui/badge"
  import { Card, CardContent } from "@/components/ui/card"
  import { Separator } from "@/components/ui/separator"
  import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    Calendar, 
    Shield,
    Star,
    CheckCircle
  } from "lucide-react"
  
  interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
    userProfile?: any
    isLoading: boolean
  }
  
  const ProfileModal = ({ isOpen, onClose, userProfile, isLoading }: ProfileModalProps) => {
    const getUserInitials = (firstName?: string, lastName?: string) => {
      const firstInitial = firstName ? firstName[0].toUpperCase() : "S"
      const lastInitial = lastName ? lastName[0].toUpperCase() : "S"
      return `${firstInitial}${lastInitial}`
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>
              Your complete CLH Advocates membership profile
            </DialogDescription>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {isLoading ? "..." : getUserInitials(userProfile?.first_name, userProfile?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isLoading ? "Loading..." : (userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "Sutheesh Sutheesh")}
                </h3>
                <p className="text-gray-600">Legal Advocate & CLH Member</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active Member
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              </div>
            </div>
  
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-gray-900">{userProfile?.first_name || "Sutheesh"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-gray-900">{userProfile?.last_name || "Sutheesh"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{userProfile?.email || "sutheesh.s@vulturelines.com"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Professional Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Bar Registration</label>
                    <p className="text-gray-900 font-mono">234578854</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Practice Area</label>
                    <p className="text-gray-900">Criminal Law</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                    <p className="text-gray-900">8 Years</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Court Jurisdiction</label>
                    <p className="text-gray-900">High Court of Kerala</p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Membership Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Membership Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">May 17, 2025</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Membership Type</label>
                    <p className="text-gray-900">Premium CLH Advocate</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Member ID</label>
                    <p className="text-gray-900 font-mono">CLH-2025-001247</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Benefits Activated</label>
                    <p className="text-gray-900">15 of 15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Office Address
                </h4>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    Chamber No. 45, 2nd Floor<br />
                    High Court of Kerala Complex<br />
                    Ernakulam, Kerala - 682031<br />
                    India
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default ProfileModal
  
