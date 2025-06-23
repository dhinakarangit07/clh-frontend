"use client"
import { ArrowLeft, Hotel, MapPin, Star, Calendar, Shield, Percent, Clock, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HotelDiscounts() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const featuredDeals = [
    {
      name: "Sunset Resort, Maldives",
      discount: "40% Off",
      description: "Beachfront Villas",
      price: "$150",
      originalPrice: "$250",
      image:
        "https://www.theexperiencegolf.com/-/media/experiencegolf/destinations/ireland/south-west/hotels/the-europe/720x480-media-carousel/720x480-the-europe-4.jpg?h=480&w=720&hash=D10378A1DE2E6B153DDEC2F30C601756&usecustomfunctions=1&centercrop=1",
      rating: 4.8,
      location: "Maldives",
      amenities: ["Beach Access", "Spa", "Pool", "WiFi"],
    },
    {
      name: "Cityscape Hotel, New York",
      discount: "30% Off",
      description: "Deluxe Rooms",
      price: "$120",
      originalPrice: "$170",
      image: "https://www.elegantgolfresorts.com/app/uploads/2020/11/the-europe-hotel-resort-terrrace-960x582.jpg",
      rating: 4.6,
      location: "New York, USA",
      amenities: ["City View", "Gym", "Restaurant", "WiFi"],
    },
    {
      name: "Mountain Lodge, Aspen",
      discount: "25% Off",
      description: "Winter Stays",
      price: "$200",
      originalPrice: "$267",
      image: "https://www.elegantgolfresorts.com/app/uploads/2020/11/the-europe-hotel-resort-path-960x582.jpg",
      rating: 4.9,
      location: "Aspen, USA",
      amenities: ["Ski Access", "Fireplace", "Spa", "Restaurant"],
    },
  ]

  const highlights = [
    {
      icon: Percent,
      title: "Exclusive Discounts",
      description: "Access deals you won't find anywhere else, with up to 50% off.",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      title: "Flexible Booking",
      description: "Enjoy free cancellations and easy rescheduling for peace of mind.",
      color: "text-emerald-600",
    },
    {
      icon: Shield,
      title: "Trusted Partners",
      description: "Book with confidence through our network of top-rated hotels.",
      color: "text-purple-600",
    },
  ]

  const stats = [
    { label: "Hotels", value: "10K+", description: "Partner Properties" },
    { label: "Savings", value: "50%", description: "Maximum Discount" },
    { label: "Destinations", value: "200+", description: "Cities Worldwide" },
    { label: "Satisfaction", value: "98%", description: "Customer Rating" },
  ]

  const benefits = [
    { benefit: "Exclusive Member Discounts", included: true },
    { benefit: "Free Cancellation", included: true },
    { benefit: "24/7 Customer Support", included: true },
    { benefit: "Price Match Guarantee", included: true },
    { benefit: "Loyalty Rewards Program", included: true },
    { benefit: "Mobile Check-in", included: true },
  ]

  const destinations = [
    { city: "Paris", country: "France", deals: "150+ deals", discount: "Up to 45%" },
    { city: "Tokyo", country: "Japan", deals: "120+ deals", discount: "Up to 40%" },
    { city: "London", country: "UK", deals: "200+ deals", discount: "Up to 50%" },
    { city: "Dubai", country: "UAE", deals: "80+ deals", discount: "Up to 35%" },
  ]

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
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Discounts</h1>
          </div>
          <p className="text-gray-600">Book Your Dream Stay at Unbeatable Prices</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-slate-50 to-gray-100 border-0">
          <CardContent className="p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Percent className="w-3 h-3 mr-1" />
                Limited Time Offers
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Save Big on Your Next Getaway</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Discover exclusive hotel discounts across top destinations worldwide. Whether you're planning a relaxing
                vacation or a business trip, we have the perfect deal for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
                  Explore Deals
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Browse Hotels
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Hotel Deals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Featured Hotel Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDeals.map((deal, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img src={deal.image || "/placeholder.svg"} alt={deal.name} className="w-full h-48 object-cover" />
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">{deal.discount}</Badge>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{deal.location}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.name}</h3>
                    <p className="text-gray-600 mb-3">{deal.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                      <span className="text-sm text-gray-600">rating</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {deal.amenities.map((amenity, amenityIndex) => (
                        <Badge key={amenityIndex} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{deal.price}</span>
                        <span className="text-sm text-gray-600">/night</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Book Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why Book With Us */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Book With Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {highlights.map((highlight, index) => {
                const IconComponent = highlight.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                        <IconComponent className={`w-8 h-8 ${highlight.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{highlight.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular Destinations & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-600" />
                Popular Destinations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {destination.city}, {destination.country}
                    </p>
                    <p className="text-sm text-gray-600">{destination.deals}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">{destination.discount}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-600" />
                Booking Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700">{item.benefit}</span>
                  <div className="flex items-center gap-2">
                    {item.included && <Badge className="bg-emerald-100 text-emerald-700">Included</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Booking Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              How to Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Search</h3>
                <p className="text-sm text-gray-600">Enter your destination and travel dates</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Compare</h3>
                <p className="text-sm text-gray-600">Browse deals and compare prices</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Book</h3>
                <p className="text-sm text-gray-600">Secure your reservation instantly</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enjoy</h3>
                <p className="text-sm text-gray-600">Check-in and enjoy your stay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
