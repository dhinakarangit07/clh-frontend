import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, CalendarDays, Calendar as CalendarIcon, Menu, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface CaseEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'hearing' | 'reminder' | string; // Updated to allow other types like 'Criminal'
  client: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [caseEvents, setCaseEvents] = useState<Record<string, CaseEvent[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = `${import.meta.env.VITE_API_URL}/api/calander/events/`;

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found. Please log in.');

      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const response = await axios.get(API_URL, {
        params: { start_date: startDate, end_date: endDate },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setCaseEvents(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, fetchEvents);
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch calendar events.',
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

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found. Please log in again.');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      });
      localStorage.setItem('accessToken', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }
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

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(startOfMonth(newMonth));
  };

  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const eventsForSelectedDate = caseEvents[selectedDateString] || [];

  const getEventDates = () => {
    return Object.keys(caseEvents).map((dateString) => new Date(dateString));
  };

  // Generate calendar grid for the current month
  const generateCalendarGrid = () => {
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const daysInMonth = [];
    
    // Add days from previous month to fill the grid
    const startDay = startDate.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDate = new Date(startDate);
      prevDate.setDate(prevDate.getDate() - (i + 1));
      daysInMonth.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      daysInMonth.push({ date, isCurrentMonth: true });
    }
    
    // Add days from next month to fill remaining slots
    const remainingSlots = 42 - daysInMonth.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(endDate);
      nextDate.setDate(nextDate.getDate() + i);
      daysInMonth.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return daysInMonth;
  };

  const calendarDays = generateCalendarGrid();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Court Calendar</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Sidebar Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden flex items-center gap-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span className="sr-only">Toggle events</span>
              </Button>
              
             
            </div>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between mt-4 sm:mt-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="text-gray-600 hover:text-gray-900 p-1 sm:p-2"
              >
                ‹
              </Button>
              <h2 className="text-lg sm:text-xl font-medium text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="text-gray-600 hover:text-gray-900 p-1 sm:p-2"
              >
                ›
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Main Calendar Grid */}
          <div className="flex-1 order-2 md:order-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {(window.innerWidth < 640 ? dayNamesShort : dayNames).map((day, index) => (
                  <div key={day} className="p-2 sm:p-4 text-center text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dateString = format(day.date, 'yyyy-MM-dd');
                  const dayEvents = caseEvents[dateString] || [];
                  const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors",
                        !day.isCurrentMonth && "bg-gray-50/50 text-gray-400",
                        isToday && "bg-blue-50"
                      )}
                      onClick={() => {
                        setSelectedDate(day.date);
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(true);
                        }
                      }}
                    >
                      <div className={cn(
                        "text-xs sm:text-sm font-medium mb-1 sm:mb-2",
                        isToday ? "text-blue-600" : day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                      )}>
                        {day.date.getDate()}
                      </div>
                      
                      {/* Events for this day */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, window.innerWidth < 640 ? 1 : 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate",
                              event.type === 'reminder' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > (window.innerWidth < 640 ? 1 : 2) && (
                          <div className="text-xs text-gray-500 px-1 sm:px-2">
                            +{dayEvents.length - (window.innerWidth < 640 ? 1 : 2)} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 overflow-y-auto h-full">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {eventsForSelectedDate.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
                          </h4>
                          {eventsForSelectedDate.map((event) => (
                            <div key={event.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                              <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                {event.type === 'reminder' && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>{event.time}</span>
                                  </div>
                                )}
                                {event.type !== 'reminder' && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <User className="h-3 w-3" />
                                  <span>{event.client}</span>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "mt-2 text-xs",
                                  event.type === 'reminder' ? "border-green-200 text-green-800 bg-green-50" : "border-blue-200 text-blue-800 bg-blue-50"
                                )}
                              >
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="w-80 order-1 md:order-2 hidden md:block">
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium text-gray-900">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    
                    {eventsForSelectedDate.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
                        </h4>
                        {eventsForSelectedDate.map((event) => (
                          <div key={event.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                            <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              {event.type === 'reminder' && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                              {event.type !== 'reminder' && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>{event.client}</span>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "mt-2 text-xs",
                                event.type === 'reminder' ? "border-green-200 text-green-800 bg-green-50" : "border-blue-200 text-blue-800 bg-blue-50"
                              )}
                            >
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
