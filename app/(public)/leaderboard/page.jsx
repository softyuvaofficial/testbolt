'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    // Demo leaderboard data
    setLeaderboardData([
      {
        id: 1,
        name: "Rahul Sharma",
        score: 2850,
        tests: 45,
        accuracy: 92,
        category: "Engineering",
        avatar: "RS",
        streak: 15,
        rank: 1
      },
      {
        id: 2,
        name: "Priya Singh",
        score: 2720,
        tests: 38,
        accuracy: 89,
        category: "Medical",
        avatar: "PS",
        streak: 12,
        rank: 2
      },
      {
        id: 3,
        name: "Amit Kumar",
        score: 2680,
        tests: 42,
        accuracy: 87,
        category: "Banking",
        avatar: "AK",
        streak: 18,
        rank: 3
      },
      {
        id: 4,
        name: "Sneha Patel",
        score: 2590,
        tests: 35,
        accuracy: 91,
        category: "Civil Services",
        avatar: "SP",
        streak: 8,
        rank: 4
      },
      {
        id: 5,
        name: "Vikash Gupta",
        score: 2540,
        tests: 40,
        accuracy: 85,
        category: "Engineering",
        avatar: "VG",
        streak: 10,
        rank: 5
      },
      {
        id: 6,
        name: "Anita Verma",
        score: 2480,
        tests: 33,
        accuracy: 88,
        category: "Medical",
        avatar: "AV",
        streak: 14,
        rank: 6
      },
      {
        id: 7,
        name: "Rohit Jain",
        score: 2420,
        tests: 37,
        accuracy: 84,
        category: "Banking",
        avatar: "RJ",
        streak: 6,
        rank: 7
      },
      {
        id: 8,
        name: "Kavya Reddy",
        score: 2380,
        tests: 31,
        accuracy: 90,
        category: "Civil Services",
        avatar: "KR",
        streak: 11,
        rank: 8
      },
      {
        id: 9,
        name: "Suresh Yadav",
        score: 2340,
        tests: 39,
        accuracy: 82,
        category: "Government",
        avatar: "SY",
        streak: 7,
        rank: 9
      },
      {
        id: 10,
        name: "Meera Shah",
        score: 2290,
        tests: 29,
        accuracy: 86,
        category: "Management",
        avatar: "MS",
        streak: 9,
        rank: 10
      }
    ]);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
            <p className="text-xl text-purple-100">
              See how you rank against other students nationwide
            </p>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">50,000+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,200+</div>
                <div className="text-sm text-gray-600">Tests Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Rankings</h2>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                  <SelectItem value="civil-services">Civil Services</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overall" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
            </TabsList>

            <TabsContent value="overall">
              <div className="space-y-4">
                {/* Top 3 Special Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {leaderboardData.slice(0, 3).map((student, index) => (
                    <Card key={student.id} className={`${index === 0 ? 'ring-2 ring-yellow-400' : ''} hover:shadow-lg transition-shadow`}>
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          {getRankIcon(student.rank)}
                        </div>
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <span className="text-xl font-bold text-gray-700">{student.avatar}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{student.name}</h3>
                        <Badge className={getRankBadgeColor(student.rank)}>
                          {student.category}
                        </Badge>
                        <div className="mt-4 space-y-2">
                          <div className="text-2xl font-bold text-blue-600">{student.score}</div>
                          <div className="text-sm text-gray-600">Total Score</div>
                          <div className="flex justify-center space-x-4 text-xs text-gray-500">
                            <span>{student.tests} tests</span>
                            <span>{student.accuracy}% accuracy</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Remaining Rankings */}
                <div className="space-y-3">
                  {leaderboardData.slice(3).map((student) => (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12">
                              {getRankIcon(student.rank)}
                            </div>
                            <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-700">{student.avatar}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {student.category}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {student.streak} day streak
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">{student.score}</div>
                            <div className="text-sm text-gray-500">{student.tests} tests • {student.accuracy}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Weekly Rankings</h3>
                <p className="text-gray-600">Weekly leaderboard will be updated every Monday</p>
              </div>
            </TabsContent>

            <TabsContent value="category">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering</CardTitle>
                    <CardDescription>Top performers in engineering category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboardData.filter(s => s.category === 'Engineering').slice(0, 5).map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">{student.avatar}</span>
                            </div>
                            <span className="text-sm font-medium">{student.name}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{student.score}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Medical</CardTitle>
                    <CardDescription>Top performers in medical category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboardData.filter(s => s.category === 'Medical').slice(0, 5).map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">{student.avatar}</span>
                            </div>
                            <span className="text-sm font-medium">{student.name}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{student.score}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}