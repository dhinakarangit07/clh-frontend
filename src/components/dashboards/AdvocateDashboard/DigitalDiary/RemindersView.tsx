import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, Clock, Bell, X, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Client {
  id: number;
  name: string;
}

interface Case {
  id: number;
  title: string;
  client: number;
}

interface Reminder {
  id: number;
  client: number;
  client_name: string;
  case: number;
  case_title: string;
  description: string;
  date: string;
  time: string;
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Fort Nightly';
  emails: string | null;
  whatsapp: string | null;
  status: 'active' | 'completed';
  created_at: string;
  created_by: number | null;
}

interface RemindersViewProps {
  onReminderChange?: () => void;
}

// Enhanced skeleton component for reminder cards
const ReminderCardSkeleton = () => (
  <Card className="animate-pulse border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="h-6 bg-gray-200 rounded-lg w-64"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-20"></div>
              <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-52"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 lg:flex-col lg:w-auto">
          <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const RemindersView = ({ onReminderChange }: RemindersViewProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [formData, setFormData] = useState({
    client: '',
    case: '',
    description: '',
    date: null as Date | null,
    time: '',
    frequency: 'Once' as Reminder['frequency'],
    emails: '',
    whatsapp: '',
    status: 'active' as Reminder['status'],
  });
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchClients();
    fetchCases();
    fetchReminders();
  }, []);

  const fetchClients = async () => {
    try {
      setIsInitialLoading(true);
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
    }
  };

  const fetchReminders = async () => {
    try {
      setIsInitialLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_URL}/reminder/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setReminders(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => fetchReminders());
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch reminders.',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.client || !formData.case || !formData.description || !formData.date || !formData.time) {
      toast({
        title: 'Error',
        description: 'Client, case, description, date, and time are required.',
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
        client: parseInt(formData.client),
        case: parseInt(formData.case),
        description: formData.description,
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
        time: formData.time,
        frequency: formData.frequency,
        emails: formData.emails || null,
        whatsapp: formData.whatsapp || null,
        status: formData.status,
      };

      if (editingReminder) {
        await axios.put(`${API_URL}/reminder/${editingReminder.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({ title: 'Success', description: 'Reminder updated successfully!' });
      } else {
        await axios.post(`${API_URL}/reminder/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({ title: 'Success', description: 'Reminder created successfully!' });
      }

      setFormData({
        client: '',
        case: '',
        description: '',
        date: null,
        time: '',
        frequency: 'Once',
        emails: '',
        whatsapp: '',
        status: 'active',
      });
      setEditingReminder(null);
      setShowAddForm(false);
      await fetchReminders();
      if (onReminderChange) onReminderChange();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSubmit(e));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || Object.values(error.response?.data || {}).join(' ') || 'Failed to save reminder.',
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

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      client: reminder.client.toString(),
      case: reminder.case.toString(),
      description: reminder.description,
      date: reminder.date ? new Date(reminder.date) : null,
      time: reminder.time,
      frequency: reminder.frequency,
      emails: reminder.emails || '',
      whatsapp: reminder.whatsapp || '',
      status: reminder.status,
    });
    setShowAddForm(true);
  };

  const handleDeleteReminder = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      await axios.delete(`${API_URL}/reminder/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast({ title: 'Success', description: 'Reminder deleted successfully!' });
      await fetchReminders();
      if (onReminderChange) onReminderChange();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteReminder(id));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Failed to delete reminder.',
          variant: 'destructive',
        });
        if (error.message === 'No access token found. Please log in.') {
          navigate('/login');
        }
      }
    }
  };

  const filteredReminders = reminders.filter(
    (reminder) =>
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.case_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCases = cases.filter((caseItem) => caseItem.client.toString() === formData.client);

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Once': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'Daily': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0';
      case 'Weekly': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0';
      case 'Fort Nightly': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Reminders Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Stay organized with your reminders
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredReminders.length}</span> reminders found
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Reminder
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search reminders by client, case, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/90 text-gray-900 placeholder:text-gray-500"
                disabled={isInitialLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-fade-in">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Set up a new reminder with notification preferences
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    setFormData({
                      client: '',
                      case: '',
                      description: '',
                      date: null,
                      time: '',
                      frequency: 'Once',
                      emails: '',
                      whatsapp: '',
                      status: 'active',
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-semibold text-gray-700">Select Client *</Label>
                    <Select
                      value={formData.client}
                      onValueChange={(value) => setFormData({ ...formData, client: value, case: '' })}
                      required
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Choose a client" />
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
                    <Label htmlFor="case" className="text-sm font-semibold text-gray-700">Select Case *</Label>
                    <Select
                      value={formData.case}
                      onValueChange={(value) => setFormData({ ...formData, case: value })}
                      required
                      disabled={isLoading || !formData.client}
                    >
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Choose a case" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCases.map((caseItem) => (
                          <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                            {caseItem.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Remind me about *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Enter reminder description"
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({ ...formData, date })}
                          initialFocus
                          disabled={isLoading}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-semibold text-gray-700">At (Time) *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-sm font-semibold text-gray-700">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value as Reminder['frequency'] })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once">Once</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Fort Nightly">Fort Nightly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emails" className="text-sm font-semibold text-gray-700">Send Email to</Label>
                  <Input
                    id="emails"
                    value={formData.emails}
                    onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                    placeholder="email1@example.com, email2@example.com"
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <p className="text-sm text-gray-500">You can add multiple email addresses separated by comma</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-sm font-semibold text-gray-700">Send WhatsApp on</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="91775485645, 91987654321"
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <p className="text-sm text-gray-500">You can add multiple mobile nos. separated by comma</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Reminder['status'] })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : editingReminder ? 'Update Reminder' : 'Create Reminder'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingReminder(null);
                      setFormData({
                        client: '',
                        case: '',
                        description: '',
                        date: null,
                        time: '',
                        frequency: 'Once',
                        emails: '',
                        whatsapp: '',
                        status: 'active',
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

        {/* Reminders List */}
        <div className="grid gap-6">
          {isInitialLoading ? (
            <>
              <ReminderCardSkeleton />
              <ReminderCardSkeleton />
              <ReminderCardSkeleton />
            </>
          ) : filteredReminders.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No reminders found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? 'No reminders match your search criteria. Try adjusting your search terms.' 
                    : 'Get started by adding your first reminder to stay organized.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Reminder
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredReminders.map((reminder) => (
              <Card 
                key={reminder.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] animate-fade-in"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{reminder.description}</h3>
                        <div className="flex gap-2">
                          <Badge 
                            className={cn(
                              reminder.status === 'active' 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' 
                                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0'
                            )}
                          >
                            {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                          </Badge>
                          <Badge className={cn(getFrequencyColor(reminder.frequency))}>
                            {reminder.frequency}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">{format(new Date(reminder.date), 'PPP')} at {reminder.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <CalendarIcon className="w-5 h-5 text-purple-500" />
                          <span className="font-medium truncate">{reminder.case_title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors md:col-span-2">
                          <AlertCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Client: {reminder.client_name}</span>
                        </div>
                      </div>
                      {(reminder.emails || reminder.whatsapp) && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Notifications</h4>
                          {reminder.emails && (
                            <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                              <span className="font-medium text-orange-600">Email:</span> {reminder.emails}
                            </div>
                          )}
                          {reminder.whatsapp && (
                            <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                              <span className="font-medium text-green-600">WhatsApp:</span> {reminder.whatsapp}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 lg:flex-col lg:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                        onClick={() => handleEditReminder(reminder)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                        onClick={() => handleDeleteReminder(reminder.id)}
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

export default RemindersView;
