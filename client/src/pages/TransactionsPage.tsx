import React, { useState, useMemo, ReactNode } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecords, FinancialRecord } from "../context/financial-record-context";
import DashboardLayout from '../Layouts/DashboardLayout';
import {
  Search, Filter, ChevronLeft, ChevronRight, Pencil, Trash2,
  Briefcase, Zap, Utensils, Tag, Landmark, CreditCard, Plus
} from 'lucide-react';

// Import Modals
import SuccessModal from '../components/dashboard/SuccessModal';
import TransactionFormModal from '../components/dashboard/TransactionFormModal'; // For Adding
import UpdateTransactionModal from '../components/dashboard/UpdateTransactionModal'; // For Editing
import CustomSelect from '../components/dashboard/CustomSelect';

// --- HELPER: Get Icon & Color based on Category ---
const getCategoryDetails = (category: string) => {
  switch (category) {
    case 'Salary':
    case 'Income':
      return { icon: Briefcase, color: 'bg-green-100 text-green-600' };
    case 'Utilities':
    case 'Bills':
      return { icon: Zap, color: 'bg-yellow-100 text-yellow-600' };
    case 'Food':
    case 'Dining':
      return { icon: Utensils, color: 'bg-orange-100 text-orange-600' };
    default:
      return { icon: Tag, color: 'bg-gray-100 text-gray-600' };
  }
};

interface DashboardLayoutProps {
  children?: ReactNode;
}

// --- HELPER: Get Payment Icon ---
const getPaymentIcon = (method: string) => {
  if (method.toLowerCase().includes('card')) return CreditCard;
  if (method.toLowerCase().includes('bank')) return Landmark;
  return Tag;
};

const Transactions: React.FC<DashboardLayoutProps> = () => {
  const { user } = useUser();
  const { records, addRecord, updateRecord, deleteRecord } = useFinancialRecords();

  // ==========================================
  // 1. ADD TRANSACTION STATE
  // ==========================================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addDescription, setAddDescription] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addPaymentMethod, setAddPaymentMethod] = useState("");

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newRecord = {
      userId: user?.id ?? "",
      date: new Date(),
      description: addDescription,
      amount: parseFloat(addAmount),
      category: addCategory,
      paymentMethod: addPaymentMethod
    };
    
    addRecord(newRecord);
    setSuccessData({ ...newRecord, type: 'Added' });
    setIsAddModalOpen(false);
    
    // Reset Form
    setAddDescription("");
    setAddAmount("");
    setAddCategory("");
    setAddPaymentMethod("");
  };

  // ==========================================
  // 2. EDIT TRANSACTION STATE
  // ==========================================
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  // Success Modal State
  const [successData, setSuccessData] = useState<any>(null);

  // --- HANDLERS ---
  const handleOpenEdit = (record: FinancialRecord) => {
    setSelectedRecord(record);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = (id: string, updatedRecord: FinancialRecord) => {
    updateRecord(id, updatedRecord);
    setSuccessData({ ...updatedRecord, type: 'Updated' });
    setIsUpdateModalOpen(false);
    setSelectedRecord(null);
  };

  // ==========================================
  // 3. SEARCH & PAGINATION LOGIC
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || record.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [records, searchTerm, categoryFilter]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentData = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueCategories = ["All", ...Array.from(new Set(records.map(r => r.category)))];

  return (
    // Pass the Open handler to DashboardLayout so its header button works
    <DashboardLayout onAddTransactionClick={() => setIsAddModalOpen(true)}>
      
      <div className="space-y-6 relative min-h-[80vh]">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Transactions</h1>
        </div>

        {/* --- CONTROLS --- */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-slate-500/20 outline-none text-sm font-bold placeholder:font-normal text-gray-700"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="min-w-[200px]">
            <CustomSelect
              label="Filter Category"
              options={uniqueCategories}
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
              icon={Filter}
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                  <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((record) => {
                    const { icon: CatIcon, color: catColor } = getCategoryDetails(record.category);
                    const PayIcon = getPaymentIcon(record.paymentMethod);

                    return (
                      <tr key={record._id} className="group hover:bg-gray-50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${catColor}`}>
                              <CatIcon size={20} />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{record.category}</span>
                          </div>
                        </td>
                        <td className="p-6 text-sm font-bold text-gray-900">{record.description}</td>
                        <td className="p-6 text-sm text-gray-500 font-medium">
                          {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">
                            <PayIcon size={14} />
                            {record.paymentMethod}
                          </div>
                        </td>
                        <td className={`p-6 text-sm font-black text-right ${record.category === 'Salary' || record.category === 'Income'
                          ? 'text-[#10B981]'
                          : 'text-red-500'
                          }`}>
                          {record.category === 'Salary' || record.category === 'Income' ? '+' : '-'}
                          {record.amount.toFixed(2)}
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(record)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deleteRecord(record._id ?? "")}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION --- */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center gap-4 justify-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-sm font-bold text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING ADD BUTTON --- */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg shadow-primary/30 transition-transform hover:-translate-y-1 z-50 flex items-center gap-2 pr-6">
        <Plus size={24} />
        <span className="font-bold">Add Transaction</span>
      </button>

      {/* --- MODALS --- */}
      {successData && (
        <SuccessModal data={successData} onClose={() => setSuccessData(null)} />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <TransactionFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          description={addDescription} setDescription={setAddDescription}
          amount={addAmount} setAmount={setAddAmount}
          category={addCategory} setCategory={setAddCategory}
          paymentMethod={addPaymentMethod} setPaymentMethod={setAddPaymentMethod}
        />
      )}

      {/* Edit Modal */}
      <UpdateTransactionModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdate}
      />

    </DashboardLayout>
  );
};

export default Transactions;