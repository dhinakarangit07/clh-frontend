import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, User, X, Loader2, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  create_login: boolean;
  allow_login: boolean;
  contact_number: string | null;
  address: string | null;
  created_at: string;
  created_by: number | null;
  is_corporate: boolean;
  payment_amount: number | string; // Allow string from API, will parse to number
}

// Loading skeleton component for client cards
const ClientCardSkeleton = () => (
  <Card className="animate-pulse overflow-hidden">
    <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
    <CardContent className="pt-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
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
            <div className="flex items-start gap-2 md:col-span-2">
              <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
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

const ClientsView = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    password: '',
    create_login: false,
    allow_login: true,
    contact_number: '',
    address: '',
    is_corporate: false,
    payment_amount: 0,
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = `${import.meta.env.VITE_API_URL}/api/client/`;

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
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
      // Parse payment_amount to number
      const parsedClients = response.data.map((client: Client) => ({
        ...client,
        payment_amount: parseFloat(client.payment_amount as string) || 0,
      }));
      setClients(parsedClients);
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

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!newClient.name || !newClient.email) {
      toast({
        title: 'Error',
        description: 'Name and email are required.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    if (newClient.create_login && !newClient.password) {
      toast({
        title: 'Error',
        description: 'Password is required when creating a login.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    if (newClient.payment_amount < 0) {
      toast({
        title: 'Error',
        description: 'Payment amount cannot be negative.',
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
        name: newClient.name,
        email: newClient.email,
        password: newClient.password || null,
        create_login: newClient.create_login,
        allow_login: newClient.allow_login,
        contact_number: newClient.contact_number || null,
        address: newClient.address || null,
        is_corporate: newClient.is_corporate,
        payment_amount: newClient.payment_amount,
      };

      if (editingClient) {
        // Update client
        await axios.put(`${API_URL}${editingClient.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({
          title: 'Success',
          description: 'Client updated successfully!',
        });
        setEditingClient(null);
      } else {
        // Create client
        await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        toast({
          title: 'Success',
          description: 'Client created successfully!',
        });
      }

      // Reset form and refresh client list
      setNewClient({ name: '', email: '', password: '', create_login: false, allow_login: true, contact_number: '', address: '', is_corporate: false, payment_amount: 0 });
      setShowAddForm(false);
      await fetchClients();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleAddClient(e));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || Object.values(error.response?.data || {}).join(' ') || 'Failed to save client.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      email: client.email,
      password: '', // Password is write-only, so we don't prefill it
      create_login: false, // Not editable during update
      allow_login: client.allow_login,
      contact_number: client.contact_number || '',
      address: client.address || '',
      is_corporate: client.is_corporate,
      payment_amount: Number(client.payment_amount) || 0,
    });
    setShowAddForm(true);
  };

  const handleDeleteClient = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    setDeletingClientId(id);
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
        description: 'Client deleted successfully!',
      });
      await fetchClients();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteClient(id));
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Failed to delete client.',
          variant: 'destructive',
        });
      }
    } finally {
      setDeletingClientId(null);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.is_corporate ? 'corporate' : 'individual').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setShowAddForm(false);
    setEditingClient(null);
    setNewClient({ name: '', email: '', password: '', create_login: false, allow_login: true, contact_number: '', address: '', is_corporate: false, payment_amount: 0 });
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
              Client Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage your client relationships with ease
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredClients.length}</span> clients found
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Client
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search clients by name, email, or type (corporate/individual)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/90 text-gray-900 placeholder:text-gray-500"
                disabled={isInitialLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Client Form */}
        {showAddForm && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden animate-fade-in">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {editingClient ? 'Edit Client' : 'Add New Client'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {editingClient ? 'Update client information' : 'Enter client details to get started'}
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
              <form onSubmit={handleAddClient} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      required
                      placeholder="Enter client's full name"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      required
                      placeholder="client@example.com"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  {!editingClient && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password {newClient.create_login ? '*' : '(Optional)'}
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={newClient.password}
                        onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                        placeholder="Enter password for client login"
                        disabled={isLoading}
                        className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="contact_number" className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      value={newClient.contact_number}
                      onChange={(e) => setNewClient({ ...newClient, contact_number: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_amount" className="text-sm font-semibold text-gray-700">
                      Payment Amount
                    </Label>
                    <Input
                      id="payment_amount"
                      name="payment_amount"
                      type="number"
                      step="0.01"
                      value={newClient.payment_amount}
                      onChange={(e) => setNewClient({ ...newClient, payment_amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      disabled={isLoading}
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    placeholder="Enter complete address"
                    disabled={isLoading}
                    className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <div className="space-y-4">
                  {!editingClient && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="create_login"
                        checked={newClient.create_login}
                        onCheckedChange={(checked) => setNewClient({ ...newClient, create_login: !!checked })}
                        disabled={isLoading}
                      />
                      <Label htmlFor="create_login" className="text-sm font-semibold text-gray-700">
                        Create user account for this client
                      </Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_login"
                      checked={newClient.allow_login}
                      onCheckedChange={(checked) => setNewClient({ ...newClient, allow_login: !!checked })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="allow_login" className="text-sm font-semibold text-gray-700">
                      Allow this client to log in
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_corporate"
                      checked={newClient.is_corporate}
                      onCheckedChange={(checked) => setNewClient({ ...newClient, is_corporate: !!checked })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="is_corporate" className="text-sm font-semibold text-gray-700">
                      Corporate Client
                    </Label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isLoading ? 'Saving...' : editingClient ? 'Update Client' : 'Add Client'}
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

        {/* Clients Grid */}
        <div className="grid gap-6">
          {isInitialLoading ? (
            <>
              <ClientCardSkeleton />
              <ClientCardSkeleton />
              <ClientCardSkeleton />
            </>
          ) : filteredClients.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-6">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No clients found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? 'No clients match your search criteria. Try adjusting your search terms.' 
                    : 'Get started by adding your first client to begin managing your relationships.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Client
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card 
                key={client.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] animate-fade-in"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {client.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge 
                            variant={client.allow_login ? 'default' : 'secondary'}
                            className={client.allow_login 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' 
                              : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {client.allow_login ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge 
                            variant={client.is_corporate ? 'default' : 'secondary'}
                            className={client.is_corporate 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0' 
                              : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {client.is_corporate ? 'Corporate' : 'Individual'}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="break-all">{client.email}</span>
                        </div>
                        {client.contact_number && (
                          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                              <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <span>{client.contact_number}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-800 transition-colors">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span>${Number(client.payment_amount).toFixed(2)}</span>
                        </div>
                        {client.address && (
                          <div className="flex items-start gap-3 text-gray-600 group-hover:text-gray-800 transition-colors md:col-span-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 mt-0.5">
                              <MapPin className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="break-words">{client.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                        onClick={() => handleEditClient(client)}
                        disabled={deletingClientId === client.id}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                        onClick={() => handleDeleteClient(client.id)}
                        disabled={deletingClientId === client.id}
                      >
                        {deletingClientId === client.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        {deletingClientId === client.id ? 'Deleting...' : 'Delete'}
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

export default ClientsView;
