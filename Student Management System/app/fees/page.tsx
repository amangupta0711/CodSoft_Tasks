"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Receipt,
  Plus,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  History,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Role } from "@/lib/types";

export default function FeesPage() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<Role>("ADMIN");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<any | null>(null);
  const [viewingPayments, setViewingPayments] = useState<any | null>(null);

  // Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: "",
    title: "Spring Semester 2025 Tuition",
    category: "TUITION",
    totalAmount: 3500,
    dueDate: "2026-11-30",
    notes: "Term tuition invoice with digital library access credit.",
  });
  const [submittingInvoice, setSubmittingInvoice] = useState(false);

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 100,
    paymentMethod: "ONLINE_DEMO",
    transactionRef: "",
    notes: "Demo settlement transaction",
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role) setUserRole(d.user.role);
      })
      .catch(() => {});

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, stuRes] = await Promise.all([
        fetch("/api/fees/invoices").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
      ]);

      if (invRes.success) setInvoices(invRes.data);
      if (stuRes.success) {
        setStudents(stuRes.data);
        if (stuRes.data.length > 0 && !invoiceForm.studentId) {
          setInvoiceForm((prev) => ({ ...prev, studentId: stuRes.data[0].id }));
        }
      }
    } catch {
      toast("Failed to load fee records", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInvoice(true);

    try {
      const res = await fetch("/api/fees/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      toast("Fee invoice issued successfully!", "success");
      setIsCreateInvoiceOpen(false);
      fetchData();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    setSubmittingPayment(true);
    try {
      const res = await fetch("/api/fees/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: payingInvoice.id,
          amount: Number(paymentForm.amount),
          paymentMethod: paymentForm.paymentMethod,
          transactionRef: paymentForm.transactionRef || `TXN-DEMO-${Date.now().toString().slice(-6)}`,
          notes: paymentForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");

      toast(`Payment of $${paymentForm.amount} recorded! Receipt: ${data.data.receiptNumber}`, "success");
      setPayingInvoice(null);
      fetchData();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Financial aggregates
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.student?.fullName?.toLowerCase().includes(q) ||
        i.student?.studentId?.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === "ALL" || i.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, selectedStatus]);

  return (
    <DashboardLayout userRole={userRole}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            Fee & Payment Management
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Institutional Billing
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track student fee invoices, process installments, audit payment receipts and manage balances.
          </p>
        </div>

        {userRole === "ADMIN" && (
          <button
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Generate Fee Invoice</span>
          </button>
        )}
      </div>

      {/* Financial KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Total Assessed</span>
            <DollarSign className="w-4 h-4 text-navy-700" />
          </div>
          <div className="text-2xl font-bold text-navy-950 mt-2">${totalBilled.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total invoiced fees across semesters</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Collected Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">${totalCollected.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified settled payments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Outstanding Receivables</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">${totalOutstanding.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-1">Pending and overdue student balances</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice #, student name, or invoice title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Student</th>
                <th className="p-4">Title & Category</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Loading fee invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No fee invoices match criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy-950 block">
                        {inv.student?.fullName || "Student"}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {inv.student?.studentId}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-navy-950 block">{inv.title}</span>
                      <span className="text-[10px] font-bold text-gold-700 uppercase bg-gold-50 px-1.5 py-0.5 rounded border border-gold-200 inline-block mt-0.5">
                        {inv.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-navy-950">${inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-emerald-700">${inv.paidAmount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-navy-900">
                      ${inv.balance.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : inv.status === "PARTIALLY_PAID"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : inv.status === "OVERDUE"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingPayments(inv)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View Payment History"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Receipts ({inv.payments?.length || 0})</span>
                        </button>

                        {userRole === "ADMIN" && inv.balance > 0 && (
                          <button
                            onClick={() => {
                              setPayingInvoice(inv);
                              setPaymentForm({
                                amount: inv.balance,
                                paymentMethod: "ONLINE_DEMO",
                                transactionRef: `TXN-${Date.now().toString().slice(-6)}`,
                                notes: "Payment installment received",
                              });
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Record Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Fee Invoice */}
      <Modal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        title="Issue Student Fee Invoice"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Select Student *
            </label>
            <select
              required
              value={invoiceForm.studentId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Invoice Title *
            </label>
            <input
              type="text"
              required
              value={invoiceForm.title}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              placeholder="Fall Semester 2024 Tuition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">Fee Category *</label>
              <select
                value={invoiceForm.category}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              >
                <option value="TUITION">Tuition</option>
                <option value="LIBRARY">Library & Digital</option>
                <option value="LABORATORY">Laboratory & Tech</option>
                <option value="SPORTS">Sports & Facilities</option>
                <option value="EXAMINATION">Examination</option>
                <option value="ANNUAL">Annual Registration</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Total Amount ($) *
              </label>
              <input
                type="number"
                min={1}
                required
                value={invoiceForm.totalAmount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, totalAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Due Date *</label>
            <input
              type="date"
              required
              value={invoiceForm.dueDate}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Notes & Conditions</label>
            <textarea
              rows={2}
              value={invoiceForm.notes}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateInvoiceOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingInvoice}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 shadow-sm"
            >
              {submittingInvoice ? "Issuing..." : "Confirm & Issue"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Fee Payment */}
      <Modal
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
        title={`Record Payment for ${payingInvoice?.invoiceNumber}`}
        subtitle={`Outstanding Balance: $${payingInvoice?.balance}`}
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Payment Amount ($) *
            </label>
            <input
              type="number"
              min={1}
              max={payingInvoice?.balance}
              required
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-navy-900 focus:border-navy-900 outline-none bg-slate-50"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Payment cannot exceed balance of ${payingInvoice?.balance}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Payment Method</label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            >
              <option value="ONLINE_DEMO">Online Demo Payment (Simulated)</option>
              <option value="BANK_TRANSFER">Direct Bank Wire</option>
              <option value="CASH">Cash Counter Receipt</option>
              <option value="CHEQUE">Cheque Deposit</option>
              <option value="CARD">Debit / Credit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">
              Transaction / Reference #
            </label>
            <input
              type="text"
              value={paymentForm.transactionRef}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Cashier Remarks</label>
            <input
              type="text"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-navy-900 outline-none bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPayingInvoice(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingPayment}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              {submittingPayment ? "Processing..." : "Generate Receipt & Settle"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Receipt History */}
      <Modal
        isOpen={!!viewingPayments}
        onClose={() => setViewingPayments(null)}
        title={`Payment History: ${viewingPayments?.invoiceNumber}`}
        subtitle={`${viewingPayments?.title} (${viewingPayments?.student?.fullName})`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
            <span>
              Total: <strong>${viewingPayments?.totalAmount}</strong>
            </span>
            <span>
              Paid: <strong className="text-emerald-700">${viewingPayments?.paidAmount}</strong>
            </span>
            <span>
              Remaining Balance: <strong className="text-red-600">${viewingPayments?.balance}</strong>
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {viewingPayments?.payments?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No payments logged yet.</p>
            ) : (
              viewingPayments?.payments?.map((p: any) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-navy-900 block">
                      Receipt: {p.receiptNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Method: {p.paymentMethod} • Ref: {p.transactionRef || "N/A"}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.notes || "Paid in full"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-700 block">${p.amount}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
