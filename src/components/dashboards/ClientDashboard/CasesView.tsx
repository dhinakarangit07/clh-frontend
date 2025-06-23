import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Case {
  id: number;
  title: string;
  client_name: string;
  advocate_name: string | null;
  type: string;
  court: string | null;
  case_number: string;
  cnr_number: string | null;
  file_no: string | null;
  file_name: string | null;
  reference_no: string | null;
  year: string | null;
  fir_no: string | null;
  first_party: string | null;
  under_section: string | null;
  opposite_party: string | null;
  stage_of_case: string | null;
  judge_name: string | null;
  next_hearing: string | null;
  status: 'active' | 'pending' | 'decided' | 'abandoned' | 'assigned';
  priority: 'critical' | 'high' | 'medium' | 'low';
  last_update: string;
  description: string | null;
  created_at: string;
}

const CaseCardSkeleton = () => (
  <Card className="animate-pulse border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    <CardContent className="pt-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="h-6 bg-gray-200 rounded-lg w-64"></div>
            <div className="flex gap-3">
              <div className="h-5 bg-gray-200 rounded-full w-20"></div>
              <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gray-200 rounded w-36"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="h-4 bg-gray-200 rounded w-72"></div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CasesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState<Case[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_URL}/client/case/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCases(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchCases());
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch cases.',
          variant: 'destructive',
        });
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login');
        }
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found. Please log in again.');
      }
      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken,
      });
      localStorage.setItem('accessToken', response.data.access);
      await retryFn();
    } catch (refreshError) {
      toast({
        title: 'Session Expired',
        description: 'Please log in again.',
        variant: 'destructive',
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.advocate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0';
      case 'decided':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0';
      case 'abandoned':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0';
      case 'assigned':
        return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Your Cases
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              View your legal cases
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search cases by title, client, or advocate name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/90 text-gray-900 placeholder:text-gray-500"
                disabled={isInitialLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <div className="grid gap-6">
          {isInitialLoading ? (
            <>
              <CaseCardSkeleton />
              <CaseCardSkeleton />
              <CaseCardSkeleton />
            </>
          ) : filteredCases.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No cases found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? 'No cases match your search criteria. Try adjusting your search terms.' 
                    : 'You currently have no cases assigned to you.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCases.map((caseItem) => (
              <Card 
                key={caseItem.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] animate-fade-in"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{caseItem.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={cn(getStatusColor(caseItem.status))}>
                            {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                          </Badge>
                          <Badge className={cn(getPriorityColor(caseItem.priority))}>
                            {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <span className="font-semibold">Client:</span> 
                          <span className="font-medium">{caseItem.client_name}</span>
                        </div>
                        {caseItem.advocate_name && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Advocate:</span> 
                            <span className="font-medium">{caseItem.advocate_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <span className="font-semibold">Type:</span> 
                          <span className="font-medium">{caseItem.type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <span className="font-semibold">Case Number:</span> 
                          <span className="font-medium font-mono bg-gray-100 px-2 py-1 rounded">{caseItem.case_number}</span>
                        </div>
                        {caseItem.cnr_number && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">CNR Number:</span> 
                            <span className="font-medium font-mono bg-gray-100 px-2 py-1 rounded">{caseItem.cnr_number}</span>
                          </div>
                        )}
                        {caseItem.file_no && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">File No:</span> 
                            <span className="font-medium">{caseItem.file_no}</span>
                          </div>
                        )}
                        {caseItem.file_name && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">File Name:</span> 
                            <span className="font-medium">{caseItem.file_name}</span>
                          </div>
                        )}
                        {caseItem.reference_no && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Reference No:</span> 
                            <span className="font-medium">{caseItem.reference_no}</span>
                          </div>
                        )}
                        {caseItem.fir_no && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">FIR No:</span> 
                            <span className="font-medium">{caseItem.fir_no}</span>
                          </div>
                        )}
                        {caseItem.year && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Year:</span> 
                            <span className="font-medium">{caseItem.year}</span>
                          </div>
                        )}
                        {caseItem.first_party && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">First Party:</span> 
                            <span className="font-medium">{caseItem.first_party}</span>
                          </div>
                        )}
                        {caseItem.under_section && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Under Section:</span> 
                            <span className="font-medium">{caseItem.under_section}</span>
                          </div>
                        )}
                        {caseItem.opposite_party && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Opposite Party:</span> 
                            <span className="font-medium">{caseItem.opposite_party}</span>
                          </div>
                        )}
                        {caseItem.stage_of_case && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Stage of Case:</span> 
                            <span className="font-medium">{caseItem.stage_of_case}</span>
                          </div>
                        )}
                        {caseItem.judge_name && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Judge Name:</span> 
                            <span className="font-medium">{caseItem.judge_name}</span>
                          </div>
                        )}
                        {caseItem.court && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Court:</span> 
                            <span className="font-medium">{caseItem.court}</span>
                          </div>
                        )}
                        {caseItem.next_hearing && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <span className="font-semibold">Next Hearing:</span> 
                            <span className="font-medium">{format(new Date(caseItem.next_hearing), 'PPP')}</span>
                          </div>
                        )}
                        {caseItem.description && (
                          <div className="flex items-start gap-3 text-gray-600 group-hover:text-gray-800 transition-colors md:col-span-2 lg:col-span-3">
                            <span className="font-semibold">Description:</span> 
                            <span className="break-words font-medium">{caseItem.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CasesView;