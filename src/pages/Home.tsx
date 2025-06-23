
"use client"

import {
  User,
  Database,
  CreditCard,
  Shield,
  Briefcase,
  BookOpen,
  Building,
  Hotel,
  Search,
  FileText,
  MessageSquare,
  GraduationCap,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Check,
  Menu,
  X,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import bannerVideo from "@/assets/banner/banner.mp4"
import { useState, useEffect, useRef } from "react"
import Header from "@/components/HomeHeader"
import Footer from "@/components/footer"
import TypewriterText from "@/components/TypewriterText"
import { Link } from "react-router-dom"
import { any } from "zod"

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visibleElements, setVisibleElements] = useState(new Set())

  // Refs for scroll animations
  const heroRef = useRef(null)
  const benefitsSectionRef = useRef(null)
  const aboutSectionRef = useRef(null)
  const ctaSectionRef = useRef(null)
  const contactSectionRef = useRef(null)
  const benefitCardsRef = useRef([])

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set([...prev, entry.target.id]))
        }
      })
    }, observerOptions)

    // Observe sections
    const sections = [heroRef, benefitsSectionRef, aboutSectionRef, ctaSectionRef, contactSectionRef]
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    // Observe benefit cards with staggered animation
    benefitCardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.transitionDelay = `${index * 0.1}s`
        observer.observe(card)
      }
    })

    return () => observer.disconnect()
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

  const typewriterTexts = [
    "Empowering Legal Excellence",
    "Connecting Legal Professionals",
    "Building Tomorrow's Legal Community",
    "Your Partner in Legal Success"
  ];

  const memberBenefits = [
    {
      icon: User,
      title: "Free Membership Profile",
      description: "Complete professional profile for all advocates registering with CLH.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Database,
      title: "Legal Database Access",
      description: "Access to CLH Database with Indian & Foreign Acts & Landmark Judgements.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: CreditCard,
      title: "Zero Balance Account",
      description: "Free Zero Balance Current Account with IDFC First Bank exclusively for members.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Shield,
      title: "Health Insurance",
      description: "Star Health Insurance Mediclaim Policy with flexi-EMI options for members.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Briefcase,
      title: "Free Advocate Handbag",
      description: "Complimentary professional Advocate Handbag worth INR 999 for members.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: BookOpen,
      title: "Digital Diary Access",
      description: "Access to Advocate's Digital Diary exclusively for CLH Members.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Building,
      title: "Co-working Spaces",
      description: "Discounted rates for co-working spaces across major cities in India.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Hotel,
      title: "Hotel Discounts",
      description: "Special rates for hotel rooms across major cities of India.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Search,
      title: "One-Click Search",
      description: "Fast Legal Database search for e-courts of India.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: FileText,
      title: "AI Case Management",
      description: "AI-Enabled Case Management Application exclusively for CLH Members.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: LinkIcon,
      title: "International Network",
      description: "Platform to connect with International Counsels, Lawyers & Arbitrators.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: MessageSquare,
      title: "Discussion Forum",
      description: "Access to CLH Advocate Discussion Board – exclusively for registered members.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: GraduationCap,
      title: "Training Programs",
      description: "Advocate Training & Upskilling programs exclusively for CLH Members.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Mentorship Program",
      description: "Virtual Mentorship Program – Exclusive for CLH Budding Advocates.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Award,
      title: "Annual Awards",
      description: "Advocate Annual Awards – Celebrating excellence in Advocacy.",
      gradient: "from-purple-500 to-blue-500",
    },
  ]

  const heroFeatures = [
    "Access to exclusive legal databases & landmark judgments",
    "AI-Enabled Case Management Application",
    "International counsel network & mentorship opportunities",
    "Exclusive banking and insurance benefits",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900">
      <Header />

      {/* Hero Section with Background Video */}
      <section 
        id="hero" 
        ref={heroRef}
        className={`relative min-h-screen flex items-center overflow-hidden pt-20 transition-all duration-1000 ${
          visibleElements.has('hero') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src={bannerVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-slate-900/80"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Animated Overlay Patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              className={`text-white transition-all duration-1000 delay-300 ${
                visibleElements.has('hero') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="mb-8">
                <TypewriterText 
                  texts={typewriterTexts}
                  className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseTime={2000}
                />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white/90">
                The Legal Community
              </h2>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Join CLH Advocates platform - an exclusive community designed to support, connect, and elevate legal
                professionals across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Become a Member
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-3 transition-all duration-300 transform hover:scale-105"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div 
              className={`lg:ml-8 transition-all duration-1000 delay-500 ${
                visibleElements.has('hero') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-10'
              }`}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Member Benefits Include:</h3>
                  <div className="space-y-4">
                    {heroFeatures.map((feature, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 transition-all duration-500 ${
                          visibleElements.has('hero') 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-5'
                        }`}
                        style={{ transitionDelay: `${700 + index * 100}ms` }}
                      >
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    Plus 11 more exclusive benefits!
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-bounce opacity-60 hidden lg:block"></div>
        <div className="absolute top-1/3 right-16 w-12 h-12 bg-blue-400/20 rounded-full backdrop-blur-sm animate-pulse opacity-70 hidden lg:block"></div>
        <div className="absolute bottom-1/4 left-20 w-8 h-8 bg-purple-400/20 rounded-full backdrop-blur-sm animate-ping opacity-50 hidden lg:block"></div>
      </section>

      {/* Member Benefits Section */}
      <section 
        id="benefits" 
        ref={benefitsSectionRef}
        className={`py-20 px-4 bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 transition-all duration-1000 ${
          visibleElements.has('benefits') 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
      >
        <div className="container mx-auto">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has('benefits') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Exclusive Member Benefits</h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Joining CLH Advocates provides you with 15 exclusive benefits designed to enhance your legal practice and
              professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {memberBenefits.map((benefit, index) => (
              <Card
                key={index}
                ref={el => benefitCardsRef.current[index] = el}
                id={`benefit-${index}`}
                className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-500 group hover:scale-105 hover:shadow-2xl ${
                  visibleElements.has(`benefit-${index}`) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        ref={aboutSectionRef}
        className={`py-20 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-800 transition-all duration-1000 ${
          visibleElements.has('about') 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
      >
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card 
              className={`bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-700 shadow-2xl ${
                visibleElements.has('about') 
                  ? 'opacity-100 -translate-x-0' 
                  : 'opacity-0 -translate-x-10'
              }`}
            >
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
                <p className="text-white/90 text-lg leading-relaxed">
                  To build a thriving community of legal professionals by providing exceptional resources, tools, and
                  benefits that help advocates excel in their practice.
                </p>
              </CardContent>
            </Card>

            <div 
              className={`text-white transition-all duration-700 delay-300 ${
                visibleElements.has('about') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-10'
              }`}
            >
              <h2 className="text-4xl font-bold mb-6">About CLH Advocates</h2>
              <p className="text-xl mb-6 text-white/90 leading-relaxed">
                CLH Advocates is a premier platform created for the legal community to foster professional growth,
                collaboration, and excellence in legal practice.
              </p>
              <p className="text-lg mb-6 text-white/80 leading-relaxed">
                Our platform brings together resources, tools, and benefits designed specifically for advocates across
                India, creating an ecosystem that supports both new and established legal professionals.
              </p>
              <p className="text-lg mb-8 text-white/80 leading-relaxed">
                With partnerships spanning banking, insurance, professional facilities, and technology, we provide a
                comprehensive suite of services that enhance your legal practice and professional journey.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        ref={ctaSectionRef}
        className={`py-20 px-4 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden transition-all duration-1000 ${
          visibleElements.has('cta') 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] opacity-30" />
        <div className="container mx-auto relative z-10">
          <h2 
            className={`text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-700 ${
              visibleElements.has('cta') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            Ready to Join the CLH Community?
          </h2>
          <p 
            className={`text-xl text-white/90 mb-8 max-w-3xl mx-auto transition-all duration-700 delay-200 ${
              visibleElements.has('cta') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            Become a member today and gain access to exclusive benefits designed specifically for legal professionals.
          </p>
          <Button
            size="lg"
            className={`bg-white text-purple-600 hover:bg-slate-100 px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
              visibleElements.has('cta') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Register Now
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={contactSectionRef}
        className={`py-20 px-4 bg-slate-900/90 backdrop-blur-sm transition-all duration-1000 ${
          visibleElements.has('contact') 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
      >
        <div className="container mx-auto">
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              visibleElements.has('contact') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get in touch with our team for any questions or support you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Phone, title: "Phone", content: "+91 123 456 7890" },
              { icon: Mail, title: "Email", content: "contact@clhadvocates.com" },
              { icon: MapPin, title: "Address", content: "123 Legal Avenue, Supreme Court Road, New Delhi, India - 110001" }
            ].map((contact, index) => (
              <Card 
                key={index}
                className={`bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105 transition-all duration-500 ${
                  visibleElements.has('contact') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                  <p className="text-white/80">{contact.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer scrollToSection={any} />
    </div>
  )
}

export default HomePage
