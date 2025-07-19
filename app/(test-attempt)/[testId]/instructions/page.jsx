'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useTest } from '@/contexts/TestContext';
import { Clock, BookOpen, AlertTriangle, CheckCircle, Globe, Volume2 } from 'lucide-react';

export default function TestInstructions({ params }) {
  const { testId } = params;
  const { user } = useUserAuth();
  const { dispatch } = useTest();
  const router = useRouter();
  
  const [test, setTest] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/user-login');
      return;
    }

    // Load test details
    setTimeout(() => {
      const demoTest = {
        id: parseInt(testId),
        title: "JEE Main Mock Test 1",
        description: "Comprehensive mock test for JEE Main preparation",
        duration: 180,
        total_questions: 90,
        category: "Engineering",
        difficulty: "high",
        instructions: [
          "This test contains 90 questions divided into three sections: Physics (30), Chemistry (30), and Mathematics (30).",
          "Each question carries 4 marks for correct answer and -1 mark for incorrect answer.",
          "There is no negative marking for unanswered questions.",
          "You can navigate between questions using the question palette on the right side.",
          "You can mark questions for review and come back to them later.",
          "The test will auto-submit when the time limit is reached.",
          "Make sure you have a stable internet connection throughout the test.",
          "Do not refresh the browser or navigate away from the test page.",
          "Calculator and rough sheets are not allowed for this test.",
          "Click 'Start Test' when you are ready to begin."
        ],
        sections: [
          { name: "Physics", questions: 30, marks: 120 },
          { name: "Chemistry", questions: 30, marks: 120 },
          { name: "Mathematics", questions: 30, marks: 120 }
        ],
        languages: [
          { code: 'english', name: 'English' },
          { code: 'hindi', name: 'हिंदी' }
        ]
      };
      setTest(demoTest);
      setLoading(false);
    }, 1000);
  }, [testId, user, router]);

  const handleStartTest = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before starting the test.');
      return;
    }

    // Set test data in context
    dispatch({ type: 'SET_TEST', payload: test });
    dispatch({ type: 'START_TEST', payload: { duration: test.duration } });
    
    // Navigate to test page
    router.push(`/${testId}/start`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test instructions...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test not found</h1>
          <Button onClick={() => router.push('/test-series')}>
            Back to Test Series
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-600">Test Instructions</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {test.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Test Instructions
                </CardTitle>
                <CardDescription>
                  Please read all instructions carefully before starting the test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {test.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <p className="text-gray-700 text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Test Structure</CardTitle>
                <CardDescription>
                  This test is divided into the following sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {test.sections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{section.name}</h3>
                        <p className="text-sm text-gray-600">{section.questions} questions</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{section.marks}</div>
                        <div className="text-sm text-gray-500">marks</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Language Selection
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for the test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {test.languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={setAgreedToTerms}
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </label>
                    <p className="text-xs text-gray-600">
                      By checking this box, I confirm that I have read and understood all the test instructions 
                      and agree to follow the test guidelines. I understand that any violation may result in 
                      disqualification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Test Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{test.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{test.total_questions}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Marks</span>
                  <span className="font-medium">{test.total_questions * 4}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Difficulty</span>
                  <Badge className={test.difficulty === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {test.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Make sure you have a stable internet connection. 
                The test will auto-save your progress, but avoid refreshing the page.
              </AlertDescription>
            </Alert>

            {/* System Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Internet Connection</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Browser Compatibility</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Audio Support</span>
                  <Volume2 className="h-4 w-4 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Start Test Button */}
            <Button 
              onClick={handleStartTest}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={!agreedToTerms}
            >
              Start Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}