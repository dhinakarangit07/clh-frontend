import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Bell, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reminder {
  id: number;
  client_name: string;
  case_title: string;
  description: string;
  date: string;
  time: string;
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Fort Nightly';
  emails: string | null;
  whatsapp: string | null;
  status: 'active' | 'completed';
  created_at: string;
}

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
      </div>
    </CardContent>
  </Card>
);

const RemindersView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setIsInitialLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_URL}/client/reminder/`, {
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

  const filteredReminders = reminders.filter(
    (reminder) =>
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.case_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Your Reminders
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              View your case reminders
            </p>
          </div>
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
                    : 'You currently have no reminders for your cases.'
                  }
                </p>
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