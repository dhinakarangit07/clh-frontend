
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Mail, User, MapPin, MessageSquare, MoreHorizontal, Briefcase, Gavel, UserCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

interface Advocate {
  email: string;
  first_name: string;
  last_name: string;
  photo: string | null;
}

interface AdvocateDetails {
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  user_photo: string | null;
  fathers_name: string;
  mothers_name: string;
  spouse_name: string;
  bar_council_name: string;
  enrollment_roll_no: string;
  enrollment_date: string;
  place_of_practice: string;
  area_of_practice: string;
  date_of_birth: string;
  communication_address: string;
  contact_number: string;
  created_at: string;
}

const AdvocatesDirectory: React.FC = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [selectedAdvocate, setSelectedAdvocate] = useState<AdvocateDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "CLH Advocates Directory";

    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/public/advocates/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch advocates: ${response.statusText}`);
        }
        const data: Advocate[] = await response.json();
        setAdvocates(data);
        setFilteredAdvocates(data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const fetchAdvocateDetails = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/public/advocates/${email}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch advocate details: ${response.statusText}`);
      }
      const data: AdvocateDetails = await response.json();
      setSelectedAdvocate(data);
    } catch (error) {
      console.error("Error fetching advocate details:", error);
      setSelectedAdvocate(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for email query parameter on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    if (emailParam) {
      fetchAdvocateDetails(emailParam);
    }
  }, [location.search]);

  useEffect(() => {
    const filtered = advocates.filter(
      (advocate) =>
        advocate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advocate.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advocate.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAdvocates(filtered);
  }, [searchQuery, advocates]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleBack = () => {
    if (selectedAdvocate) {
      setSelectedAdvocate(null); // Return to directory view
    } else {
      navigate("/dashboard"); // Navigate to dashboard
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {selectedAdvocate ? "Directory" : "Dashboard"}
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              {selectedAdvocate ? (
                <User className="w-6 h-6 text-white" />
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedAdvocate ? "Advocate Profile" : "Advocates Directory"}
            </h1>
          </div>
          <p className="text-gray-600">
            {selectedAdvocate ? "Professional profile and credentials" : "Connect with legal professionals"}
          </p>
        </div>

        {/* Main Content */}
        {selectedAdvocate ? (
          <>
            {/* Main Profile Card */}
            <Card className="mb-8 shadow-lg">
              <CardContent className="p-0">
                {/* Cover Section */}
                <div className="relative h-32 bg-gray-100 border-b border-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
                </div>

                {/* Profile Content */}
                <div className="px-8 py-6">
                  {/* Profile Photo */}
                  <div className="relative -mt-16 mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                      {selectedAdvocate.user_photo ? (
                        <img
                          src={selectedAdvocate.user_photo}
                          alt={`${selectedAdvocate.user_first_name} ${selectedAdvocate.user_last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <span className="text-white font-bold text-4xl">
                            {getInitials(selectedAdvocate.user_first_name, selectedAdvocate.user_last_name)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-3xl font-bold text-gray-900">
                            {selectedAdvocate.user_first_name} {selectedAdvocate.user_last_name}
                          </h2>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            Senior Advocate
                          </Badge>
                        </div>
                        <p className="text-xl text-gray-700 mb-4">
                          Advocate | Specializing in {selectedAdvocate.area_of_practice}
                        </p>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedAdvocate.place_of_practice}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">{selectedAdvocate.contact_number}</span>
                          <span className="text-gray-400">•</span>
                          <button className="text-gray-900 font-medium hover:underline">
                            {selectedAdvocate.user_email}
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          <MoreHorizontal className="w-4 h-4 mr-2" />
                          More
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Bar Council Info */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Gavel className="w-5 h-5" />
                            Bar Council Registration
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Gavel className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{selectedAdvocate.bar_council_name}</h4>
                                <p className="text-sm text-gray-600">Roll No: {selectedAdvocate.enrollment_roll_no}</p>
                                <p className="text-xs text-gray-500">
                                  Enrolled: {formatDate(selectedAdvocate.enrollment_date)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-700">Father's Name</span>
                      <span className="text-gray-900">{selectedAdvocate.fathers_name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-700">Mother's Name</span>
                      <span className="text-gray-900">{selectedAdvocate.mothers_name}</span>
                    </div>
                    {selectedAdvocate.spouse_name && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700">Spouse's Name</span>
                        <span className="text-gray-900">{selectedAdvocate.spouse_name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-700">Date of Birth</span>
                      <span className="text-gray-900">{formatDate(selectedAdvocate.date_of_birth)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Area of Practice</span>
                      <span className="font-semibold text-gray-900">{selectedAdvocate.area_of_practice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Communication Address</span>
                      <span className="font-semibold text-gray-900">{selectedAdvocate.communication_address}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Contact Number</span>
                      <span className="font-semibold text-gray-900">{selectedAdvocate.contact_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profile Created</span>
                      <span className="font-semibold text-gray-900">{formatDate(selectedAdvocate.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Search Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Advocates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-10 h-12 focus:ring-slate-500 focus:border-slate-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-sm">
                        Showing {filteredAdvocates.length} of {advocates.length} advocates
                      </span>
                    </div>
                    {searchQuery && (
                      <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="text-gray-600">
                        Clear search
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advocates Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200" />
                        <div className="space-y-3 flex-1">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                          <div className="h-3 w-28 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAdvocates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdvocates.map((advocate, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => fetchAdvocateDetails(advocate.email)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                            {advocate.photo ? (
                              <img
                                src={advocate.photo}
                                alt={`${advocate.first_name} ${advocate.last_name}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {getInitials(advocate.first_name, advocate.last_name)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-slate-700 transition-colors">
                            {advocate.first_name} {advocate.last_name}
                          </h3>
                          <Badge variant="secondary" className="mb-3 text-xs">
                            Legal Professional
                          </Badge>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-gray-500" />
                              <p className="text-sm text-gray-600 truncate">{advocate.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No advocates found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria to find more advocates</p>
                  <Button onClick={() => setSearchQuery("")} className="bg-slate-900 hover:bg-slate-800">
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdvocatesDirectory;
