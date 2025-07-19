'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { User, Trophy, Clock, Target, BookOpen, TrendingUp, Calendar, Award } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useUserAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user-login');
      return;
    }

    if (user) {
      // Load user stats and recent tests
      setUserStats({
        totalTests: 45,
        averageScore: 78,
        totalTime: 2340, // minutes
        rank: 1250,
        streak: 7
      });

      setRecentTests([
        {
          id: 1,
          title: "JEE Main Mock Test 1",
          date: "2024-01-10",
          score: 85,
          maxScore: 100,
          duration: 180,
          rank: 245,
          category: "Engineering"
        },
        {
          id: 2,
          title: "NEET Biology Practice",
          date: "2024-01-08",
          score: 72,
          maxScore: 100,
          duration: 120,
          rank: 567,
          category: "Medical"
        },
        {
          id: 3,
          title: "Bank PO Reasoning",
          date: "2024-01-05",
          score: 68,
          maxScore: 100,
          duration: 90,
          rank: 890,
          category: "Banking"
        }
      ]);

      setAchievements([
        { id: 1, title: "First Test Completed", icon: "🎯", date: "2024-01-01" },
        { id: 2, title: "Week Streak", icon: "🔥", date: "2024-01-10" },
        { id: 3, title: "Top 10% Scorer", icon: "🏆", date: "2024-01-12" }
      ]);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Profile Header */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-600 text-white p-4 rounded-full">
              <User className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.user_metadata?.full_name || 'User'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  Rank #{userStats?.rank}
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <Target className="h-3 w-3 mr-1" />
                  {userStats?.streak} day streak
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats?.totalTests}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats?.averageScore}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Study Time</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(userStats?.totalTime / 60)}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Rank</p>
                    <p className="text-2xl font-bold text-gray-900">#{userStats?.rank}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="recent" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">Recent Tests</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Test Results</h2>
                <div className="grid grid-cols-1 gap-6">
                  {recentTests.map((test) => (
                    <Card key={test.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                              <Badge variant="outline">{test.category}</Badge>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {test.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {test.duration} min
                              </span>
                              <span className="flex items-center">
                                <Trophy className="h-4 w-4 mr-1" />
                                Rank #{test.rank}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {test.score}/{test.maxScore}
                            </div>
                            <Progress value={test.score} className="w-24 mt-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{achievement.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600">{achievement.date}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                      <CardDescription>Your performance across different score ranges</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">90-100%</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={20} className="w-32" />
                            <span className="text-sm">20%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">80-89%</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={35} className="w-32" />
                            <span className="text-sm">35%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">70-79%</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={30} className="w-32" />
                            <span className="text-sm">30%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">60-69%</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={15} className="w-32" />
                            <span className="text-sm">15%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subject-wise Performance</CardTitle>
                      <CardDescription>Your strength in different subjects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mathematics</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={85} className="w-32" />
                            <span className="text-sm">85%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Physics</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={78} className="w-32" />
                            <span className="text-sm">78%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Chemistry</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={72} className="w-32" />
                            <span className="text-sm">72%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Biology</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={68} className="w-32" />
                            <span className="text-sm">68%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}