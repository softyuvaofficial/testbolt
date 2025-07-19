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
import { Checkbox } from '@/components/ui/checkbox';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Edit, Trash2, BookOpen, Eye, DollarSign } from 'lucide-react';

export default function AdminTestSeries() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [testSeries, setTestSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testTabs, setTestTabs] = useState([]);
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    categoryId: '',
    difficulty: 'medium',
    duration: 180,
    totalQuestions: 90,
    price: 0,
    isFree: true,
    selectedTabs: []
  });

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      setTestSeries([
        {
          id: 1,
          title: 'JEE Main Complete Test Series 2024',
          description: 'Comprehensive test series for JEE Main preparation',
          category: { id: 1, name: 'Engineering' },
          difficulty: 'high',
          duration: 180,
          totalQuestions: 90,
          price: 299,
          isFree: false,
          isActive: true,
          enrolledStudents: 1250,
          testTabs: ['Mock Test', 'Previous Year', 'Booster'],
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'NEET Biology Practice Tests',
          description: 'Focused biology practice for NEET aspirants',
          category: { id: 2, name: 'Medical' },
          difficulty: 'medium',
          duration: 120,
          totalQuestions: 45,
          price: 0,
          isFree: true,
          isActive: true,
          enrolledStudents: 890,
          testTabs: ['Practice Test', 'Sectional'],
          createdAt: '2024-01-02'
        },
        {
          id: 3,
          title: 'Banking PO Complete Package',
          description: 'All-in-one package for banking PO exams',
          category: { id: 3, name: 'Banking' },
          difficulty: 'medium',
          duration: 90,
          totalQuestions: 50,
          price: 199,
          isFree: false,
          isActive: true,
          enrolledStudents: 567,
          testTabs: ['Mock Test', 'Sectional', 'Speed Test'],
          createdAt: '2024-01-03'
        }
      ]);

      setCategories([
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'Medical' },
        { id: 3, name: 'Banking' },
        { id: 4, name: 'Civil Services' }
      ]);

      setTestTabs([
        { id: 1, name: 'Mock Test', type: 'mock' },
        { id: 2, name: 'Previous Year', type: 'pyq' },
        { id: 3, name: 'Booster', type: 'booster' },
        { id: 4, name: 'Sectional', type: 'sectional' },
        { id: 5, name: 'Speed Test', type: 'speed' },
        { id: 6, name: 'Practice Test', type: 'practice' }
      ]);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleAddTest = () => {
    if (newTest.title.trim() && newTest.categoryId) {
      const test = {
        id: Date.now(),
        title: newTest.title,
        description: newTest.description,
        category: categories.find(c => c.id === parseInt(newTest.categoryId)),
        difficulty: newTest.difficulty,
        duration: parseInt(newTest.duration),
        totalQuestions: parseInt(newTest.totalQuestions),
        price: newTest.isFree ? 0 : parseInt(newTest.price),
        isFree: newTest.isFree,
        isActive: true,
        enrolledStudents: 0,
        testTabs: newTest.selectedTabs.map(id => testTabs.find(t => t.id === id)?.name).filter(Boolean),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTestSeries([...testSeries, test]);
      setNewTest({
        title: '',
        description: '',
        categoryId: '',
        difficulty: 'medium',
        duration: 180,
        totalQuestions: 90,
        price: 0,
        isFree: true,
        selectedTabs: []
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
      price: test.price,
      isFree: test.isFree,
      selectedTabs: testTabs.filter(tab => test.testTabs.includes(tab.name)).map(tab => tab.id)
    });
  };

  const handleUpdateTest = () => {
    if (editingTest && newTest.title.trim() && newTest.categoryId) {
      setTestSeries(testSeries.map(test => 
        test.id === editingTest.id 
          ? {
              ...test,
              title: newTest.title,
              description: newTest.description,
              category: categories.find(c => c.id === parseInt(newTest.categoryId)),
              difficulty: newTest.difficulty,
              duration: parseInt(newTest.duration),
              totalQuestions: parseInt(newTest.totalQuestions),
              price: newTest.isFree ? 0 : parseInt(newTest.price),
              isFree: newTest.isFree,
              testTabs: newTest.selectedTabs.map(id => testTabs.find(t => t.id === id)?.name).filter(Boolean)
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
        price: 0,
        isFree: true,
        selectedTabs: []
      });
    }
  };

  const handleDeleteTest = (testId) => {
    if (confirm('Are you sure you want to delete this test series?')) {
      setTestSeries(testSeries.filter(test => test.id !== testId));
    }
  };

  const toggleTestStatus = (testId) => {
    setTestSeries(testSeries.map(test => 
      test.id === testId ? { ...test, isActive: !test.isActive } : test
    ));
  };

  const handleTabSelection = (tabId) => {
    setNewTest(prev => ({
      ...prev,
      selectedTabs: prev.selectedTabs.includes(tabId)
        ? prev.selectedTabs.filter(id => id !== tabId)
        : [...prev.selectedTabs, tabId]
    }));
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
              <h1 className="text-2xl font-bold text-gray-900">Test Series Management</h1>
              <p className="text-gray-600">Create and manage test series</p>
            </div>
            <Dialog open={isAddingTest} onOpenChange={setIsAddingTest}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Series
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Test Series</DialogTitle>
                  <DialogDescription>Create a new test series with tabs and pricing</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testTitle">Test Series Title</Label>
                      <Input
                        id="testTitle"
                        value={newTest.title}
                        onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                        placeholder="Enter test series title"
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
                      placeholder="Enter test series description"
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

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFree"
                        checked={newTest.isFree}
                        onCheckedChange={(checked) => setNewTest({ ...newTest, isFree: checked })}
                      />
                      <Label htmlFor="isFree">Free Test Series</Label>
                    </div>
                    
                    {!newTest.isFree && (
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newTest.price}
                          onChange={(e) => setNewTest({ ...newTest, price: e.target.value })}
                          placeholder="Enter price"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Select Test Tabs</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {testTabs.map(tab => (
                        <div key={tab.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tab-${tab.id}`}
                            checked={newTest.selectedTabs.includes(tab.id)}
                            onCheckedChange={() => handleTabSelection(tab.id)}
                          />
                          <Label htmlFor={`tab-${tab.id}`} className="text-sm">{tab.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingTest(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTest}>Add Test Series</Button>
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
                    <p className="text-sm text-gray-600">Total Test Series</p>
                    <p className="text-2xl font-bold text-gray-900">{testSeries.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Series</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {testSeries.filter(test => test.isActive).length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {testSeries.reduce((sum, test) => sum + test.enrolledStudents, 0)}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{testSeries.reduce((sum, test) => sum + (test.price * test.enrolledStudents), 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Series List */}
          <Card>
            <CardHeader>
              <CardTitle>All Test Series</CardTitle>
              <CardDescription>Manage your test series collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testSeries.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-900">{test.title}</h3>
                        <Badge className={test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {test.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {test.isFree ? (
                          <Badge className="bg-blue-100 text-blue-800">Free</Badge>
                        ) : (
                          <Badge className="bg-purple-100 text-purple-800">₹{test.price}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>{test.category.name}</span>
                        <span>{test.duration} min</span>
                        <span>{test.totalQuestions} questions</span>
                        <span>{test.enrolledStudents} enrolled</span>
                        <span>Tabs: {test.testTabs.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTestStatus(test.id)}
                      >
                        {test.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
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
                <DialogTitle>Edit Test Series</DialogTitle>
                <DialogDescription>Update test series information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editTestTitle">Test Series Title</Label>
                    <Input
                      id="editTestTitle"
                      value={newTest.title}
                      onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      placeholder="Enter test series title"
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
                    placeholder="Enter test series description"
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

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editIsFree"
                      checked={newTest.isFree}
                      onCheckedChange={(checked) => setNewTest({ ...newTest, isFree: checked })}
                    />
                    <Label htmlFor="editIsFree">Free Test Series</Label>
                  </div>
                  
                  {!newTest.isFree && (
                    <div>
                      <Label htmlFor="editPrice">Price (₹)</Label>
                      <Input
                        id="editPrice"
                        type="number"
                        value={newTest.price}
                        onChange={(e) => setNewTest({ ...newTest, price: e.target.value })}
                        placeholder="Enter price"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Select Test Tabs</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {testTabs.map(tab => (
                      <div key={tab.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-tab-${tab.id}`}
                          checked={newTest.selectedTabs.includes(tab.id)}
                          onCheckedChange={() => handleTabSelection(tab.id)}
                        />
                        <Label htmlFor={`edit-tab-${tab.id}`} className="text-sm">{tab.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingTest(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateTest}>Update Test Series</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}