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
import { Trophy, Target, Clock, Users, TrendingUp, Medal, Award, Share2 } from 'lucide-react';

export default function LiveTestResult({ params }) {
  const { liveTestId } = params;
  const { user } = useUserAuth();
  const router = useRouter();
  
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/user-login');
      return;
    }

    // Simulate result calculation
    setTimeout(() => {
      const demoResult = {
        testId: parseInt(liveTestId),
        testTitle: "JEE Main Live Mock Test 2024",
        userId: user.id,
        userName: user.user_metadata?.full_name || 'User',
        totalQuestions: 90,
        attemptedQuestions: 85,
        correctAnswers: 68,
        incorrectAnswers: 17,
        unattempted: 5,
        score: 255, // (68*4) - (17*1)
        percentage: 75.6,
        accuracy: 80.0,
        rank: 42,
        totalParticipants: 2847,
        timeTaken: 165,
        prizeWon: 0,
        subjectWise: {
          Physics: { correct: 22, total: 30, percentage: 73.3 },
          Chemistry: { correct: 20, total: 30, percentage: 66.7 },
          Mathematics: { correct: 26, total: 30, percentage: 86.7 }
        },
        categoryRank: 15,
        stateRank: 8,
        cityRank: 3
      };

      // Generate leaderboard
      const demoLeaderboard = [];
      for (let i = 1; i <= 50; i++) {
        demoLeaderboard.push({
          rank: i,
          name: i === demoResult.rank ? demoResult.userName : `Student ${i}`,
          score: 300 - (i * 2) + Math.floor(Math.random() * 10),
          accuracy: 95 - (i * 0.5) + Math.floor(Math.random() * 5),
          timeTaken: 120 + Math.floor(Math.random() * 60),
          isCurrentUser: i === demoResult.rank
        });
      }

      setResult(demoResult);
      setLeaderboard(demoLeaderboard);
      setLoading(false);
    }, 2000);
  }, [user, router, liveTestId]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

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

  const shareResult = () => {
    const text = `I just completed ${result.testTitle} and ranked #${result.rank} out of ${result.totalParticipants} participants! 🎉\n\nScore: ${result.score}/${result.totalQuestions * 4}\nAccuracy: ${result.accuracy}%\n\nJoin TestYukti for more live tests!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Live Test Result',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Live Test Results...</h2>
            <p className="text-gray-600">Calculating your rank among {2847} participants</p>
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
            <Button onClick={() => router.push('/live-tests')}>
              Back to Live Tests
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const performanceBadge = getPerformanceBadge(result.percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Result Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                {getRankIcon(result.rank)}
              </div>
            </div>
            <Badge className="bg-white text-red-600 mb-4">Live Test Result</Badge>
            <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
            <p className="text-xl text-red-100 mb-2">{result.testTitle}</p>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <span>Rank #{result.rank}</span>
              <span>•</span>
              <span>{result.totalParticipants} participants</span>
              <span>•</span>
              <span>{result.score} points</span>
            </div>
            <div className="mt-6">
              <Badge className={`${performanceBadge.color} text-lg px-4 py-2`}>
                {performanceBadge.text}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getPerformanceColor(result.percentage)} mb-2`}>
                  #{result.rank}
                </div>
                <div className="text-sm text-gray-600">Overall Rank</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getPerformanceColor(result.percentage)} mb-2`}>
                  {result.score}
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getPerformanceColor(result.accuracy)} mb-2`}>
                  {result.accuracy}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {result.timeTaken}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round((result.rank / result.totalParticipants) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Percentile</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Analysis */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="performance" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>Your detailed test performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                        <div className="text-sm text-gray-600">Correct</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{result.incorrectAnswers}</div>
                        <div className="text-sm text-gray-600">Incorrect</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">{result.unattempted}</div>
                        <div className="text-sm text-gray-600">Unattempted</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Overall Performance</span>
                          <span className="text-sm font-medium">{result.percentage}%</span>
                        </div>
                        <Progress value={result.percentage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Accuracy</span>
                          <span className="text-sm font-medium">{result.accuracy}%</span>
                        </div>
                        <Progress value={result.accuracy} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rankings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Rankings</CardTitle>
                    <CardDescription>How you performed across different categories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                        <span className="font-medium">Overall Rank</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">#{result.rank}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Target className="h-6 w-6 text-blue-600" />
                        <span className="font-medium">Category Rank</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">#{result.categoryRank}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-6 w-6 text-green-600" />
                        <span className="font-medium">State Rank</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">#{result.stateRank}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Medal className="h-6 w-6 text-purple-600" />
                        <span className="font-medium">City Rank</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">#{result.cityRank}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle>Live Test Leaderboard</CardTitle>
                  <CardDescription>Top performers in this live test</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.slice(0, 20).map((student) => (
                      <div 
                        key={student.rank} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          student.isCurrentUser ? 'bg-blue-50 border-blue-200' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12">
                            {getRankIcon(student.rank)}
                          </div>
                          <div>
                            <div className={`font-semibold ${student.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                              {student.name} {student.isCurrentUser && '(You)'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {student.accuracy}% accuracy • {student.timeTaken} min
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">{student.score}</div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
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
                          <div className={`text-3xl font-bold ${getPerformanceColor(data.percentage)}`}>
                            {data.correct}/{data.total}
                          </div>
                          <div className="text-sm text-gray-600">Correct Answers</div>
                        </div>
                        
                        <Progress value={data.percentage} className="h-3" />
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            +{data.correct * 4} points
                          </div>
                          <div className="text-sm text-red-600">
                            -{(data.total - data.correct) * 1} penalty
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={shareResult} className="bg-green-600 hover:bg-green-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share Result
            </Button>
            <Button variant="outline" onClick={() => router.push('/live-tests')}>
              <Trophy className="h-4 w-4 mr-2" />
              More Live Tests
            </Button>
            <Button variant="outline" onClick={() => router.push('/test-series')}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Practice Tests
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}