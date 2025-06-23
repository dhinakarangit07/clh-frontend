

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  User,
  X,
  Shield,
  Loader2,
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Advocate {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  create_login: boolean;
  allow_login: boolean;
  mobile_no: string | null;
  barcode_number: string | null;
  can_add_cases: boolean;
  can_modify_cases: boolean;
  can_view_all_cases: boolean;
  can_view_assigned_cases: boolean;
  can_view_case_fees: boolean;
  created_at: string;
  created_by: number | null;
}

const AdvocateCardSkeleton = () => (
  <Card className="animate-pulse overflow-hidden">
    <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
    <CardContent className="pt-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            <div className="h-5 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdvocatesView = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [newAdvocate, setNewAdvocate] = useState({
    name: '',
    email: '',
    password: '',
    create_login: false,
    allow_login: true,
    mobile_no: '',
    barcode_number: '',
    can_add_cases: false,
    can_modify_cases: false,
    can_view_all_cases: false,
    can_view_assigned_cases: false,
    can_view_case_fees: false
  });
  const [editingAdvocate, setEditingAdvocate] = useState<Advocate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [deletingAdvocateId, setDeletingAdvocateId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = `${import.meta.env.VITE_API_URL}/api/advocate/`;

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAdvocates(response.data);
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      });
      localStorage.setId('accessToken', response.data.access);
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

  const handleAddAdvocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newAdvocate.name || !newAdvocate.email || !newAdvocate.mobile_no) {
      toast({
        title: 'Error',
        description: 'Name, email, and mobile number are required.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    if (newAdvocate.create_login && !newAdvocate.password) {
      toast({
        title: 'Error',
        description: 'Password is required when creating a login.',
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
        name: newAdvocate.name,
        email: newAdvocate.email,
        password: newAdvocate.password || null,
        create_login: newAdvocate.create_login,
        allow_login: newAdvocate.allow_login,
        mobile_no: newAdvocate.mobile_no || null,
        barcode_number: newAdvocate.barcode_number || null,
        can_add_cases: newAdvocate.can_add_cases,
        can_modify_cases: newAdvocate.can_modify_cases,
        can_view_all_cases: newAdvocate.can_view_all_cases,
        can_view_assigned_cases: newAdvocate.can_view_assigned_cases,
        can_view_case_fees: newAdvocate.can_view_case_fees
      };

      if (editingAdvocate) {
        await axios.put(`${API_URL}${editingAdvocate.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({
          title: 'Success',
          description: 'Advocate updated successfully!',
        });
        setEditingAdvocate(null);
      } else {
        await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({
          title: 'Success',
          description: 'Advocate created successfully!',
        });
      }

      setNewAdvocate({
        name: '',
        email: '',
        password: '',
        create_login: false,
        allow_login: true,
        mobile_no: '',
        barcode_number: '',
        can_add_cases: false,
        can_modify_cases: false,
        can_view_all_cases: false,
        can_view_assigned_cases: false,
        can_view_case_fees: false
      });
      setShowAddForm(false);
      await fetchAdvocates();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleAddAdvocate(e));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || Object.values(error.response?.data || {}).join(' ') || 'Failed to save advocate.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAdvocate = (advocate: Advocate) => {
    setEditingAdvocate(advocate);
    setNewAdvocate({
      name: advocate.name,
      email: advocate.email,
      password: '',
      create_login: false,
      allow_login: advocate.allow_login,
      mobile_no: advocate.mobile_no || '',
      barcode_number: advocate.barcode_number || '',
      can_add_cases: advocate.can_add_cases,
      can_modify_cases: advocate.can_modify_cases,
      can_view_all_cases: advocate.can_view_all_cases,
      can_view_assigned_cases: advocate.can_view_assigned_cases,
      can_view_case_fees: advocate.can_view_case_fees
    });
    setShowAddForm(true);
  };

  const handleDeleteAdvocate = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this advocate?')) return;

    setDeletingAdvocateId(id);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }
      await axios.delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast({
        title: 'Success',
        description: 'Advocate deleted successfully!',
      });
      await fetchAdvocates();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteAdvocate(id));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Failed to delete advocate.',
          variant: 'destructive',
        });
      }
    } finally {
      setDeletingAdvocateId(null);
    }
  };

  const filteredAdvocates = advocates.filter(advocate =>
    advocate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advocate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (advocate.barcode_number?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const resetForm = () => {
    setShowAddForm(false);
    setEditingAdvocate(null);
    setNewAdvocate({
      name: '',
      email: '',
      password: '',
      create_login: false,
      allow_login: true,
      mobile_no: '',
      barcode_number: '',
      can_add_cases: false,
      can_modify_cases: false,
      can_view_all_cases: false,
      can_view_assigned_cases: false,
      can_view_case_fees: false
    });
  };

  const updatePermission = (permission: keyof typeof newAdvocate, checked: boolean) => {
    setNewAdvocate({
      ...newAdvocate,
      [permission]: checked
    });
  };

  const getPermissionBadges = (advocate: Advocate) => {
    const badges = [];
    if (advocate.can_add_cases) badges.push('Add Cases');
    if (advocate.can_modify_cases) badges.push('Modify Cases');
    if (advocate.can_view_all_cases) badges.push('View All Cases');
    if (advocate.can_view_assigned_cases) badges.push('View Assigned Only');
    if (advocate.can_view_case_fees) badges.push('View Fees');
    return badges;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Advocate Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your advocate accounts and permissions
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredAdvocates.length}</span> advocates found
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Advocate
          </Button>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search advocates by name, email, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/90 text-gray-900 placeholder:text-gray-500"
                disabled={isInitialLoading}
              />
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-fade-in">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {editingAdvocate ? 'Edit Advocate' : 'Create New Advocate'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {editingAdvocate ? 'Update advocate details and permissions' : 'Enter advocate details and set permissions'}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetForm}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleAddAdvocate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={newAdvocate.name}
                      onChange={(e) => setNewAdvocate({ ...newAdvocate, name: e.target.value })}
                      required
                      placeholder="Enter advocate name"
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdvocate.email}
                      onChange={(e) => setNewAdvocate({ ...newAdvocate, email: e.target.value })}
                      required
                      placeholder="Enter email address"
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      disabled={isLoading}
                    />
                  </div>
                  {!editingAdvocate && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password {newAdvocate.create_login ? '*' : '(Optional)'}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAdvocate.password}
                        onChange={(e) => setNewAdvocate({ ...newAdvocate, password: e.target.value })}
                        placeholder="Enter password for advocate login"
                        disabled={isLoading}
                        className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="mobile_no" className="text-sm font-semibold text-gray-700">
                      Mobile No. (for SMS Alerts) *
                    </Label>
                    <Input
                      id="mobile_no"
                      value={newAdvocate.mobile_no}
                      onChange={(e) => setNewAdvocate({ ...newAdvocate, mobile_no: e.target.value })}
                      required
                      placeholder="Enter mobile number"
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode_number" className="text-sm font-semibold text-gray-700">
                      Barcode Number
                    </Label>
                    <Input
                      id="barcode_number"
                      value={newAdvocate.barcode_number}
                      onChange={(e) => setNewAdvocate({ ...newAdvocate, barcode_number: e.target.value })}
                      placeholder="Enter barcode number"
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {!editingAdvocate && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="create_login"
                        checked={newAdvocate.create_login}
                        onCheckedChange={(checked) => setNewAdvocate({ ...newAdvocate, create_login: !!checked })}
                        disabled={isLoading}
                      />
                      <Label htmlFor="create_login" className="text-sm font-semibold text-gray-700">
                        Create user account for this advocate
                      </Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_login"
                      checked={newAdvocate.allow_login}
                      onCheckedChange={(checked) => setNewAdvocate({ ...newAdvocate, allow_login: !!checked })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="allow_login" className="text-sm font-semibold text-gray-700">
                      Allow this advocate to log in
                    </Label>
                  </div>
                  <Label className="text-base font-semibold text-gray-700">Permissions</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_add_cases"
                        checked={newAdvocate.can_add_cases}
                        onCheckedChange={(checked) => updatePermission('can_add_cases', checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="can_add_cases" className="text-sm text-gray-700">
                        Add Cases
                        <p className="text-xs text-gray-600">User will be able to add cases.</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_modify_cases"
                        checked={newAdvocate.can_modify_cases}
                        onCheckedChange={(checked) => updatePermission('can_modify_cases', checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="can_modify_cases" className="text-sm text-gray-700">
                        Modify Cases
                        <p className="text-xs text-gray-600">User will be able to modify existing cases.</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_view_all_cases"
                        checked={newAdvocate.can_view_all_cases}
                        onCheckedChange={(checked) => updatePermission('can_view_all_cases', checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="can_view_all_cases" className="text-sm text-gray-700">
                        View All Cases
                        <p className="text-xs text-gray-600">User will be able to view all cases.</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_view_assigned_cases"
                        checked={newAdvocate.can_view_assigned_cases}
                        onCheckedChange={(checked) => updatePermission('can_view_assigned_cases', checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="can_view_assigned_cases" className="text-sm text-gray-700">
                        View Only Assigned Cases
                        <p className="text-xs text-gray-600">User will be able to view only assigned cases.</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Checkbox
                        id="can_view_case_fees"
                        checked={newAdvocate.can_view_case_fees}
                        onCheckedChange={(checked) => updatePermission('can_view_case_fees', checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor="can_view_case_fees" className="text-sm text-gray-700">
                        View Case Fees
                        <p className="text-xs text-gray-600">User will be able to view case fees.</p>
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isLoading ? 'Saving...' : editingAdvocate ? 'Update Advocate' : 'Create Advocate'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
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

        <div className="grid gap-6">
          {isInitialLoading ? (
            <>
              <AdvocateCardSkeleton />
              <AdvocateCardSkeleton />
              <AdvocateCardSkeleton />
            </>
          ) : filteredAdvocates.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No advocates found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? 'No advocates match your search criteria. Try adjusting your search terms.' 
                    : 'Get started by adding your first advocate to begin managing your accounts.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Advocate
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAdvocates.map((advocate) => (
              <Card 
                key={advocate.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] animate-fade-in"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {advocate.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge 
                            variant={advocate.allow_login ? 'default' : 'secondary'}
                            className={advocate.allow_login 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' 
                              : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {advocate.allow_login ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {getPermissionBadges(advocate).length} Permissions
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="break-all">{advocate.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <span>{advocate.mobile_no}</span>
                        </div>
                        {advocate.barcode_number && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                              <Code className="w-4 h-4 text-purple-600" />
                            </div>
                            <span>{advocate.barcode_number}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {getPermissionBadges(advocate).map((permission) => (
                          <Badge 
                            key={permission} 
                            variant="secondary" 
                            className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                        onClick={() => handleEditAdvocate(advocate)}
                        disabled={deletingAdvocateId === advocate.id}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                        onClick={() => handleDeleteAdvocate(advocate.id)}
                        disabled={deletingAdvocateId === advocate.id}
                      >
                        {deletingAdvocateId === advocate.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        {deletingAdvocateId === advocate.id ? 'Deleting...' : 'Delete'}
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

export default AdvocatesView;