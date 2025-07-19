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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSidebar from '@/components/AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Search, Filter, Eye, Trash2, Save } from 'lucide-react';

export default function AdminCreateTest() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [testDetails, setTestDetails] = useState({
    title: '',
    description: '',
    categoryId: '',
    difficulty: 'medium',
    duration: 180,
    instructions: '',
    tabId: ''
  });
  const [testTabs, setTestTabs] = useState([]);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      const demoQuestions = [];
      for (let i = 1; i <= 100; i++) {
        demoQuestions.push({
          id: i,
          questionText: `Question ${i}: What is the correct answer for this ${i <= 30 ? 'Physics' : i <= 60 ? 'Chemistry' : 'Mathematics'} problem?`,
          optionA: `Option A for question ${i}`,
          optionB: `Option B for question ${i}`,
          optionC: `Option C for question ${i}`,
          optionD: `Option D for question ${i}`,
          correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
          category: { id: 1, name: 'Engineering' },
          subject: i <= 30 ? 'Physics' : i <= 60 ? 'Chemistry' : 'Mathematics',
          topic: `Topic ${Math.floor(i / 10) + 1}`,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
          usageCount: Math.floor(Math.random() * 20)
        });
      }
      setQuestions(demoQuestions);

      setCategories([
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'Medical' },
        { id: 3, name: 'Banking' },
        { id: 4, name: 'Civil Services' }
      ]);

      setSubjects(['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Reasoning']);
      
      setTestTabs([
        { id: 1, name: 'Mock Test', type: 'mock' },
        { id: 2, name: 'Previous Year', type: 'pyq' },
        { id: 3, name: 'Booster', type: 'booster' },
        { id: 4, name: 'Sectional', type: 'sectional' },
        { id: 5, name: 'Speed Test', type: 'speed' }
      ]);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || question.category.id.toString() === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesSubject && matchesDifficulty;
  });

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
  };

  const handleAutoSelect = (count, difficulty = null, subject = null) => {
    let availableQuestions = filteredQuestions;
    
    if (difficulty) {
      availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
    }
    
    if (subject) {
      availableQuestions = availableQuestions.filter(q => q.subject === subject);
    }
    
    const randomQuestions = availableQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map(q => q.id);
    
    setSelectedQuestions(prev => [...new Set([...prev, ...randomQuestions])]);
  };

  const handleCreateTest = () => {
    if (!testDetails.title.trim() || !testDetails.categoryId || selectedQuestions.length === 0) {
      alert('Please fill all required fields and select at least one question');
      return;
    }

    const newTest = {
      id: Date.now(),
      title: testDetails.title,
      description: testDetails.description,
      category: categories.find(c => c.id === parseInt(testDetails.categoryId)),
      difficulty: testDetails.difficulty,
      duration: parseInt(testDetails.duration),
      totalQuestions: selectedQuestions.length,
      instructions: testDetails.instructions,
      tab: testTabs.find(t => t.id === parseInt(testDetails.tabId)),
      questions: selectedQuestions.map(id => questions.find(q => q.id === id)),
      createdAt: new Date().toISOString()
    };

    console.log('Test created:', newTest);
    alert('Test created successfully!');
    
    // Reset form
    setTestDetails({
      title: '',
      description: '',
      categoryId: '',
      difficulty: 'medium',
      duration: 180,
      instructions: '',
      tabId: ''
    });
    setSelectedQuestions([]);
  };

  const removeSelectedQuestion = (questionId) => {
    setSelectedQuestions(prev => prev.filter(id => id !== questionId));
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
              <h1 className="text-2xl font-bold text-gray-900">Create Test</h1>
              <p className="text-gray-600">Create tests by selecting questions from the question bank</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                {selectedQuestions.length} questions selected
              </Badge>
              <Button onClick={handleCreateTest} disabled={selectedQuestions.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Test Configuration */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Test Configuration</CardTitle>
                  <CardDescription>Set up your test details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="testTitle">Test Title *</Label>
                    <Input
                      id="testTitle"
                      value={testDetails.title}
                      onChange={(e) => setTestDetails({ ...testDetails, title: e.target.value })}
                      placeholder="Enter test title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="testDescription">Description</Label>
                    <Textarea
                      id="testDescription"
                      value={testDetails.description}
                      onChange={(e) => setTestDetails({ ...testDetails, description: e.target.value })}
                      placeholder="Enter test description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testCategory">Category *</Label>
                      <Select value={testDetails.categoryId} onValueChange={(value) => setTestDetails({ ...testDetails, categoryId: value })}>
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

                    <div>
                      <Label htmlFor="testTab">Test Tab</Label>
                      <Select value={testDetails.tabId} onValueChange={(value) => setTestDetails({ ...testDetails, tabId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tab" />
                        </SelectTrigger>
                        <SelectContent>
                          {testTabs.map(tab => (
                            <SelectItem key={tab.id} value={tab.id.toString()}>
                              {tab.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testDifficulty">Difficulty</Label>
                      <Select value={testDetails.difficulty} onValueChange={(value) => setTestDetails({ ...testDetails, difficulty: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="testDuration">Duration (min)</Label>
                      <Input
                        id="testDuration"
                        type="number"
                        value={testDetails.duration}
                        onChange={(e) => setTestDetails({ ...testDetails, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="testInstructions">Instructions</Label>
                    <Textarea
                      id="testInstructions"
                      value={testDetails.instructions}
                      onChange={(e) => setTestDetails({ ...testDetails, instructions: e.target.value })}
                      placeholder="Enter test instructions"
                      rows={3}
                    />
                  </div>

                  {/* Auto Selection Tools */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Quick Selection</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutoSelect(30, null, 'Physics')}
                        className="w-full"
                      >
                        Add 30 Physics Questions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutoSelect(30, null, 'Chemistry')}
                        className="w-full"
                      >
                        Add 30 Chemistry Questions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutoSelect(30, null, 'Mathematics')}
                        className="w-full"
                      >
                        Add 30 Math Questions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutoSelect(20, 'easy')}
                        className="w-full"
                      >
                        Add 20 Easy Questions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Selection */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="select" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="select">Select Questions</TabsTrigger>
                  <TabsTrigger value="selected">Selected Questions ({selectedQuestions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="select">
                  <Card>
                    <CardHeader>
                      <CardTitle>Question Bank</CardTitle>
                      <CardDescription>Select questions from the question bank</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Subjects" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Difficulties" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Difficulties</SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Select All */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="selectAll"
                            checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                          <Label htmlFor="selectAll">
                            Select All ({filteredQuestions.length} questions)
                          </Label>
                        </div>
                        <Badge variant="outline">
                          {selectedQuestions.length} selected
                        </Badge>
                      </div>

                      {/* Questions List */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredQuestions.slice(0, 20).map((question) => (
                          <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={selectedQuestions.includes(question.id)}
                                onCheckedChange={() => handleQuestionSelect(question.id)}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-2">{question.questionText}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                  <Badge variant="outline">{question.subject}</Badge>
                                  <Badge className={
                                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {question.difficulty}
                                  </Badge>
                                  <span className="text-gray-500">Used {question.usageCount} times</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {filteredQuestions.length > 20 && (
                        <div className="text-center mt-4">
                          <p className="text-sm text-gray-500">
                            Showing 20 of {filteredQuestions.length} questions. Use filters to narrow down.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="selected">
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Questions</CardTitle>
                      <CardDescription>Review and manage selected questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedQuestions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No questions selected yet</p>
                          <p>Go to &quot;Select Questions&quot; tab to add questions</p>

                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedQuestions.map((questionId, index) => {
                            const question = questions.find(q => q.id === questionId);
                            if (!question) return null;
                            
                            return (
                              <div key={questionId} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Badge variant="outline">Q{index + 1}</Badge>
                                      <Badge variant="outline">{question.subject}</Badge>
                                      <Badge className={
                                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }>
                                        {question.difficulty}
                                      </Badge>
                                    </div>
                                    <p className="font-medium text-gray-900">{question.questionText}</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSelectedQuestion(questionId)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}