'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useTest } from '@/contexts/TestContext';
import { Trophy, Target, Clock, BookOpen, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestResult({ params }) {
  const { testId } = params;
  const { user } = useUserAuth();
  const { currentTest, questions, answers, testStartTime, dispatch } = useTest();
  const router = useRouter();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/user-login');
      return;
    }

    // Calculate results
    setTimeout(() => {
      const totalQuestions = questions.length;
      const attemptedQuestions = Object.keys(answers).length;
      let correctAnswers = 0;
      let incorrectAnswers = 0;

      // Calculate correct/incorrect answers (demo calculation)
      Object.entries(answers).forEach(([questionId, userAnswer]) => {
        const question = questions.find(q => q.id === parseInt(questionId));
        if (question && question.correct_answer === userAnswer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      });

      const unattempted = totalQuestions - attemptedQuestions;
      const score = (correctAnswers * 4) - (incorrectAnswers * 1); // +4 for correct, -1 for incorrect
      const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);
      const accuracy = attemptedQuestions > 0 ? ((correctAnswers / attemptedQuestions) * 100).toFixed(1) : 0;

      // Demo rank calculation
      const rank = Math.floor(Math.random() * 1000) + 1;
      const totalParticipants = 5000;

      const calculatedResult = {
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        incorrectAnswers,
        unattempted,
        score,
        percentage: parseFloat(percentage),
        accuracy: parseFloat(accuracy),
        rank,
        totalParticipants,
        timeTaken: testStartTime ? Math.floor((new Date() - new Date(testStartTime)) / 1000 / 60) : 180,
        subjectWise: {
          Physics: { correct: Math.floor(correctAnswers * 0.4), total: 30, percentage: 75 },
          Chemistry: { correct: Math.floor(correctAnswers * 0.3), total: 30, percentage: 68 },
          Mathematics: { correct: Math.floor(correctAnswers * 0.3), total: 30, percentage: 82 }
        }
      };

      setResult(calculatedResult);
      setLoading(false);
    }, 1500);
  }, [user, router, questions, answers, testStartTime]);

  const handleViewSolutions = () => {
    // Navigate to solutions page (to be implemented)
    alert('Solutions page will be implemented');
  };

  const handleRetakeTest = () => {
    dispatch({ type: 'RESET_TEST' });
    router.push(`/${testId}/instructions`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculating Results...</h2>
            <p className="text-gray-600">Please wait while we process your answers</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Result not found</h1>
            <Button onClick={() => router.push('/test-series')}>
              Back to Test Series
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 80) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 60) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const performanceBadge = getPerformanceBadge(result.percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Result Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                <Trophy className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Test Completed!</h1>
            <p className="text-xl text-blue-100 mb-6">{currentTest?.title}</p>
            <Badge className={`${performanceBadge.color} text-lg px-4 py-2`}>
              {performanceBadge.text}
            </Badge>
          </div>
        </div>
      </section>

      {/* Score Overview */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getPerformanceColor(result.percentage)} mb-2`}>
                  {result.score}
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
                <div className="text-xs text-gray-500 mt-1">
                  out of {result.totalQuestions * 4}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getPerformanceColor(result.percentage)} mb-2`}>
                  {result.percentage}%
                </div>
                <div className="text-sm text-gray-600">Percentage</div>
                <Progress value={result.percentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  #{result.rank}
                </div>
                <div className="text-sm text-gray-600">Your Rank</div>
                <div className="text-xs text-gray-500 mt-1">
                  out of {result.totalParticipants}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {result.accuracy}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.correctAnswers}/{result.attemptedQuestions} correct
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Analysis */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subject-wise">Subject Analysis</TabsTrigger>
              <TabsTrigger value="question-wise">Question Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>Your overall test performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">Correct Answers</span>
                      </div>
                      <span className="font-bold text-green-600">{result.correctAnswers}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">Incorrect Answers</span>
                      </div>
                      <span className="font-bold text-red-600">{result.incorrectAnswers}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">Unattempted</span>
                      </div>
                      <span className="font-bold text-gray-600">{result.unattempted}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">Time Taken</span>
                      </div>
                      <span className="font-bold text-blue-600">{result.timeTaken} min</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>Areas to focus on for improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Strengths</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Good performance in Mathematics</li>
                          <li>• Strong conceptual understanding</li>
                          <li>• Efficient time management</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">Areas for Improvement</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Focus more on Chemistry concepts</li>
                          <li>• Practice more Physics numericals</li>
                          <li>• Attempt all questions to maximize score</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subject-wise">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(result.subjectWise).map(([subject, data]) => (
                  <Card key={subject}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {subject}
                        <Badge className={getPerformanceBadge(data.percentage).color}>
                          {data.percentage}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getPerformanceColor(data.percentage)}`}>
                            {data.correct}/{data.total}
                          </div>
                          <div className="text-sm text-gray-600">Correct Answers</div>
                        </div>
                        
                        <Progress value={data.percentage} className="h-2" />
                        
                        <div className="text-xs text-gray-500 text-center">
                          Score: {(data.correct * 4) - ((data.total - data.correct) * 1)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="question-wise">
              <Card>
                <CardHeader>
                  <CardTitle>Question-wise Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of each question</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {questions.slice(0, 10).map((question, index) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = userAnswer === question.correct_answer;
                      const isAttempted = !!userAnswer;
                      
                      return (
                        <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              !isAttempted ? 'bg-gray-200 text-gray-600' :
                              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Question {index + 1}
                              </div>
                              <div className="text-sm text-gray-600">{question.subject}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="text-gray-600">Your Answer: </span>
                              <span className={isAttempted ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}>
                                {userAnswer || 'Not Attempted'}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Correct: </span>
                              <span className="text-green-600">{question.correct_answer}</span>
                            </div>
                            {isAttempted && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                isCorrect ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {isCorrect ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-white" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {questions.length > 10 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={handleViewSolutions}>
                        View All Questions & Solutions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleViewSolutions} className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="h-4 w-4 mr-2" />
              View Solutions
            </Button>
            <Button variant="outline" onClick={handleRetakeTest}>
              <Target className="h-4 w-4 mr-2" />
              Retake Test
            </Button>
            <Button variant="outline" onClick={() => router.push('/test-series')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              More Tests
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}