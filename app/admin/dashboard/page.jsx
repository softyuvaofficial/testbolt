'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load dashboard data
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalUsers: 12450,
            activeTests: 156,
            totalRevenue: 245000,
            testsCompleted: 8920
          },
          recentActivity: [
            { id: 1, type: 'user_signup', message: 'New user registered: john@example.com', time: '2 minutes ago' },
            { id: 2, type: 'test_completed', message: 'Test completed: JEE Main Mock Test 1', time: '5 minutes ago' },
            { id: 3, type: 'payment', message: 'Payment received: ₹199 for Engineering Series', time: '10 minutes ago' },
            { id: 4, type: 'question_added', message: 'New question added to Physics category', time: '15 minutes ago' }
          ],
          popularTests: [
            { id: 1, name: 'JEE Main Mock Test Series', attempts: 2340, revenue: 45000 },
            { id: 2, name: 'NEET Biology Practice', attempts: 1890, revenue: 0 },
            { id: 3, name: 'Bank PO Complete Series', attempts: 1560, revenue: 32000 }
          ],
          monthlyStats: {
            users: [120, 150, 180, 220, 280, 320, 380, 420, 480, 520, 580, 650],
            revenue: [15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000]
          }
        });
      }, 1000);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">System Online</Badge>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats.totalUsers.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Tests</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats.activeTests}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">+5 new this week</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{dashboardData?.stats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+18% from last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tests Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats.testsCompleted.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+25% from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Test Series</CardTitle>
                <CardDescription>Most attempted test series this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.popularTests.map((test, index) => (
                    <div key={test.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{test.name}</p>
                          <p className="text-xs text-gray-500">{test.attempts} attempts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          ₹{test.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registration trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {dashboardData?.monthlyStats.users.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t"
                        style={{ 
                          height: `${(value / Math.max(...dashboardData.monthlyStats.users)) * 200}px`,
                          width: '20px'
                        }}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {dashboardData?.monthlyStats.revenue.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-green-500 rounded-t"
                        style={{ 
                          height: `${(value / Math.max(...dashboardData.monthlyStats.revenue)) * 200}px`,
                          width: '20px'
                        }}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Schedule Live Test</h3>
                  <p className="text-sm text-gray-600">Create and schedule new live tests</p>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <BookOpen className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Add Test Series</h3>
                  <p className="text-sm text-gray-600">Create new test series and categories</p>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Download className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Export Reports</h3>
                  <p className="text-sm text-gray-600">Download analytics and user reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}