"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Scale } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation() // Get current path

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80 // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false) // Close mobile menu after clicking
  }

  // Check if the current path is /dashboard
  const isDashboard = location.pathname === "/dashboard"

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20"
          : "bg-white/5 backdrop-blur-lg shadow-lg border-b border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  CLH
                </span>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Advocates
                </span>
              </span>
              <div className="text-xs text-white/70 font-medium">Legal Community</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link to="/">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("home")}
                className="text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 px-4 py-2 rounded-xl"
              >
                Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("benefits")}
                className="text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 px-4 py-2 rounded-xl"
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/advocate">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("about")}
                className="text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 px-4 py-2 rounded-xl"
              >
                Advocates
              </Button>
            </Link>
            <Link to="/forum">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("contact")}
                className="text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 px-4 py-2 rounded-xl"
              >
                Forum
              </Button>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/40 transition-all duration-300 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10 transition-colors duration-200 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl rounded-b-2xl mt-4 shadow-2xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link to="/">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("home")}
                  className="w-full text-left justify-start px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  Home
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("benefits")}
                  className="w-full text-left justify-start px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/advocate">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("about")}
                  className="w-full text-left justify-start px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  Advocates
                </Button>
              </Link>
              <Link to="/forum">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("contact")}
                  className="w-full text-left justify-start px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  Forum
                </Button>
              </Link>

              {/* Mobile Auth Buttons */}
              {!isDashboard && (
                <div className="flex gap-3 px-2 pt-4 border-t border-white/20">
                  <Link to="/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-xl"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
