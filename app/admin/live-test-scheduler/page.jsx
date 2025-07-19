'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Edit, Trash2, Calendar, Clock, Users, Trophy } from 'lucide-react';

export default function AdminLiveTestScheduler() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [liveTests, setLiveTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    categoryId: '',
    difficulty: 'medium',
    duration: 180,
    totalQuestions: 90,
    startDateTime: '',
    maxParticipants: 5000,
    prizePool: 0,
    instructions: ''
  });

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      setLiveTests([
        {
          id: 1,
          title: 'JEE Main Live Mock Test 2024',
          description: 'National level live mock test for JEE Main aspirants',
          category: { id: 1, name: 'Engineering' },
          difficulty: 'high',
          duration: 180,
          totalQuestions: 90,
          startDateTime: '2024-01-20T10:00:00',
          maxParticipants: 5000,
          registeredUsers: 2500,
          prizePool: 50000,
          status: 'upcoming',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'NEET Biology Championship',
          description: 'Live biology test with instant ranking',
          category: { id: 2, name: 'Medical' },
          difficulty: 'medium',
          duration: 120,
          totalQuestions: 45,
          startDateTime: '2024-01-18T14:00:00',
          maxParticipants: 3000,
          registeredUsers: 1800,
          prizePool: 25000,
          status: 'live',
          createdAt: '2024-01-02'
        },
        {
          id: 3,
          title: 'Banking Aptitude Challenge',
          description: 'Competitive banking exam preparation',
          category: { id: 3, name: 'Banking' },
          difficulty: 'medium',
          duration: 90,
          totalQuestions: 50,
          startDateTime: '2024-01-15T16:00:00',
          maxParticipants: 2000,
          registeredUsers: 1200,
          prizePool: 15000,
          status: 'completed',
          createdAt: '2024-01-03'
        }
      ]);

      setCategories([
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'Medical' },
        { id: 3, name: 'Banking' },
        { id: 4, name: 'Civil Services' }
      ]);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleAddTest = () => {
    if (newTest.title.trim() && newTest.categoryId && newTest.startDateTime) {
      const test = {
        id: Date.now(),
        title: newTest.title,
        description: newTest.description,
        category: categories.find(c => c.id === parseInt(newTest.categoryId)),
        difficulty: newTest.difficulty,
        duration: parseInt(newTest.duration),
        totalQuestions: parseInt(newTest.totalQuestions),
        startDateTime: newTest.startDateTime,
        maxParticipants: parseInt(newTest.maxParticipants),
        registeredUsers: 0,
        prizePool: parseInt(newTest.prizePool),
        status: 'upcoming',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setLiveTests([...liveTests, test]);
      setNewTest({
        title: '',
        description: '',
        categoryId: '',
        difficulty: 'medium',
        duration: 180,
        totalQuestions: 90,
        startDateTime: '',
        maxParticipants: 5000,
        prizePool: 0,
        instructions: ''
      });
      setIsAddingTest(false);
    }
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setNewTest({
      title: test.title,
      description: test.description,
      categoryId: test.category.id.toString(),
      difficulty: test.difficulty,
      duration: test.duration,
      totalQuestions: test.totalQuestions,
      startDateTime: test.startDateTime,
      maxParticipants: test.maxParticipants,
      prizePool: test.prizePool,
      instructions: test.instructions || ''
    });
  };

  const handleUpdateTest = () => {
    if (editingTest && newTest.title.trim() && newTest.categoryId && newTest.startDateTime) {
      setLiveTests(liveTests.map(test => 
        test.id === editingTest.id 
          ? {
              ...test,
              title: newTest.title,
              description: newTest.description,
              category: categories.find(c => c.id === parseInt(newTest.categoryId)),
              difficulty: newTest.difficulty,
              duration: parseInt(newTest.duration),
              totalQuestions: parseInt(newTest.totalQuestions),
              startDateTime: newTest.startDateTime,
              maxParticipants: parseInt(newTest.maxParticipants),
              prizePool: parseInt(newTest.prizePool)
            }
          : test
      ));
      setEditingTest(null);
      setNewTest({
        title: '',
        description: '',
        categoryId: '',
        difficulty: 'medium',
        duration: 180,
        totalQuestions: 90,
        startDateTime: '',
        maxParticipants: 5000,
        prizePool: 0,
        instructions: ''
      });
    }
  };

  const handleDeleteTest = (testId) => {
    if (confirm('Are you sure you want to delete this live test?')) {
      setLiveTests(liveTests.filter(test => test.id !== testId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
              <h1 className="text-2xl font-bold text-gray-900">Live Test Scheduler</h1>
              <p className="text-gray-600">Schedule and manage live tests</p>
            </div>
            <Dialog open={isAddingTest} onOpenChange={setIsAddingTest}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Live Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Live Test</DialogTitle>
                  <DialogDescription>Create a new live test with real-time participation</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testTitle">Test Title</Label>
                      <Input
                        id="testTitle"
                        value={newTest.title}
                        onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                        placeholder="Enter test title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newTest.categoryId} onValueChange={(value) => setNewTest({ ...newTest, categoryId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTest.description}
                      onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                      placeholder="Enter test description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={newTest.difficulty} onValueChange={(value) => setNewTest({ ...newTest, difficulty: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newTest.duration}
                        onChange={(e) => setNewTest({ ...newTest, duration: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalQuestions">Total Questions</Label>
                      <Input
                        id="totalQuestions"
                        type="number"
                        value={newTest.totalQuestions}
                        onChange={(e) => setNewTest({ ...newTest, totalQuestions: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDateTime">Start Date & Time</Label>
                      <Input
                        id="startDateTime"
                        type="datetime-local"
                        value={newTest.startDateTime}
                        onChange={(e) => setNewTest({ ...newTest, startDateTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={newTest.maxParticipants}
                        onChange={(e) => setNewTest({ ...newTest, maxParticipants: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prizePool">Prize Pool (₹)</Label>
                    <Input
                      id="prizePool"
                      type="number"
                      value={newTest.prizePool}
                      onChange={(e) => setNewTest({ ...newTest, prizePool: e.target.value })}
                      placeholder="Enter prize pool amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={newTest.instructions}
                      onChange={(e) => setNewTest({ ...newTest, instructions: e.target.value })}
                      placeholder="Enter any special instructions for this live test"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingTest(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTest}>Schedule Test</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Live Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{liveTests.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Live Now</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {liveTests.filter(test => test.status === 'live').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {liveTests.reduce((sum, test) => sum + test.registeredUsers, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Prize Pool</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{liveTests.reduce((sum, test) => sum + test.prizePool, 0).toLocaleString()}
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Tests List */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Live Tests</CardTitle>
              <CardDescription>Manage all live tests and their schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-900">{test.title}</h3>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                        <Badge variant="outline">{test.category.name}</Badge>
                        <Badge className={test.difficulty === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {test.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDateTime(test.startDateTime)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {test.duration} min
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {test.registeredUsers}/{test.maxParticipants}
                        </span>
                        <span className="flex items-center">
                          <Trophy className="h-4 w-4 mr-1" />
                          ₹{test.prizePool.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTest(test)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTest(test.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit Test Dialog */}
          <Dialog open={!!editingTest} onOpenChange={() => setEditingTest(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Live Test</DialogTitle>
                <DialogDescription>Update live test information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editTestTitle">Test Title</Label>
                    <Input
                      id="editTestTitle"
                      value={newTest.title}
                      onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      placeholder="Enter test title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCategory">Category</Label>
                    <Select value={newTest.categoryId} onValueChange={(value) => setNewTest({ ...newTest, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={newTest.description}
                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                    placeholder="Enter test description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editDifficulty">Difficulty</Label>
                    <Select value={newTest.difficulty} onValueChange={(value) => setNewTest({ ...newTest, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editDuration">Duration (minutes)</Label>
                    <Input
                      id="editDuration"
                      type="number"
                      value={newTest.duration}
                      onChange={(e) => setNewTest({ ...newTest, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editTotalQuestions">Total Questions</Label>
                    <Input
                      id="editTotalQuestions"
                      type="number"
                      value={newTest.totalQuestions}
                      onChange={(e) => setNewTest({ ...newTest, totalQuestions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editStartDateTime">Start Date & Time</Label>
                    <Input
                      id="editStartDateTime"
                      type="datetime-local"
                      value={newTest.startDateTime}
                      onChange={(e) => setNewTest({ ...newTest, startDateTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editMaxParticipants">Max Participants</Label>
                    <Input
                      id="editMaxParticipants"
                      type="number"
                      value={newTest.maxParticipants}
                      onChange={(e) => setNewTest({ ...newTest, maxParticipants: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editPrizePool">Prize Pool (₹)</Label>
                  <Input
                    id="editPrizePool"
                    type="number"
                    value={newTest.prizePool}
                    onChange={(e) => setNewTest({ ...newTest, prizePool: e.target.value })}
                    placeholder="Enter prize pool amount"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingTest(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTest}>Update Test</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}