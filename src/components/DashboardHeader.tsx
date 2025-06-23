
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, LogOut, User, CreditCard, HelpCircle, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProfileModal from "@/components/ProfileModal"

interface DashboardHeaderProps {
  userProfile?: any
  isLoading: boolean
}

const DashboardHeader = ({ userProfile, isLoading }: DashboardHeaderProps) => {
  const navigate = useNavigate()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : "S"
    const lastInitial = lastName ? lastName[0].toUpperCase() : "S"
    return `${firstInitial}${lastInitial}`
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CLH Advocates</h1>
                  <p className="text-xs text-gray-500">Professional Dashboard</p>
                </div>
              </div>
              
              {/* Forum and Advocates Buttons */}
              <div className="flex items-center space-x-2 ml-6">
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/forum")}
                  className="text-sm"
                >
                  Forum
                </Button> */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/advocate")}
                  className="text-sm"
                >
                  Advocates
                </Button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={userProfile?.photo} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {isLoading ? "..." : getUserInitials(userProfile?.first_name, userProfile?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {isLoading ? "Loading..." : (userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "")}
                      </p>
                      <p className="text-xs text-gray-500">CLH Member</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        isLoading={isLoading}
      />
    </>
  )
}

export default DashboardHeader
