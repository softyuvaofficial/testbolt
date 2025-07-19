'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSidebar from '@/components/AdminSidebar';
import Pagination from '@/components/Pagination';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { usePagination } from '@/hooks/usePagination';
import { CreditCard, Search, Download, Eye, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function AdminTransactions() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          matchesPeriod = transactionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = transactionDate >= weekAgo;
          break;
        case 'month':
          matchesPeriod = transactionDate.getMonth() === now.getMonth() && 
                         transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedTransactions,
    goToPage
  } = usePagination(filteredTransactions, 15);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo transactions data
      const demoTransactions = [];
      const statuses = ['completed', 'pending', 'failed', 'refunded'];
      const testSeries = ['JEE Main Complete Series', 'NEET Biology Practice', 'Banking PO Package', 'UPSC Prelims Series'];
      
      for (let i = 1; i <= 100; i++) {
        const amount = [199, 299, 399, 499, 599][Math.floor(Math.random() * 5)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const testSerie = testSeries[Math.floor(Math.random() * testSeries.length)];
        
        demoTransactions.push({
          id: i,
          orderId: `ORD${String(i).padStart(6, '0')}`,
          paymentId: `PAY${String(i).padStart(8, '0')}`,
          userId: `user_${i}`,
          userName: `User ${i}`,
          userEmail: `user${i}@example.com`,
          testSeriesTitle: testSerie,
          amount: amount,
          currency: 'INR',
          status: status,
          paymentMethod: ['card', 'upi', 'netbanking', 'wallet'][Math.floor(Math.random() * 4)],
          gateway: ['razorpay', 'stripe', 'payu'][Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          completedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null
        });
      }
      setTransactions(demoTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleExportTransactions = () => {
    alert('Export functionality will be implemented with CSV/Excel download');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate stats
  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const todayRevenue = transactions.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.createdAt).toDateString() === today && t.status === 'completed';
  }).reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onSignOut={handleSignOut} />
      
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              <p className="text-gray-600">Monitor payments and revenue</p>
            </div>
            <Button onClick={handleExportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today&apos;s Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(todayRevenue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order ID or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
              <CardDescription>All payment transactions and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{transaction.orderId}</h3>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{transaction.testSeriesTitle}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{transaction.userEmail}</span>
                          <span>{transaction.paymentMethod}</span>
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.gateway}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction Details Dialog */}
          <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>Complete transaction information</DialogDescription>
              </DialogHeader>
              {selectedTransaction && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Transaction Info</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Order ID:</strong> {selectedTransaction.orderId}</div>
                        <div><strong>Payment ID:</strong> {selectedTransaction.paymentId}</div>
                        <div><strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}</div>
                        <div><strong>Currency:</strong> {selectedTransaction.currency}</div>
                        <div><strong>Status:</strong> 
                          <Badge className={`ml-2 ${getStatusColor(selectedTransaction.status)}`}>
                            {selectedTransaction.status}
                          </Badge>
                        </div>
                        <div><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</div>
                        <div><strong>Gateway:</strong> {selectedTransaction.gateway}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Info</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedTransaction.userName}</div>
                        <div><strong>Email:</strong> {selectedTransaction.userEmail}</div>
                        <div><strong>User ID:</strong> {selectedTransaction.userId}</div>
                        <div><strong>Test Series:</strong> {selectedTransaction.testSeriesTitle}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Created:</strong> {formatDate(selectedTransaction.createdAt)}</div>
                      {selectedTransaction.completedAt && (
                        <div><strong>Completed:</strong> {formatDate(selectedTransaction.completedAt)}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                      Close
                    </Button>
                    {selectedTransaction.status === 'completed' && (
                      <Button>
                        Issue Refund
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
