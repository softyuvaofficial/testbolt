'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useTest } from '@/contexts/TestContext';
import { Clock, Flag, ChevronLeft, ChevronRight, Save } from 'lucide-react';

export default function TestStart({ params }) {
  const { testId } = params;
  const { user } = useUserAuth();
  const { currentTest, questions, currentQuestionIndex, answers, markedQuestions, timeRemaining, dispatch } = useTest();
  const router = useRouter();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSubmitTest = useCallback(() => {
    dispatch({ type: 'COMPLETE_TEST' });
    document.exitFullscreen?.();
    router.push(`/${testId}/result`);
  }, [dispatch, router, testId]);

  useEffect(() => {
    if (!user) {
      router.push('/user-login');
      return;
    }

    if (!questions.length) {
      const demoQuestions = [
        {
          id: 1,
          question_number: 1,
          question_text: "What is the acceleration due to gravity on Earth?",
          option_a: "9.8 m/s²",
          option_b: "10.8 m/s²",
          option_c: "8.8 m/s²",
          option_d: "11.8 m/s²",
          correct_answer: "A",
          subject: "Physics",
          topic: "Mechanics"
        },
        {
          id: 2,
          question_number: 2,
          question_text: "Which of the following is a noble gas?",
          option_a: "Oxygen",
          option_b: "Nitrogen",
          option_c: "Helium",
          option_d: "Carbon",
          correct_answer: "C",
          subject: "Chemistry",
          topic: "Periodic Table"
        },
        {
          id: 3,
          question_number: 3,
          question_text: "What is the derivative of x²?",
          option_a: "x",
          option_b: "2x",
          option_c: "x²",
          option_d: "2x²",
          correct_answer: "B",
          subject: "Mathematics",
          topic: "Calculus"
        }
      ];

      const allQuestions = [];
      for (let i = 0; i < 90; i++) {
        const baseQuestion = demoQuestions[i % 3];
        allQuestions.push({
          ...baseQuestion,
          id: i + 1,
          question_number: i + 1,
          question_text: `Question ${i + 1}: ${baseQuestion.question_text}`
        });
      }

      dispatch({ type: 'SET_QUESTIONS', payload: allQuestions });
    }

    const timer = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME' });
    }, 1000);

    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [user, router, questions.length, dispatch, isFullscreen]);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && answers[currentQuestion.id]) {
      setSelectedAnswer(answers[currentQuestion.id]);
    } else {
      setSelectedAnswer('');
    }
  }, [currentQuestionIndex, questions, answers]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, handleSubmitTest]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSaveAndNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && selectedAnswer) {
      dispatch({
        type: 'SAVE_ANSWER',
        payload: { questionId: currentQuestion.id, answer: selectedAnswer }
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: currentQuestionIndex + 1 });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: currentQuestionIndex - 1 });
    }
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      dispatch({ type: 'MARK_QUESTION', payload: currentQuestion.id });
    }
  };

  const handleQuestionNavigation = (index) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: index });
  };

  const getQuestionStatus = (index) => {
    const q = questions[index];
    if (!q) return 'not-answered';
    const isAnswered = answers[q.id];
    const isMarked = markedQuestions.includes(q.id);
    const isCurrent = index === currentQuestionIndex;
    if (isCurrent) return 'current';
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    return 'not-answered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-blue-500 text-white';
      case 'answered': return 'bg-green-500 text-white';
      case 'marked': return 'bg-yellow-500 text-white';
      case 'answered-marked': return 'bg-purple-500 text-white';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedQuestions.length;

  return (
    <div className="test-fullscreen bg-white">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold">{currentTest?.title}</h1>
          <Badge>Q {currentQuestionIndex + 1} / {questions.length}</Badge>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-mono">{formatTime(timeRemaining)}</span>
          </div>
          <Button variant="destructive" onClick={handleSubmitTest}>
            Submit Test
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-6 overflow-y-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="space-x-2">
                  <Badge variant="outline">{currentQuestion?.subject}</Badge>
                  <Badge variant="outline">{currentQuestion?.topic}</Badge>
                </div>
                <Button onClick={handleMarkForReview} size="sm" variant="outline">
                  <Flag className="h-4 w-4 mr-1" />
                  {markedQuestions.includes(currentQuestion?.id) ? 'Marked' : 'Mark for Review'}
                </Button>
              </div>
              <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question_text}</h2>
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleAnswerSelect(opt)}
                    className={`p-4 border-2 rounded-lg cursor-pointer ${selectedAnswer === opt ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 flex items-center justify-center border-2 rounded-full ${selectedAnswer === opt ? 'bg-blue-500 text-white' : 'border-gray-300'}`}>
                        {selectedAnswer === opt && '✓'}
                      </div>
                      <span className="font-medium">{opt}.</span>
                      <span>{currentQuestion[`option_${opt.toLowerCase()}`]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion && selectedAnswer) {
                    dispatch({ type: 'SAVE_ANSWER', payload: { questionId: currentQuestion.id, answer: selectedAnswer } });
                  }
                }}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={handleSaveAndNext}>
                {currentQuestionIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-80 bg-gray-50 p-4 border-l overflow-y-auto">
          <h3 className="font-semibold mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionNavigation(index)}
                className={`w-8 h-8 rounded text-xs ${getStatusColor(getQuestionStatus(index))}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Alert>
              <AlertDescription className="text-sm">Review your answers before submission.</AlertDescription>
            </Alert>
            <Button onClick={handleSubmitTest} className="w-full mt-4 bg-red-600 hover:bg-red-700">
              Submit Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
