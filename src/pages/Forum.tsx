"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User,
  FileText,
  Clock,
  ArrowLeft,
  Heart,
  MessageSquare,
  Scale,
  Users,
  BookOpen,
  Gavel,
  Plus,
  Search,
  Calendar,
  Gift,
  Shield,
  Trophy,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Cookies from "js-cookie"

// Configure Axios to include CSRF token
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// Interfaces matching backend serializers
interface Profile {
  email: string
  first_name: string
  last_name: string
  photo: string | null
}

interface ForumUser {
  id: string
  username: string
  email: string
  profile: Profile
}

interface Comment {
  id: string
  user: ForumUser
  content: string
  image_url?: string
  created_at: string
}

interface Post {
  id: string
  user: ForumUser
  title: string
  content: string
  category: string
  image_url?: string
  created_at: string
  updated_at: string
  likes_count: number
  liked_by_user: boolean
  comment_count: number
  comments: Comment[]
}

interface Advocate {
  first_name: string
  last_name: string
  email: string
  photo: string | null
}

// Form schemas
const postSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
})

const commentSchema = z.object({
  content: z.string().min(5, { message: "Comment must be at least 5 characters." }),
})

const Forum: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [postImage, setPostImage] = useState<File | null>(null)
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [advocates, setAdvocates] = useState<Advocate[]>([])
  const [isAdvocatesLoading, setIsAdvocatesLoading] = useState(true)
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null)
  const loaderRef = useRef(null)
  const postsPerPage = 5
  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Posts" },
    { value: "my", label: "My Posts" },
    { value: "case law", label: "Case Law" },
    { value: "legal updates", label: "Legal Updates" },
    { value: "case discussion", label: "Case Discussion" },
    { value: "general", label: "General" },
  ]

  // Quick Resources benefits
  const quickResources = [
    { icon: <Calendar className="w-4 h-4 mr-3" />, title: "Digital Diary Access", url: "/digital-diary" },
    { icon: <Gift className="w-4 h-4 mr-3" />, title: "Free Advocate Handbag", url: "/advocate-handbag" },
    { icon: <Shield className="w-4 h-4 mr-3" />, title: "Star Health Insurance", url: "/health-insurance" },
    { icon: <Trophy className="w-4 h-4 mr-3" />, title: "Annual Awards", url: "/annual-awards" },
  ]

  // React Hook Forms
  const postForm = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", category: "general" },
  })

  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })

  // Helper to get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Token refresh handler (aligned with Profile.tsx)
  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) {
        throw new Error("No refresh token found. Please log in again.")
      }
      const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken })
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

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      await axios.get(`${API_URL}/get-csrf-token/`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to fetch CSRF token.",
        variant: "destructive",
      })
    }
  }

  // Fetch user profile
  const fetchUserProfile = async () => {
    setIsProfileLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.get(`${API_URL}/user_profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setProfile(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, fetchUserProfile)
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to fetch profile data.",
          variant: "destructive",
        })
        navigate("/login")
      }
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Fetch advocates
  const fetchAdvocates = async () => {
    setIsAdvocatesLoading(true)
    try {
      const response = await axios.get(`${API_URL}/public/advocates/`)
      if (!response.data) {
        throw new Error("Failed to fetch advocates")
      }
      setAdvocates(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to fetch suggested connections.",
        variant: "destructive",
      })
    } finally {
      setIsAdvocatesLoading(false)
    }
  }

  // Load posts with pagination and filtering
  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const endpoint = selectedCategory === "my" ? "/my-feed/" : "/all-feed/"
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          page: currentPage,
          page_size: postsPerPage,
          category: selectedCategory !== "all" && selectedCategory !== "my" ? selectedCategory : undefined,
        },
      })

      const newPosts = response.data.results || []
      setPosts((prevPosts) => (currentPage === 1 ? newPosts : [...prevPosts, ...newPosts]))
      setHasMorePosts(!!response.data.next)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, fetchPosts)
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to fetch posts.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle like/unlike
  const handleLikeToggle = async (postId: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const response = await axios.post(
        `${API_URL}/posts/${postId}/like-toggle/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked_by_user: response.data.message === "Liked",
                likes_count: response.data.message === "Liked" ? post.likes_count + 1 : post.likes_count - 1,
              }
            : post
        )
      )

      toast({
        title: response.data.message === "Liked" ? "Post Liked" : "Post Unliked",
        description: response.data.message === "Liked" ? "You liked this post." : "You unliked this post.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleLikeToggle(postId))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to toggle like.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle comment creation (aligned with Profile.tsx)
  const handleCreateComment = async (postId: string, values: z.infer<typeof commentSchema>) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const commentFormData = new FormData()
      commentFormData.append("post_id", postId)
      commentFormData.append("content", values.content)

      const response = await axios.post(`${API_URL}/comments/`, commentFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, response.data],
                comment_count: post.comment_count + 1,
              }
            : post
        )
      )

      commentForm.reset()
      setShowCommentForm(null)
      toast({
        title: "Success",
        description: "Comment added successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleCreateComment(postId, values))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || error.message || "Failed to add comment.",
          variant: "destructive",
        })
      }
    }
  }

  // Create new post (aligned with Profile.tsx)
  const handleCreatePost = async (values: z.infer<typeof postSchema>) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found. Please log in.")
      }

      const postFormData = new FormData()
      postFormData.append("title", values.title)
      postFormData.append("content", values.content)
      postFormData.append("category", values.category)
      if (postImage) {
        postFormData.append("image", postImage)
      }

      const response = await axios.post(`${API_URL}/posts/`, postFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setPosts((prev) => [response.data, ...prev])
      postForm.reset()
      setPostImage(null)
      setPostImageUrl(null)
      setShowNewPostForm(false)
      setCurrentPage(1)
      toast({
        title: "Success",
        description: "Post created successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleCreatePost(values))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || error.message || "Failed to create post.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle image uploads
  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPostImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPostImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle back button
  const handleBack = () => {
    window.history.back()
  }

  // Handle advocate profile click
  const handleAdvocateClick = (email: string) => {
    window.open(`/advocate?email=${encodeURIComponent(email)}`, "_blank")
  }

  // Handle profile click
  const handleProfileClick = () => {
    navigate("/profile")
  }

  // Handle post user click
  const handlePostUserClick = (email: string) => {
    window.open(`/advocate?email=${encodeURIComponent(email)}`, "_blank")
  }

  // Infinite scroll implementation
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && hasMorePosts && !isLoading) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [hasMorePosts, isLoading])

  useEffect(() => {
    fetchCsrfToken()
    fetchUserProfile()
    fetchPosts()
    fetchAdvocates()
  }, [currentPage, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Advocates Discussion Forum</h1>
          </div>
          <p className="text-gray-600">Connect, discuss, and share legal insights with fellow advocates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleProfileClick}>
              <CardHeader className="text-center pb-4">
                {isProfileLoading ? (
                  <>
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-4 w-2/3 mx-auto mb-2" />
                    <Skeleton className="h-3 w-1/2 mx-auto" />
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center">
                      {profile?.photo ? (
                        <img
                          src={profile.photo}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {getInitials(profile?.first_name || "", profile?.last_name || "")}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{`${profile?.first_name} ${profile?.last_name}`}</h3>
                    <p className="text-sm text-gray-600">Legal Professional</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-medium text-gray-900">124</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Post Impressions</span>
                    <span className="font-medium text-gray-900">1,847</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network Size</span>
                    <span className="font-medium text-gray-900">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-3" />
                  My Network
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-3" />
                  Saved Posts
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-3" />
                  Recent Activity
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-3" />
                  Search Cases
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                    {profile?.photo ? (
                      <img
                        src={profile.photo}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {getInitials(profile?.first_name || "", profile?.last_name || "")}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewPostForm(true)}
                    className="flex-1 justify-start text-gray-600 bg-gray-50 hover:bg-gray-100"
                  >
                    Share a legal insight or ask a question...
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* New Post Form */}
            {showNewPostForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Post
                  </CardTitle>
                  <CardDescription>
                    Share legal updates, case discussions, or ask questions to the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...postForm}>
                    <form onSubmit={postForm.handleSubmit(handleCreatePost)} className="space-y-4">
                      <FormField
                        control={postForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter post title..."
                                className="focus:ring-slate-500 focus:border-slate-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={postForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Category</FormLabel>
                            <FormControl>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                {...field}
                              >
                                {categories
                                  .filter((c) => c.value !== "all" && c.value !== "my")
                                  .map((category) => (
                                    <option key={category.value} value={category.value}>
                                      {category.label}
                                    </option>
                                  ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={postForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your legal insights, case analysis, or questions..."
                                className="min-h-[150px] focus:ring-slate-500 focus:border-slate-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel className="text-gray-700">Image (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handlePostImageChange}
                            className="bg-white border-gray-200"
                          />
                        </FormControl>
                      </FormItem>
                      {postImageUrl && (
                        <div className="relative mt-2">
                          <img
                            src={postImageUrl}
                            alt="Post attachment preview"
                            className="max-h-60 rounded-md border border-gray-200 object-contain"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => {
                              setPostImage(null)
                              setPostImageUrl(null)
                            }}
                            type="button"
                          >
                            X
                          </Button>
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowNewPostForm(false)}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={postForm.formState.isSubmitting}
                          className="bg-slate-900 hover:bg-slate-800"
                        >
                          Post
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.value)
                    setCurrentPage(1)
                    setPosts([])
                  }}
                  className={
                    selectedCategory === category.value
                      ? "bg-slate-900 hover:bg-slate-800 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {isLoading && currentPage === 1 ? (
                Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-start space-x-3">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                          {post.user?.profile?.photo ? (
                            <img
                              src={post.user.profile.photo}
                              alt={`${post.user.profile.first_name} ${post.user.profile.last_name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {getInitials(
                                  post.user?.profile?.first_name || "",
                                  post.user?.profile?.last_name || ""
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h3
                              className="font-semibold text-gray-900 cursor-pointer hover:underline"
                              onClick={() => handlePostUserClick(post.user?.email || "")}
                            >
                              {post.user?.profile?.first_name || post.user?.username}{" "}
                              {post.user?.profile?.last_name || ""}
                            </h3>
                            <Badge variant="secondary">{post.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Legal Professional</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <h4 className="font-medium text-gray-900 mb-2 text-lg">{post.title}</h4>
                      <p className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">{post.content}</p>
                      {post.image_url && (
                        <div className="mb-4">
                          <img
                            src={post.image_url}
                            alt="Post attachment"
                            className="w-full max-h-96 rounded-lg border border-gray-200 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeToggle(post.id)}
                            className={
                              post.liked_by_user
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-600 hover:text-gray-700"
                            }
                          >
                            <Heart
                              className={`w-4 h-4 mr-2 ${post.liked_by_user ? "fill-red-500" : ""}`}
                            />
                            {post.likes_count} {post.likes_count === 1 ? "Like" : "Likes"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCommentForm(showCommentForm === post.id ? null : post.id)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {post.comment_count} {post.comment_count === 1 ? "Comment" : "Comments"}
                          </Button>
                        </div>
                      </div>
                      {/* Comment Form */}
                      {showCommentForm === post.id && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <Form {...commentForm}>
                            <form
                              onSubmit={commentForm.handleSubmit((values) => handleCreateComment(post.id, values))}
                              className="space-y-4"
                            >
                              <FormField
                                control={commentForm.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Write your comment..."
                                        className="min-h-[80px] focus:ring-slate-500 focus:border-slate-500"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowCommentForm(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={commentForm.formState.isSubmitting}
                                  className="bg-slate-900 hover:bg-slate-800"
                                >
                                  Comment
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </div>
                      )}
                      {/* Comments List */}
                      {post.comments.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                              <div className="flex items-start space-x-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                                  {comment.user?.profile?.photo ? (
                                    <img
                                      src={comment.user.profile.photo}
                                      alt={`${comment.user.profile.first_name} ${comment.user.profile.last_name}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                      <span className="text-white font-bold text-sm">
                                        {getInitials(
                                          comment.user?.profile?.first_name || "",
                                          comment.user?.profile?.last_name || ""
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900 text-sm">
                                      {comment.user?.profile?.first_name || comment.user?.username}{" "}
                                      {comment.user?.profile?.last_name || ""}
                                    </span>
                                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                  {comment.image_url && (
                                    <img
                                      src={comment.image_url}
                                      alt="Comment attachment"
                                      className="mt-2 max-h-40 rounded-md border border-gray-200 object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardTitle className="text-center no-italic">No profile found</CardTitle>
                  <CardContent>
                    <div className="p-8 text-center">
                      <div className="mx-auto h-12 w-auto">
                        <svg
                          className="h-full w-full text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          aria-label="File Text"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-1.5m0 0a3 3 0 0 1-3-3v-3a3 3 0 0 0-3-3H6a3 6 0 0 0-3 3v3a3 3 0 0 0 3 3h7.5m-7.5 0h7.5a3 3 0 0 1 3 3v1.5M9 11.25h6m-6 3h6m-9 5.25h.01M9 3.75h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3Z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                      <p className="text-gray-600">
                        {selectedCategory === "all"
                          ? "Be the first to start a discussion!"
                          : `No posts found in ${categories.find((c) => c.value === selectedCategory)?.label || "this category"}. Try another category or create a new post.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Infinite scroll loader */}
              {posts.length > 0 && (
                <div ref={loaderRef} className="py-4 flex justify-center">
                  {isLoading && currentPage > 1 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Suggested Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Professionals</CardTitle>
                <CardDescription>Connect with advocates in your field</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isAdvocatesLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                  ) : advocates.length > 0 ? (
                    advocates.map((advocate, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        onClick={() => handleAdvocateClick(advocate.email)}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                          {advocate.photo ? (
                            <img
                              src={advocate.photo}
                              alt={`${advocate.first_name} ${advocate.last_name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {getInitials(advocate.first_name, advocate.last_name)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900">
                            {advocate.first_name} {advocate.last_name}
                          </h4>
                          <p className="text-xs text-gray-600 text-sm">Legal Professional</p>
                          <p className="text-xs text-gray-500">15 mutual connections</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            Connect
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-600">No suggestions available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legal Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickResources.map((resource, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => navigate(resource.url)}
                  >
                    {resource.icon}
                    {resource.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forum