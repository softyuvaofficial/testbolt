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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSidebar from '@/components/AdminSidebar';
import Pagination from '@/components/Pagination';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { usePagination } from '@/hooks/usePagination';
import { Plus, Edit, Trash2, Upload, Download, Search, Filter } from 'lucide-react';

export default function AdminQuestionsBank() {
  const { admin, loading, signOut } = useAdminAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    categoryId: '',
    subject: '',
    topic: '',
    difficulty: 'medium'
  });

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || question.category.id.toString() === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesSubject && matchesDifficulty;
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedQuestions,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredQuestions, 10);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin-login');
      return;
    }

    if (admin) {
      // Load demo data
      const demoQuestions = [];
      for (let i = 1; i <= 50; i++) {
        demoQuestions.push({
          id: i,
          questionText: `Sample question ${i}: What is the correct answer for this ${i <= 20 ? 'Physics' : i <= 35 ? 'Chemistry' : 'Mathematics'} problem?`,
          optionA: `Option A for question ${i}`,
          optionB: `Option B for question ${i}`,
          optionC: `Option C for question ${i}`,
          optionD: `Option D for question ${i}`,
          correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
          explanation: `Detailed explanation for question ${i}`,
          category: { id: 1, name: 'Engineering' },
          subject: i <= 20 ? 'Physics' : i <= 35 ? 'Chemistry' : 'Mathematics',
          topic: `Topic ${Math.floor(i / 10) + 1}`,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
          createdAt: '2024-01-01',
          usageCount: Math.floor(Math.random() * 50)
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
      setTopics(['Mechanics', 'Thermodynamics', 'Optics', 'Organic Chemistry', 'Algebra', 'Calculus']);
    }
  }, [admin, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin-login');
  };

  const handleAddQuestion = () => {
    if (newQuestion.questionText.trim() && newQuestion.categoryId) {
      const question = {
        id: Date.now(),
        questionText: newQuestion.questionText,
        optionA: newQuestion.optionA,
        optionB: newQuestion.optionB,
        optionC: newQuestion.optionC,
        optionD: newQuestion.optionD,
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation,
        category: categories.find(c => c.id === parseInt(newQuestion.categoryId)),
        subject: newQuestion.subject,
        topic: newQuestion.topic,
        difficulty: newQuestion.difficulty,
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      setQuestions([...questions, question]);
      setNewQuestion({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        categoryId: '',
        subject: '',
        topic: '',
        difficulty: 'medium'
      });
      setIsAddingQuestion(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestion({
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      categoryId: question.category.id.toString(),
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty
    });
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion && newQuestion.questionText.trim() && newQuestion.categoryId) {
      setQuestions(questions.map(question => 
        question.id === editingQuestion.id 
          ? {
              ...question,
              questionText: newQuestion.questionText,
              optionA: newQuestion.optionA,
              optionB: newQuestion.optionB,
              optionC: newQuestion.optionC,
              optionD: newQuestion.optionD,
              correctAnswer: newQuestion.correctAnswer,
              explanation: newQuestion.explanation,
              category: categories.find(c => c.id === parseInt(newQuestion.categoryId)),
              subject: newQuestion.subject,
              topic: newQuestion.topic,
              difficulty: newQuestion.difficulty
            }
          : question
      ));
      setEditingQuestion(null);
      setNewQuestion({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        categoryId: '',
        subject: '',
        topic: '',
        difficulty: 'medium'
      });
    }
  };

  const handleDeleteQuestion = (questionId) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(question => question.id !== questionId));
    }
  };

  const handleBulkUpload = () => {
    alert('Bulk upload feature will be implemented with CSV/Excel file support');
  };

  const handleExportQuestions = () => {
    alert('Export questions feature will be implemented');
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
              <h1 className="text-2xl font-bold text-gray-900">Questions Bank</h1>
              <p className="text-gray-600">Manage your question repository</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleBulkUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
              <Button variant="outline" onClick={handleExportQuestions}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>Create a new question for the question bank</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <Label htmlFor="questionText">Question Text</Label>
                      <Textarea
                        id="questionText"
                        value={newQuestion.questionText}
                        onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                        placeholder="Enter the question text"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="optionA">Option A</Label>
                        <Input
                          id="optionA"
                          value={newQuestion.optionA}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                          placeholder="Enter option A"
                        />
                      </div>
                      <div>
                        <Label htmlFor="optionB">Option B</Label>
                        <Input
                          id="optionB"
                          value={newQuestion.optionB}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                          placeholder="Enter option B"
                        />
                      </div>
                      <div>
                        <Label htmlFor="optionC">Option C</Label>
                        <Input
                          id="optionC"
                          value={newQuestion.optionC}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                          placeholder="Enter option C"
                        />
                      </div>
                      <div>
                        <Label htmlFor="optionD">Option D</Label>
                        <Input
                          id="optionD"
                          value={newQuestion.optionD}
                          onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                          placeholder="Enter option D"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="correctAnswer">Correct Answer</Label>
                        <Select value={newQuestion.correctAnswer} onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Option A</SelectItem>
                            <SelectItem value="B">Option B</SelectItem>
                            <SelectItem value="C">Option C</SelectItem>
                            <SelectItem value="D">Option D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newQuestion.categoryId} onValueChange={(value) => setNewQuestion({ ...newQuestion, categoryId: value })}>
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
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion({ ...newQuestion, subject: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}>
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
                    </div>

                    <div>
                      <Label htmlFor="topic">Topic (Optional)</Label>
                      <Input
                        id="topic"
                        value={newQuestion.topic}
                        onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                        placeholder="Enter topic"
                      />
                    </div>

                    <div>
                      <Label htmlFor="explanation">Explanation</Label>
                      <Textarea
                        id="explanation"
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                        placeholder="Enter detailed explanation"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddQuestion}>Add Question</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                  </div>
                  <Plus className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subjects</p>
                    <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
                  </div>
                  <Plus className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Usage Count</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {questions.reduce((sum, q) => sum + q.usageCount, 0)}
                    </p>
                  </div>
                  <Plus className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card>
            <CardHeader>
              <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
              <CardDescription>Manage your question collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedQuestions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{question.questionText}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div><strong>A:</strong> {question.optionA}</div>
                          <div><strong>B:</strong> {question.optionB}</div>
                          <div><strong>C:</strong> {question.optionC}</div>
                          <div><strong>D:</strong> {question.optionD}</div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge className="bg-green-100 text-green-800">
                            Correct: {question.correctAnswer}
                          </Badge>
                          <Badge variant="outline">{question.category.name}</Badge>
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
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {question.explanation && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
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

          {/* Edit Question Dialog */}
          <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Question</DialogTitle>
                <DialogDescription>Update question information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="editQuestionText">Question Text</Label>
                  <Textarea
                    id="editQuestionText"
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                    placeholder="Enter the question text"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editOptionA">Option A</Label>
                    <Input
                      id="editOptionA"
                      value={newQuestion.optionA}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                      placeholder="Enter option A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editOptionB">Option B</Label>
                    <Input
                      id="editOptionB"
                      value={newQuestion.optionB}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                      placeholder="Enter option B"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editOptionC">Option C</Label>
                    <Input
                      id="editOptionC"
                      value={newQuestion.optionC}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                      placeholder="Enter option C"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editOptionD">Option D</Label>
                    <Input
                      id="editOptionD"
                      value={newQuestion.optionD}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                      placeholder="Enter option D"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="editCorrectAnswer">Correct Answer</Label>
                    <Select value={newQuestion.correctAnswer} onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editCategory">Category</Label>
                    <Select value={newQuestion.categoryId} onValueChange={(value) => setNewQuestion({ ...newQuestion, categoryId: value })}>
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
                    <Label htmlFor="editSubject">Subject</Label>
                    <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion({ ...newQuestion, subject: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editDifficulty">Difficulty</Label>
                    <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}>
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
                </div>

                <div>
                  <Label htmlFor="editTopic">Topic (Optional)</Label>
                  <Input
                    id="editTopic"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    placeholder="Enter topic"
                  />
                </div>

                <div>
                  <Label htmlFor="editExplanation">Explanation</Label>
                  <Textarea
                    id="editExplanation"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    placeholder="Enter detailed explanation"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateQuestion}>Update Question</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}