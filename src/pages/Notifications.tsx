
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Search, 
  Filter,
  MoreHorizontal,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MailOpen,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Notifications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Demo notifications data
  const allNotifications = [
    {
      id: 1,
      title: 'Court Hearing Reminder',
      message: 'Smith vs. Johnson case hearing scheduled for tomorrow at 10:00 AM',
      time: '5 minutes ago',
      type: 'urgent',
      read: false,
      category: 'Court'
    },
    {
      id: 2,
      title: 'New Client Registration',
      message: 'Sarah Wilson has registered as a new client',
      time: '1 hour ago',
      type: 'info',
      read: false,
      category: 'Client'
    },
    {
      id: 3,
      title: 'Document Review Required',
      message: 'Estate planning documents for Wilson case need review',
      time: '2 hours ago',
      type: 'warning',
      read: true,
      category: 'Document'
    },
    {
      id: 4,
      title: 'Payment Received',
      message: 'Payment of $2,500 received from Davis case',
      time: '1 day ago',
      type: 'success',
      read: true,
      category: 'Payment'
    },
    {
      id: 5,
      title: 'Case Status Update',
      message: 'Corporate merger case has been moved to review stage',
      time: '2 days ago',
      type: 'info',
      read: true,
      category: 'Case'
    },
    {
      id: 6,
      title: 'Court Date Postponed',
      message: 'Davis vs. Corporation hearing postponed to next Friday',
      time: '3 days ago',
      type: 'warning',
      read: false,
      category: 'Court'
    },
    {
      id: 7,
      title: 'New Document Uploaded',
      message: 'Client has uploaded contract documents for review',
      time: '1 week ago',
      type: 'info',
      read: true,
      category: 'Document'
    },
    {
      id: 8,
      title: 'System Maintenance',
      message: 'Legal Diary will undergo maintenance tonight from 11 PM to 1 AM',
      time: '1 week ago',
      type: 'info',
      read: true,
      category: 'System'
    }
  ];

  const filteredNotifications = allNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !notification.read) ||
                         (filterType === 'read' && notification.read) ||
                         notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'warning':
        return 'border-l-4 border-yellow-500';
      case 'success':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  const handleMarkAsRead = (id: number) => {
    console.log('Mark as read:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete notification:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-white/60 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                  <Bell className="w-8 h-8 text-blue-600" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="h-6 px-3 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                      {unreadCount} new
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay updated with your case activities and important reminders
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border-gray-300/60">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 sm:px-6 py-6">
        <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 ring-1 ring-gray-200/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/60 border-gray-300/60 focus:bg-white focus:border-blue-400 transition-all duration-200"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-white/60 border-gray-300/60 hover:bg-white/80 transition-all duration-200">
                      <Filter className="w-4 h-4" />
                      Filter: {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/90 backdrop-blur-sm">
                    <DropdownMenuItem onClick={() => setFilterType('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('unread')}>Unread</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('read')}>Read</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterType('urgent')}>Urgent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('warning')}>Warning</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('success')}>Success</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('info')}>Info</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 lg:flex-none bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 text-blue-700"
                >
                  Mark All as Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 lg:flex-none bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100 text-red-700"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 ring-1 ring-gray-200/50">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Bell className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">No notifications found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search or filter criteria.' : 'You\'re all caught up! Check back later for new updates.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={cn(
                  "group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/70 backdrop-blur-sm border-0 ring-1 ring-gray-200/50 hover:ring-blue-300/50 hover:scale-[1.02] animate-fade-in",
                  getNotificationTypeStyles(notification.type),
                  !notification.read && "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 ring-blue-200/60"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-full bg-white/60 group-hover:bg-white/80 transition-all duration-200">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                          )}
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-white/60 border-gray-300/60 text-gray-600"
                          >
                            {notification.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/60"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm">
                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                          <MailOpen className="w-4 h-4 mr-2" />
                          {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(notification.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default Notifications;
