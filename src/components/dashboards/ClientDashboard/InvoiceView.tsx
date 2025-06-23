import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, DollarSign, Printer, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Client {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  address: string;
  created_at: string;
  created_by: number | null;
}

interface Payment {
  id?: number;
  amount: string;
  payment_date: string;
  payment_mode: 'cash' | 'bank' | 'upi' | 'cheque' | 'other';
  reference_no: string | null;
  remarks: string | null;
  created_at?: string;
  created_by?: number | null;
}

interface Invoice {
  id: number;
  invoice_number: string;
  client: Client;
  amount: string;
  payment_date: string;
  payment_mode: 'cash' | 'bank' | 'upi' | 'cheque' | 'other';
  reference_no: string | null;
  remarks: string | null;
  created_at: string;
  created_by: number | null;
  status: 'Paid' | 'Pending' | 'Overdue';
  payments: Payment[];
  paid_amount: string;
  pending_amount: string;
}

const InvoiceHeader = ({
  invoice,
  handlePrintInvoice,
  handleDownloadInvoice,
}: {
  invoice: Invoice;
  handlePrintInvoice: (invoice: Invoice) => void;
  handleDownloadInvoice: (invoice: Invoice) => void;
}) => {
  const [showPayments, setShowPayments] = useState(false);

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-0 divide-y divide-gray-100">
          {/* Invoice Details Block */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Invoice Details
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Invoice Number</p>
                <p className="font-bold text-lg text-gray-900">{invoice.invoice_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Total Amount (₹)</p>
                <p className="font-bold text-lg text-gray-900">₹{parseFloat(invoice.amount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Paid Amount (₹)</p>
                <p className="font-semibold text-green-600">₹{parseFloat(invoice.paid_amount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Pending Amount (₹)</p>
                <p className="font-semibold text-red-600">₹{parseFloat(invoice.pending_amount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Payment Date</p>
                <p className="font-semibold text-gray-900">{new Date(invoice.payment_date).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Payment Mode</p>
                <p className="font-semibold text-gray-900">{invoice.payment_mode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Toggle */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={() => setShowPayments(!showPayments)}
            className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 hover:bg-gray-100 rounded-xl"
          >
            <span>Payment Details</span>
            {showPayments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
          {showPayments && (
            <div className="mt-4 space-y-6">
              {invoice.payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead>Reference No</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.payments.map((payment, index) => (
                      <TableRow key={payment.id || index}>
                        <TableCell>₹{parseFloat(payment.amount).toFixed(2)}</TableCell>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.payment_mode}</TableCell>
                        <TableCell>{payment.reference_no || '-'}</TableCell>
                        <TableCell>{payment.remarks || '-'}</TableCell>
                        <TableCell>{payment.created_by ? `User ${payment.created_by}` : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-600 text-center">No payments recorded for this invoice.</p>
              )}
            </div>
          )}
        </div>

        {/* Remarks Section */}
        {invoice.remarks && (
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-gray-100">
            <h4 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">Remarks</h4>
            <p className="text-sm text-amber-700 leading-relaxed">{invoice.remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InvoiceView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = `${import.meta.env.VITE_API_URL}/api/client/invoice/`;
  const PUBLIC_API_URL = `${import.meta.env.VITE_API_URL}/api/invoice/`;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token found. Please log in.');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const invoicesWithStatus = response.data.map((invoice: any) => {
        const paymentDate = new Date(invoice.payment_date);
        const today = new Date();
        const status: 'Paid' | 'Pending' | 'Overdue' =
          parseFloat(invoice.pending_amount) === 0 ? 'Paid' :
          paymentDate < today ? 'Overdue' : 'Pending';

        return {
          ...invoice,
          status,
          payments: invoice.payments || [],
        };
      });
      setInvoices(invoicesWithStatus);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, fetchInvoices);
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch invoices.',
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
      if (!refreshToken) throw new Error('No refresh token found. Please log in again.');
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

  const openPDF = (invoice: Invoice, endpoint: string) => {
    const url = `${PUBLIC_API_URL}${invoice.id}/${endpoint}/`;
    window.open(url, '_blank');
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    openPDF(invoice, 'print');
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    openPDF(invoice, 'download');
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
      case 'Pending':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0';
      case 'Overdue':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const InvoiceCardSkeleton = () => (
    <Card className="animate-pulse overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"></div>
      <CardContent className="pt-8 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="h-7 bg-gray-200 rounded-lg w-52"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-44"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-36"></div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="h-4 bg-gray-200 rounded w-72"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Your Invoices
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              View your invoices and payment details
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="pt-8 pb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                placeholder="Search invoices by number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-400/30 text-gray-900 placeholder:text-gray-500 text-base rounded-xl transition-all duration-300"
                disabled={isInitialLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoices Grid */}
        <div className="grid gap-8">
          {isInitialLoading ? (
            <>
              <InvoiceCardSkeleton />
              <InvoiceCardSkeleton />
              <InvoiceCardSkeleton />
            </>
          ) : filteredInvoices.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gray-400 to-gray-600"></div>
              <CardContent className="pt-16 pb-16 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-8">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">No invoices found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                  {searchTerm
                    ? 'No invoices match your search criteria. Try adjusting your search terms.'
                    : 'You currently have no invoices associated with your account.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="space-y-8">
                <InvoiceHeader
                  invoice={invoice}
                  handlePrintInvoice={handlePrintInvoice}
                  handleDownloadInvoice={handleDownloadInvoice}
                />
                <div className="flex justify-end gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg max-w-6xl mx-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    onClick={() => handlePrintInvoice(invoice)}
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    Print Invoice
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
