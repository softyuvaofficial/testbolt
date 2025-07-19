'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSidebar from '@/components/AdminSidebar';
import Pagination from '@/components/Pagination';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { usePagination } from '@/hooks/usePagination';
import { Users, Search, Filter, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminUsersManagement() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedUsers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredUsers, 10);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo users data
      const demoUsers = [];
      for (let i = 1; i <= 50; i++) {
        demoUsers.push({
          id: i,
          fullName: `User ${i}`,
          email: `user${i}@example.com`,
          phone: `+91 98765${String(i).padStart(5, '0')}`,
          role: i <= 5 ? 'admin' : 'user',
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          joinedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
          lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          testsAttempted: Math.floor(Math.random() * 50),
          totalScore: Math.floor(Math.random() * 5000),
          subscriptions: Math.floor(Math.random() * 5)
        });
      }
      setUsers(demoUsers);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleUserStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(user => user.status === 'active').length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(user => user.role === 'admin').length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(user => {
                        const joinDate = new Date(user.joinedAt);
                        const now = new Date();
                        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {user.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                            {user.role}
                          </Badge>
                          <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Joined: {formatDate(user.joinedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <div className="font-medium">{user.testsAttempted} tests</div>
                        <div className="text-gray-500">{user.totalScore} points</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserStatusToggle(user.id)}
                        className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                      >
                        {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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

          {/* User Details Dialog */}
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>View and manage user information</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {selectedUser.fullName}</div>
                        <div><strong>Email:</strong> {selectedUser.email}</div>
                        <div><strong>Phone:</strong> {selectedUser.phone}</div>
                        <div><strong>Role:</strong> 
                          <Select 
                            value={selectedUser.role} 
                            onValueChange={(value) => handleRoleChange(selectedUser.id, value)}
                          >
                            <SelectTrigger className="w-32 ml-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Account Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Joined:</strong> {formatDate(selectedUser.joinedAt)}</div>
                        <div><strong>Last Login:</strong> {formatDate(selectedUser.lastLogin)}</div>
                        <div><strong>Tests Attempted:</strong> {selectedUser.testsAttempted}</div>
                        <div><strong>Total Score:</strong> {selectedUser.totalScore}</div>
                        <div><strong>Subscriptions:</strong> {selectedUser.subscriptions}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSelectedUser(null)}>
                      Close
                    </Button>
                    <Button 
                      onClick={() => handleUserStatusToggle(selectedUser.id)}
                      className={selectedUser.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                    >
                      {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                    </Button>
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