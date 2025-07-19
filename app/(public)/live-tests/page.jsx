'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, Users, Calendar, Play, Trophy, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function LiveTests() {
  const [liveTests, setLiveTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Demo live tests data
    setLiveTests([
      {
        id: 1,
        title: "JEE Main Live Mock Test 2024",
        description: "National level live mock test for JEE Main aspirants",
        startTime: "2024-01-20T10:00:00Z",
        duration: 180,
        totalQuestions: 90,
        registeredUsers: 2500,
        maxParticipants: 5000,
        category: "Engineering",
        difficulty: "high",
        status: "upcoming",
        prizePool: 50000,
        isLive: false
      },
      {
        id: 2,
        title: "NEET Biology Championship",
        description: "Live biology test with instant ranking and analysis",
        startTime: "2024-01-18T14:00:00Z",
        duration: 120,
        totalQuestions: 45,
        registeredUsers: 1800,
        maxParticipants: 3000,
        category: "Medical",
        difficulty: "medium",
        status: "live",
        prizePool: 25000,
        isLive: true
      },
      {
        id: 3,
        title: "Banking Aptitude Live Challenge",
        description: "Competitive banking exam preparation with live leaderboard",
        startTime: "2024-01-15T16:00:00Z",
        duration: 90,
        totalQuestions: 50,
        registeredUsers: 1200,
        maxParticipants: 2000,
        category: "Banking",
        difficulty: "medium",
        status: "completed",
        prizePool: 15000,
        isLive: false
      },
      {
        id: 4,
        title: "UPSC Prelims Live Test Series",
        description: "Comprehensive UPSC preparation with expert analysis",
        startTime: "2024-01-22T09:00:00Z",
        duration: 150,
        totalQuestions: 100,
        registeredUsers: 3200,
        maxParticipants: 6000,
        category: "Civil Services",
        difficulty: "high",
        status: "upcoming",
        prizePool: 75000,
        isLive: false
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'live': return <Play className="h-4 w-4" />;
      case 'completed': return <Trophy className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTests = liveTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || test.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Live Tests</h1>
            <p className="text-xl text-red-100">
              Compete with thousands of students in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {liveTests.filter(t => t.status === 'live').length}
                </div>
                <div className="text-sm text-gray-600">Live Now</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {liveTests.filter(t => t.status === 'upcoming').length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {liveTests.reduce((sum, test) => sum + test.registeredUsers, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  ₹{liveTests.reduce((sum, test) => sum + test.prizePool, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Prize Pool</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search live tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Tests Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tests</TabsTrigger>
              <TabsTrigger value="live">Live Now</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8">
              {filteredTests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
                  <p className="text-gray-600">Try adjusting your search or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTests.map((test) => (
                    <Card key={test.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{test.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {test.description}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(test.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(test.status)}
                              <span className="capitalize">{test.status}</span>
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Test Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{test.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{test.totalQuestions} questions</span>
                          </div>
                        </div>

                        {/* Start Time */}
                        <div className="text-sm">
                          <span className="text-gray-600">Start Time: </span>
                          <span className="font-medium">{formatDateTime(test.startTime)}</span>
                        </div>

                        {/* Participants */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Registered:</span>
                          <span className="font-medium">
                            {test.registeredUsers.toLocaleString()} / {test.maxParticipants.toLocaleString()}
                          </span>
                        </div>

                        {/* Prize Pool */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Prize Pool:</span>
                          <span className="font-bold text-green-600">₹{test.prizePool.toLocaleString()}</span>
                        </div>

                        {/* Category */}
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {test.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {test.difficulty}
                          </Badge>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          {test.status === 'live' ? (
                            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                              <Link href={`/live-tests/${test.id}/start`}>
                                <Play className="h-4 w-4 mr-2" />
                                Join Live Test
                              </Link>
                            </Button>
                          ) : test.status === 'upcoming' ? (
                            <Button asChild className="w-full">
                              <Link href={`/live-tests/${test.id}/details`}>
                                View Details & Register
                              </Link>
                            </Button>
                          ) : (
                            <Button asChild variant="outline" className="w-full">
                              <Link href={`/live-tests/${test.id}/result`}>
                                <Trophy className="h-4 w-4 mr-2" />
                                View Results
                              </Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}