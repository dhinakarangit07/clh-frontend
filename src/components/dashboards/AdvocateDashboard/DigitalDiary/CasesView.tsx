import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, CalendarIcon, Search, Edit, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Client {
  id: number;
  name: string;
}

interface Advocate {
  id: number;
  name: string;
}

interface Case {
  id: number;
  title: string;
  client: number;
  client_name: string;
  advocate: number | null;
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
  created_by: number;
}

interface CasesViewProps {
  onCaseChange?: () => void;
}

// Enhanced skeleton loader component
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
        <div className="flex gap-3">
          <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CasesView = ({ onCaseChange }: CasesViewProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    advocate: 'none',
    type: '',
    court: 'District and Taluka Court' as string,
    case_number: '',
    cnr_number: '',
    file_no: '',
    file_name: '',
    reference_no: '',
    year: '',
    fir_no: '',
    first_party: '',
    under_section: '',
    opposite_party: '',
    stage_of_case: '',
    judge_name: '',
    next_hearing: null as Date | null,
    status: 'pending' as Case['status'],
    priority: 'medium' as Case['priority'],
    description: '',
  });
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    fetchClients();
    fetchAdvocates();
    fetchCases();
  }, []);

  const fetchClients = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_URL}/client/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setClients(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchClients());
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch clients.',
          variant: 'destructive',
        });
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login');
        }
      }
    }
  };

  const fetchAdvocates = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_URL}/advocate/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAdvocates(response.data.map((adv: any) => ({
        id: adv.id,
        name: adv.name,
      })));
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchAdvocates());
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch advocates.',
          variant: 'destructive',
        });
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login');
        }
      }
    }
  };

  const fetchCases = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_URL}/case/`, {
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

  const handleFetchCase = async () => {
    if (!formData.cnr_number) {
      toast({
        title: 'Error',
        description: 'Please enter a CNR number to fetch.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.get(`${API_URL}/case/scrape/${formData.cnr_number}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const fetchedCase = response.data;

      // Helper to find value in case_details array
      const findDetail = (key: string) => {
        const detail = fetchedCase.case_details.find((item: any[]) => item.includes(key));
        return detail ? detail[detail.indexOf(key) + 1] : '';
      };

      // Helper to find value in case_status array
      const findStatus = (key: string) => {
        const status = fetchedCase.case_status.find((item: any[]) => item.includes(key));
        return status ? status[status.indexOf(key) + 1] : '';
      };

      // Map status to Case status enum
      const mapStatus = (status: string): Case['status'] => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('disposed')) return 'decided';
        if (lowerStatus.includes('pending')) return 'pending';
        if (lowerStatus.includes('active')) return 'active';
        return 'pending'; // Default
      };

      // Extract court and judge from "Court Number and Judge"
      const courtAndJudge = findStatus('Court Number and Judge');
      const judgeMatch = courtAndJudge.match(/-(.+)$/);
      const judgeName = judgeMatch ? judgeMatch[1].trim() : '';
      const courtName = courtAndJudge.replace(/-.+$/, '').trim() || 'District and Taluka Court';

      // Get latest hearing date if not disposed
      let nextHearing: Date | null = null;
      const caseStatus = findStatus('Case Status').toLowerCase();
      if (!caseStatus.includes('disposed')) {
        const history = fetchedCase.case_history.slice(1); // Skip header
        const lastHearing = history
          .filter((item: any[]) => item[2] && item[3] !== 'Disposed')
          .sort((a: any[], b: any[]) => new Date(b[2]).getTime() - new Date(a[2]).getTime())[0];
        if (lastHearing && lastHearing[2]) {
          const parsedDate = parse(lastHearing[2], 'dd-MM-yyyy', new Date());
          if (!isNaN(parsedDate.getTime())) {
            nextHearing = parsedDate;
          }
        }
      }

      // Build description
      const description = [
        fetchedCase.petitioner_advocate.length ? `Petitioner: ${fetchedCase.petitioner_advocate[0][0]}` : '',
        fetchedCase.respondent_advocate.length ? `Respondent: ${fetchedCase.respondent_advocate[0][0]}` : '',
        findStatus('Nature of Disposal') ? `Disposal: ${findStatus('Nature of Disposal')}` : '',
      ].filter(Boolean).join('\n');

      setFormData({
        ...formData,
        title: findDetail('Case Type') || `${fetchedCase.petitioner_advocate[0]?.[0]?.split('\n')[0] || 'Case'} vs ${fetchedCase.respondent_advocate[0]?.[0]?.split('\n')[0] || 'Unknown'}`,
        case_number: findDetail('Registration Number') || findDetail('Filing Number') || '',
        cnr_number: formData.cnr_number,
        court: courtName,
        judge_name: judgeName,
        first_party: fetchedCase.petitioner_advocate[0]?.[0]?.split('\n')[0] || '',
        opposite_party: fetchedCase.respondent_advocate[0]?.[0]?.split('\n')[0] || '',
        under_section: fetchedCase.acts.find((act: any[]) => act[1])?.[1] || '',
        status: mapStatus(findStatus('Case Status')),
        next_hearing: nextHearing,
        description,
        year: findDetail('Registration Date:')?.split('-')[2] || '',
        stage_of_case: findStatus('Nature of Disposal') || findStatus('Case Status') || '',
      });
      toast({ title: 'Success', description: 'Case details fetched successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to fetch case details.',
        variant: 'destructive',
      });
      if (error.message === 'No access token found. Please log in.') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.type || !formData.case_number) {
      toast({
        title: 'Error',
        description: 'Title, type, and case number are required.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const payload = {
        title: formData.title,
        client: formData.client ? parseInt(formData.client) : null,
        advocate: formData.advocate && formData.advocate !== 'none' ? parseInt(formData.advocate) : null,
        type: formData.type,
        court: formData.court || null,
        case_number: formData.case_number,
        cnr_number: formData.cnr_number || null,
        file_no: formData.file_no || null,
        file_name: formData.file_name || null,
        reference_no: formData.reference_no || null,
        year: formData.year || null,
        fir_no: formData.fir_no || null,
        first_party: formData.first_party || null,
        under_section: formData.under_section || null,
        opposite_party: formData.opposite_party || null,
        stage_of_case: formData.stage_of_case || null,
        judge_name: formData.judge_name || null,
        next_hearing: formData.next_hearing ? format(formData.next_hearing, 'yyyy-MM-dd') : null,
        status: formData.status,
        priority: formData.priority,
        description: formData.description || null,
      };

      if (editingCase) {
        await axios.put(`${API_URL}/case/${editingCase.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({ title: 'Success', description: 'Case updated successfully!' });
      } else {
        await axios.post(`${API_URL}/case/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({ title: 'Success', description: 'Case created successfully!' });
      }

      setFormData({
        title: '',
        client: '',
        advocate: 'none',
        type: '',
        court: 'District and Taluka Court',
        case_number: '',
        cnr_number: '',
        file_no: '',
        file_name: '',
        reference_no: '',
        year: '',
        fir_no: '',
        first_party: '',
        under_section: '',
        opposite_party: '',
        stage_of_case: '',
        judge_name: '',
        next_hearing: null,
        status: 'pending',
        priority: 'medium',
        description: '',
      });
      setEditingCase(null);
      setShowAddForm(false);
      await fetchCases();
      if (onCaseChange) onCaseChange();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSubmit(e));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || Object.values(error.response?.data || {}).join(' ') || 'Failed to save case.',
          variant: 'destructive',
        });
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setFormData({
      title: caseItem.title,
      client: caseItem.client.toString(),
      advocate: caseItem.advocate?.toString() || 'none',
      type: caseItem.type,
      court: caseItem.court || 'District and Taluka Court',
      case_number: caseItem.case_number,
      cnr_number: caseItem.cnr_number || '',
      file_no: caseItem.file_no || '',
      file_name: caseItem.file_name || '',
      reference_no: caseItem.reference_no || '',
      year: caseItem.year || '',
      fir_no: caseItem.fir_no || '',
      first_party: caseItem.first_party || '',
      under_section: caseItem.under_section || '',
      opposite_party: caseItem.opposite_party || '',
      stage_of_case: caseItem.stage_of_case || '',
      judge_name: caseItem.judge_name || '',
      next_hearing: caseItem.next_hearing ? new Date(caseItem.next_hearing) : null,
      status: caseItem.status,
      priority: caseItem.priority,
      description: caseItem.description || '',
    });
    setShowAddForm(true);
  };

  const handleDeleteCase = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      await axios.delete(`${API_URL}/case/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast({ title: 'Success', description: 'Case deleted successfully!' });
      await fetchCases();
      if (onCaseChange) onCaseChange();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteCase(id));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Failed to delete case.',
          variant: 'destructive',
        });
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login');
        }
      }
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
              Cases Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Organize and track your legal cases
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredCases.length}</span> cases found
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Case
          </Button>
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

        {/* Add/Edit Case Form */}
        {showAddForm && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-fade-in">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {editingCase ? 'Edit Case' : 'Add New Case'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Enter case details below
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCase(null);
                    setFormData({
                      title: '',
                      client: '',
                      advocate: 'none',
                      type: '',
                      court: 'District and Taluka Court',
                      case_number: '',
                      cnr_number: '',
                      file_no: '',
                      file_name: '',
                      reference_no: '',
                      year: '',
                      fir_no: '',
                      first_party: '',
                      under_section: '',
                      opposite_party: '',
                      stage_of_case: '',
                      judge_name: '',
                      next_hearing: null,
                      status: 'pending',
                      priority: 'medium',
                      description: '',
                    });
                  }}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {['District and Taluka Court', 'High Court', 'DRT', 'NCLT', 'Consumer Forum', 'RERA', 'CGIT', 'Revenue', 'KAT'].map((courtType) => (
                      <div key={courtType} className="flex items-center">
                        <input
                          type="radio"
                          id={courtType}
                          name="court"
                          value={courtType}
                          checked={formData.court === courtType}
                          onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                          className="mr-2"
                          disabled={isLoading}
                        />
                        <Label htmlFor={courtType} className="text-sm font-semibold text-gray-700">
                          {courtType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter case title"
                      required
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Criminal">Criminal</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Estate">Estate</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Tax">Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="case_number" className="text-sm font-semibold text-gray-700">Case Number *</Label>
                    <Input
                      id="case_number"
                      value={formData.case_number}
                      onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                      placeholder="Enter case number"
                      required
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="w-full">
                      <Label htmlFor="cnr_number" className="text-sm font-semibold text-gray-700">CNR Number</Label>
                      <Input
                        id="cnr_number"
                        value={formData.cnr_number}
                        onChange={(e) => setFormData({ ...formData, cnr_number: e.target.value })}
                        placeholder="Enter CNR number (e.g., MHAU010012342022)"
                        disabled={isLoading}
                        className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    <Button
                      onClick={handleFetchCase}
                      className="ml-2 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      disabled={isLoading}
                    >
                      Fetch
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_no" className="text-sm font-semibold text-gray-700">File No</Label>
                    <Input
                      id="file_no"
                      value={formData.file_no}
                      onChange={(e) => setFormData({ ...formData, file_no: e.target.value })}
                      placeholder="Enter file number"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_name" className="text-sm font-semibold text-gray-700">File Name</Label>
                    <Input
                      id="file_name"
                      value={formData.file_name}
                      onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
                      placeholder="Enter file name"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference_no" className="text-sm font-semibold text-gray-700">Reference No</Label>
                    <Input
                      id="reference_no"
                      value={formData.reference_no}
                      onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
                      placeholder="Enter reference number"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fir_no" className="text-sm font-semibold text-gray-700">FIR No</Label>
                    <Input
                      id="fir_no"
                      value={formData.fir_no}
                      onChange={(e) => setFormData({ ...formData, fir_no: e.target.value })}
                      placeholder="Enter FIR number"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-semibold text-gray-700">Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="first_party" className="text-sm font-semibold text-gray-700">First Party</Label>
                    <Input
                      id="first_party"
                      value={formData.first_party}
                      onChange={(e) => setFormData({ ...formData, first_party: e.target.value })}
                      placeholder="Enter first party"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="under_section" className="text-sm font-semibold text-gray-700">Under Section</Label>
                    <Input
                      id="under_section"
                      value={formData.under_section}
                      onChange={(e) => setFormData({ ...formData, under_section: e.target.value })}
                      placeholder="Enter section"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opposite_party" className="text-sm font-semibold text-gray-700">Opposite Party</Label>
                    <Input
                      id="opposite_party"
                      value={formData.opposite_party}
                      onChange={(e) => setFormData({ ...formData, opposite_party: e.target.value })}
                      placeholder="Enter opposite party"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage_of_case" className="text-sm font-semibold text-gray-700">Stage of Case/Fixed For</Label>
                    <Input
                      id="stage_of_case"
                      value={formData.stage_of_case}
                      onChange={(e) => setFormData({ ...formData, stage_of_case: e.target.value })}
                      placeholder="Enter stage of case"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="judge_name" className="text-sm font-semibold text-gray-700">Judge Name</Label>
                    <Input
                      id="judge_name"
                      value={formData.judge_name}
                      onChange={(e) => setFormData({ ...formData, judge_name: e.target.value })}
                      placeholder="Enter judge name"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="court" className="text-sm font-semibold text-gray-700">Court</Label>
                    <Input
                      id="court"
                      value={formData.court}
                      onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                      placeholder="Enter court name"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next_hearing" className="text-sm font-semibold text-gray-700">Next Hearing</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.next_hearing ? format(formData.next_hearing, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.next_hearing}
                          onSelect={(date) => setFormData({ ...formData, next_hearing: date })}
                          initialFocus
                          disabled={isLoading}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as Case['status'] })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="decided">Decided</SelectItem>
                        <SelectItem value="abandoned">Abandoned</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value as Case['priority'] })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
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
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-semibold text-gray-700">Client</Label>
                    <Select
                      value={formData.client}
                      onValueChange={(value) => setFormData({ ...formData, client: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advocate" className="text-sm font-semibold text-gray-700">Advocate</Label>
                    <Select
                      value={formData.advocate}
                      onValueChange={(value) => setFormData({ ...formData, advocate: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Select advocate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {advocates.map((advocate) => (
                          <SelectItem key={advocate.id} value={advocate.id.toString()}>
                            {advocate.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter case description"
                    disabled={isLoading}
                    className="min-h-[100px] border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : editingCase ? 'Update Case' : 'Create Case'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCase(null);
                      setFormData({
                        title: '',
                        client: '',
                        advocate: 'none',
                        type: '',
                        court: 'District and Taluka Court',
                        case_number: '',
                        cnr_number: '',
                        file_no: '',
                        file_name: '',
                        reference_no: '',
                        year: '',
                        fir_no: '',
                        first_party: '',
                        under_section: '',
                        opposite_party: '',
                        stage_of_case: '',
                        judge_name: '',
                        next_hearing: null,
                        status: 'pending',
                        priority: 'medium',
                        description: '',
                      });
                    }}
                    className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

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
                    : 'Get started by adding your first case to begin managing your cases.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Case
                  </Button>
                )}
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
                    <div className="flex gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                        onClick={() => handleEditCase(caseItem)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                        onClick={() => handleDeleteCase(caseItem.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
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
