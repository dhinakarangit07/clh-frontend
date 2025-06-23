"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  FileText,
  User,
  X,
  Loader2,
  Printer,
  Download,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  Hash,
  MessageSquare,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Client {
  id: number
  name: string
  email: string
  contact_number: string
  address: string
  created_at: string
  created_by: number | null
}

interface Payment {
  id?: number
  amount: string
  payment_date: string
  payment_mode: "cash" | "bank" | "upi" | "cheque" | "other"
  reference_no: string | null
  remarks: string | null
  created_at?: string
  created_by?: number | null
}

interface Invoice {
  id: number
  invoice_number: string
  client: Client
  amount: string
  due_date: string
  reference_no: string | null
  additional_details: string | null
  created_at: string
  created_by: number | null
  status: "Paid" | "Pending" | "Overdue"
  payments: Payment[]
  paid_amount: string
  pending_amount: string
}

interface NewInvoice {
  client: string
  amount: string
  due_date: string
  reference_no: string
  additional_details: string
  payments: Payment[]
}

const InvoiceHeader = ({
  invoice,
  onEdit,
  onDelete,
  onPrint,
  onDownload,
  isDeleting,
}: {
  invoice: Invoice
  onEdit: () => void
  onDelete: () => void
  onPrint: () => void
  onDownload: () => void
  isDeleting: boolean
}) => {
  const [showPayments, setShowPayments] = useState(false)

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* Client Info Block */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Client Information</h3>
            </div>
            <div className="space-y-3">
              <p className="text-xl font-bold text-gray-900">{invoice.client.name}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Phone:</span> {invoice.client.contact_number || "-"}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Email:</span> {invoice.client.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Address:</span> {invoice.client.address || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Details Block */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Invoice Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Invoice Number</p>
                <p className="font-bold text-lg text-gray-900">{invoice.invoice_number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Total Amount (₹)</p>
                <p className="font-bold text-lg text-gray-900">₹{Number.parseFloat(invoice.amount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Paid Amount (₹)</p>
                <p className="font-semibold text-green-600">₹{Number.parseFloat(invoice.paid_amount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Pending Amount (₹)</p>
                <p className="font-semibold text-red-600">₹{Number.parseFloat(invoice.pending_amount).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 font-medium">Due Date</p>
                <p className="font-semibold text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Edit and Delete together */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={onEdit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 rounded-xl font-semibold"
              disabled={isDeleting}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Invoice
            </Button>
            <Button
              onClick={onDelete}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 rounded-xl font-semibold"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {isDeleting ? "Deleting..." : "Delete Invoice"}
            </Button>
            <Button
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 bg-white"
              onClick={onPrint}
              disabled={isDeleting}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 bg-white"
              onClick={onDownload}
              disabled={isDeleting}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
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
                        <TableCell>₹{Number.parseFloat(payment.amount).toFixed(2)}</TableCell>
                        <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.payment_mode}</TableCell>
                        <TableCell>{payment.reference_no || "-"}</TableCell>
                        <TableCell>{payment.remarks || "-"}</TableCell>
                        <TableCell>{payment.created_by ? `User ${payment.created_by}` : "-"}</TableCell>
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

        {/* Additional Details */}
        {invoice.additional_details && (
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400">
            <h4 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">Additional Details</h4>
            <p className="text-sm text-amber-700 leading-relaxed">{invoice.additional_details}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const InvoiceForm = ({
  showAddForm,
  setShowAddForm,
  editingInvoice,
  setEditingInvoice,
  clients,
  fetchInvoices,
}: {
  showAddForm: boolean
  setShowAddForm: (value: boolean) => void
  editingInvoice: Invoice | null
  setEditingInvoice: (value: Invoice | null) => void
  clients: Client[]
  fetchInvoices: () => Promise<void>
}) => {
  const [newInvoice, setNewInvoice] = useState<NewInvoice>({
    client: "",
    amount: "",
    due_date: "",
    reference_no: "",
    additional_details: "",
    payments: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPayments, setShowPayments] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Populate form with editingInvoice data when it changes
  useEffect(() => {
    if (editingInvoice) {
      setNewInvoice({
        client: editingInvoice.client.id.toString(),
        amount: editingInvoice.amount,
        due_date: editingInvoice.due_date,
        reference_no: editingInvoice.reference_no || "",
        additional_details: editingInvoice.additional_details || "",
        payments: editingInvoice.payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          payment_date: payment.payment_date,
          payment_mode: payment.payment_mode,
          reference_no: payment.reference_no || "",
          remarks: payment.remarks || "",
          created_at: payment.created_at,
          created_by: payment.created_by,
        })),
      })
      // Show payments section if there are existing payments
      if (editingInvoice.payments.length > 0) {
        setShowPayments(true)
      }
    } else {
      // Reset form when no invoice is being edited
      setNewInvoice({
        client: "",
        amount: "",
        due_date: "",
        reference_no: "",
        additional_details: "",
        payments: [],
      })
      setShowPayments(false)
    }
  }, [editingInvoice])

  // FIXED: Add payment and directly show the payment form
  const addPayment = () => {
    setNewInvoice({
      ...newInvoice,
      payments: [
        ...newInvoice.payments,
        {
          amount: "",
          payment_date: "",
          payment_mode: "cash",
          reference_no: "",
          remarks: "",
        },
      ],
    })
    // FIXED: Automatically show payments section when adding a payment
    setShowPayments(true)
  }

  const updatePayment = (index: number, field: keyof Payment, value: string) => {
    const updatedPayments = [...newInvoice.payments]
    updatedPayments[index] = { ...updatedPayments[index], [field]: value }
    setNewInvoice({ ...newInvoice, payments: updatedPayments })
  }

  const removePayment = (index: number) => {
    const updatedPayments = newInvoice.payments.filter((_, i) => i !== index)
    setNewInvoice({
      ...newInvoice,
      payments: updatedPayments,
    })
    // Hide payments section if no payments left
    if (updatedPayments.length === 0) {
      setShowPayments(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!newInvoice.client || !newInvoice.amount || !newInvoice.due_date) {
      toast({
        title: "Error",
        description: "Client, amount, and due date are required.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) throw new Error("No access token found. Please log in.")

      const payload = {
        client: Number.parseInt(newInvoice.client),
        amount: Number.parseFloat(newInvoice.amount),
        due_date: newInvoice.due_date,
        reference_no: newInvoice.reference_no || null,
        additional_details: newInvoice.additional_details || null,
        payments: newInvoice.payments.map((payment) => ({
          id: payment.id || undefined,
          amount: Number.parseFloat(payment.amount),
          payment_date: payment.payment_date,
          payment_mode: payment.payment_mode,
          reference_no: payment.reference_no || null,
          remarks: payment.remarks || null,
        })),
      }

      if (editingInvoice) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/invoice/${editingInvoice.id}/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        toast({
          title: "Success",
          description: "Invoice updated successfully!",
        })
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/invoice/`, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        toast({
          title: "Success",
          description: "Invoice created successfully!",
        })
      }

      resetForm()
      await fetchInvoices()
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleSubmit(e))
      } else {
        toast({
          title: "Error",
          description:
            error.response?.data?.detail ||
            Object.values(error.response?.data || {}).join(" ") ||
            "Failed to save invoice.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setShowAddForm(false)
    setEditingInvoice(null)
    setNewInvoice({
      client: "",
      amount: "",
      due_date: "",
      reference_no: "",
      additional_details: "",
      payments: [],
    })
    setShowPayments(false)
  }

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) throw new Error("No refresh token found. Please log in again.")
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      })
      localStorage.setItem("accessToken", response.data.access)
      await retryFn()
    } catch (refreshError) {
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      })
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      navigate("/login")
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>

      {/* Header Section */}
      <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
              </h3>
              <p className="text-lg font-bold text-gray-900">
                {editingInvoice ? `Invoice #${editingInvoice.invoice_number}` : "New Invoice Details"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={resetForm} className="hover:bg-gray-100 rounded-full w-10 h-10">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          {/* Client and Invoice Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Client Selection Block */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Client Information</h3>
              </div>
              <div className="space-y-3">
                <Label htmlFor="client" className="text-sm font-medium text-gray-600">
                  Select Client *
                </Label>
                <Select
                  value={newInvoice.client}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, client: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl bg-white">
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-gray-500">{client.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoice Details Block */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Invoice Details</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-600">
                    Total Amount (₹) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                      required
                      placeholder="0.00"
                      disabled={isLoading}
                      className="h-12 pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date" className="text-sm font-medium text-gray-600">
                    Due Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="due_date"
                      type="date"
                      value={newInvoice.due_date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-12 pl-10 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reference and Additional Details */}
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                <Hash className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Additional Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference_no" className="text-sm font-medium text-gray-600">
                  Reference Number
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="reference_no"
                    value={newInvoice.reference_no}
                    onChange={(e) => setNewInvoice({ ...newInvoice, reference_no: e.target.value })}
                    placeholder="Enter reference number"
                    disabled={isLoading}
                    className="h-12 pl-10 border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional_details" className="text-sm font-medium text-gray-600">
                  Additional Details
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="additional_details"
                    value={newInvoice.additional_details}
                    onChange={(e) => setNewInvoice({ ...newInvoice, additional_details: e.target.value })}
                    placeholder="Enter additional details"
                    disabled={isLoading}
                    className="h-12 pl-10 border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPayments(!showPayments)}
                className="flex items-center gap-3 text-lg font-semibold text-gray-800 hover:bg-gray-100 rounded-xl p-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span>Payment Details ({newInvoice.payments.length})</span>
                {showPayments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
              <Button
                type="button"
                onClick={addPayment}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-4 py-2"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment
              </Button>
            </div>

            {showPayments && newInvoice.payments.length > 0 && (
              <div className="space-y-4">
                {newInvoice.payments.map((payment, index) => (
                  <Card key={index} className="border-0 shadow-md bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">Payment #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePayment(index)}
                          className="text-red-600 hover:bg-red-50 rounded-lg"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Amount (₹) *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              step="0.01"
                              value={payment.amount}
                              onChange={(e) => updatePayment(index, "amount", e.target.value)}
                              required
                              placeholder="0.00"
                              disabled={isLoading}
                              className="h-10 pl-10 rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Payment Date *</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="date"
                              value={payment.payment_date}
                              onChange={(e) => updatePayment(index, "payment_date", e.target.value)}
                              required
                              disabled={isLoading}
                              className="h-10 pl-10 rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Payment Mode *</Label>
                          <Select
                            value={payment.payment_mode}
                            onValueChange={(value) => updatePayment(index, "payment_mode", value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="h-10 rounded-lg">
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="bank">Bank Transfer</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="cheque">Cheque</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Reference Number</Label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              value={payment.reference_no || ""}
                              onChange={(e) => updatePayment(index, "reference_no", e.target.value)}
                              placeholder="Reference number"
                              disabled={isLoading}
                              className="h-10 pl-10 rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-gray-600">Remarks</Label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              value={payment.remarks || ""}
                              onChange={(e) => updatePayment(index, "remarks", e.target.value)}
                              placeholder="Enter remarks"
                              disabled={isLoading}
                              className="h-10 pl-10 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base font-semibold rounded-xl"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {isLoading ? "Saving..." : editingInvoice ? "Update Invoice" : "Create Invoice"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors px-8 py-3 text-base font-semibold rounded-xl bg-white"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const InvoiceView = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const API_URL = `${import.meta.env.VITE_API_URL}/api/invoice/`
  const CLIENT_API_URL = `${import.meta.env.VITE_API_URL}/api/client/`

  useEffect(() => {
    fetchClients()
    fetchInvoices()
  }, [])

  const fetchClients = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) throw new Error("No access token found. Please log in.")
      const response = await axios.get(CLIENT_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setClients(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch clients.",
        variant: "destructive",
      })
    }
  }

  const fetchInvoices = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) throw new Error("No access token found. Please log in.")
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const invoicesWithClients = await Promise.all(
        response.data.map(async (invoice: any) => {
          try {
            const clientResponse = await axios.get(`${CLIENT_API_URL}${invoice.client}/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            const dueDate = new Date(invoice.due_date)
            const today = new Date()
            const status: "Paid" | "Pending" | "Overdue" =
              Number.parseFloat(invoice.pending_amount) === 0 ? "Paid" : dueDate < today ? "Overdue" : "Pending"

            return {
              ...invoice,
              client: clientResponse.data,
              status,
            }
          } catch (clientError) {
            return {
              ...invoice,
              client: { id: invoice.client, name: "Unknown Client", email: "", contact_number: "", address: "" },
              status: "Pending",
            }
          }
        }),
      )
      setInvoices(invoicesWithClients)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, fetchInvoices)
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch invoices.",
          variant: "destructive",
        })
        if (error.message === "No access token found. Please log in.") {
          navigate("/login")
        }
      }
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleTokenRefresh = async (originalError: any, retryFn: () => Promise<void>) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) throw new Error("No refresh token found. Please log in again.")
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      })
      localStorage.setItem("accessToken", response.data.access)
      await retryFn()
    } catch (refreshError) {
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      })
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      navigate("/login")
    }
  }

  // FIXED: Direct edit functionality
  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setShowAddForm(true)
  }

  const handleDeleteInvoice = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return

    setDeletingInvoiceId(id)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) throw new Error("No access token found. Please log in.")
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      toast({
        title: "Success",
        description: "Invoice deleted successfully!",
      })
      await fetchInvoices()
    } catch (error: any) {
      if (error.response?.status === 401) {
        await handleTokenRefresh(error, () => handleDeleteInvoice(id))
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to delete invoice.",
          variant: "destructive",
        })
      }
    } finally {
      setDeletingInvoiceId(null)
    }
  }

  const openPDF = (invoice: Invoice, endpoint: string) => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No access token found. Please log in.",
        variant: "destructive",
      })
      navigate("/login")
      return
    }

    // Construct the URL with the access token as a query parameter
    const url = `${API_URL}${invoice.id}/${endpoint}/?token=${accessToken}`
    window.open(url, "_blank")
  }

  const handlePrintInvoice = (invoice: Invoice) => {
    openPDF(invoice, "print")
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    openPDF(invoice, "download")
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
      case "Pending":
        return "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0"
      case "Overdue":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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
  )

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
              Invoice Management
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Manage your invoices and payments with ease
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border">
              <span className="font-bold text-gray-900">{filteredInvoices.length}</span>
              <span className="ml-1">invoices found</span>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group px-6 py-3 text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add New Invoice
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="pt-8 pb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                placeholder="Search invoices by number or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-400/30 text-gray-900 placeholder:text-gray-500 text-base rounded-xl transition-all duration-300"
                disabled={isInitialLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Invoice Form */}
        {showAddForm && (
          <InvoiceForm
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingInvoice={editingInvoice}
            setEditingInvoice={setEditingInvoice}
            clients={clients}
            fetchInvoices={fetchInvoices}
          />
        )}

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
                    ? "No invoices match your search criteria. Try adjusting your search terms."
                    : "Get started by creating your first invoice to begin managing your business finances."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-base font-semibold rounded-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Invoice
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="space-y-4">
                {/* Invoice Header with integrated actions */}
                <InvoiceHeader
                  invoice={invoice}
                  onEdit={() => handleEditInvoice(invoice)}
                  onDelete={() => handleDeleteInvoice(invoice.id)}
                  onPrint={() => handlePrintInvoice(invoice)}
                  onDownload={() => handleDownloadInvoice(invoice)}
                  isDeleting={deletingInvoiceId === invoice.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceView
