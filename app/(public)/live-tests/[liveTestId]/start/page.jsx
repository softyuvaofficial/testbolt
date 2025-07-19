'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Clock, Users, Trophy, ChevronLeft, ChevronRight, Save, Flag } from 'lucide-react';

export default function LiveTestStart({ params }) {
  const { liveTestId } = params;
  const { user } = useUserAuth();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [liveRankings, setLiveRankings] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  const handleSubmitTest = useCallback(() => {
    document.exitFullscreen?.();
    router.push(`/live-tests/${liveTestId}/result`);
  }, [router, liveTestId]);

  useEffect(() => {
    if (!user) {
      router.push('/user-login');
      return;
    }

    const demoTest = {
      id: parseInt(liveTestId),
      title: "JEE Main Live Mock Test 2024",
      duration: 180,
      totalQuestions: 90
    };

    const demoQuestions = Array.from({ length: 90 }, (_, i) => ({
      id: i + 1,
      question_number: i + 1,
      question_text: `Live Test Question ${i + 1}: What is the correct answer for this physics/chemistry/mathematics problem?`,
      option_a: "Option A - First choice",
      option_b: "Option B - Second choice",
      option_c: "Option C - Third choice",
      option_d: "Option D - Fourth choice",
      correct_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      subject: i < 30 ? 'Physics' : i < 60 ? 'Chemistry' : 'Mathematics'
    }));

    setTest(demoTest);
    setQuestions(demoQuestions);
    setTimeRemaining(180 * 60);
    setParticipantCount(2500 + Math.floor(Math.random() * 100));

    const rankings = Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Student ${i + 1}`,
      score: 300 - (i * 10) + Math.floor(Math.random() * 20),
      answered: 45 + Math.floor(Math.random() * 20)
    }));

    setLiveRankings(rankings);
    setCurrentRank(Math.floor(Math.random() * 500) + 1);
    document.documentElement.requestFullscreen?.();
  }, [user, router, liveTestId]);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && answers[currentQuestion.id]) {
      setSelectedAnswer(answers[currentQuestion.id]);
    } else {
      setSelectedAnswer('');
    }
  }, [currentQuestionIndex, questions, answers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const rankingTimer = setInterval(() => {
      setLiveRankings(prev => prev.map(student => ({
        ...student,
        score: student.score + Math.floor(Math.random() * 8) - 2,
        answered: Math.min(90, student.answered + Math.floor(Math.random() * 3))
      })).sort((a, b) => b.score - a.score).map((student, index) => ({
        ...student,
        rank: index + 1
      })));

      setCurrentRank(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(rankingTimer);
    };
  }, [handleSubmitTest]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer) => setSelectedAnswer(answer);

  const handleSaveAndNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && selectedAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedAnswer }));
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setMarkedQuestions(prev => prev.includes(currentQuestion.id)
      ? prev.filter(id => id !== currentQuestion.id)
      : [...prev, currentQuestion.id]
    );
  };

  if (!questions.length) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="test-fullscreen bg-white">
      <div className="bg-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-lg font-bold">{test?.title}</h1>
          <Badge className="bg-red-500 animate-pulse">🔴 LIVE</Badge>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{participantCount.toLocaleString()} online</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Rank #{currentRank}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-mono">{formatTime(timeRemaining)}</span>
          </div>
          <Button variant="destructive" onClick={handleSubmitTest}>Submit Test</Button>
        </div>
      </div>
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 p-6 overflow-y-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                  <Badge variant="outline">{currentQuestion.subject}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkForReview}
                  className={markedQuestions.includes(currentQuestion.id) ? 'bg-yellow-100 border-yellow-400' : ''}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {markedQuestions.includes(currentQuestion.id) ? 'Marked' : 'Mark'}
                </Button>
              </div>
              <h2 className="text-xl font-semibold mb-6">{currentQuestion.question_text}</h2>
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map(option => {
                  const optionText = currentQuestion[`option_${option.toLowerCase()}`];
                  return (
                    <div
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAnswer === option ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300'
                        }`}>{selectedAnswer === option && '✓'}</div>
                        <span className="font-medium">{option}.</span>
                        <span>{optionText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  const currentQuestion = questions[currentQuestionIndex];
                  if (currentQuestion && selectedAnswer) {
                    setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedAnswer }));
                  }
                }}
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button onClick={handleSaveAndNext} className="bg-red-600 hover:bg-red-700">
                {currentQuestionIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next'}
                {currentQuestionIndex < questions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-80 bg-gray-50 border-l p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" /> Live Rankings
          </h3>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Your Current Rank: #{currentRank}</strong><br />Answered: {answeredCount}/90
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            {liveRankings.map(student => (
              <div key={student.rank} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    student.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    student.rank === 2 ? 'bg-gray-100 text-gray-800' :
                    student.rank === 3 ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>{student.rank}</div>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.answered} answered</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{student.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Questions</h4>
            <div className="grid grid-cols-6 gap-2">
              {questions.map((_, index) => {
                const question = questions[index];
                const isAnswered = answers[question.id];
                const isMarked = markedQuestions.includes(question.id);
                const isCurrent = index === currentQuestionIndex;
                let bgColor = 'bg-gray-200';
                if (isCurrent) bgColor = 'bg-red-500 text-white';
                else if (isAnswered && isMarked) bgColor = 'bg-purple-500 text-white';
                else if (isAnswered) bgColor = 'bg-green-500 text-white';
                else if (isMarked) bgColor = 'bg-yellow-500 text-white';
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded text-xs font-medium ${bgColor} hover:opacity-80`}
                  >{index + 1}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
