'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestCard from '@/components/TestCard';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Link from 'next/link';
import { BookOpen, Users, Trophy, Target, ArrowRight, Star, Clock } from 'lucide-react';

export default function Homepage() {
  const { user } = useUserAuth();
  const [featuredTests, setFeaturedTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [liveTests, setLiveTests] = useState([]);

  useEffect(() => {
    // Load demo data
    setFeaturedTests([
      {
        id: 1,
        title: "JEE Main Mock Test 2024",
        description: "Comprehensive mock test for JEE Main preparation with latest pattern",
        duration: 180,
        total_questions: 90,
        category: { name: "Engineering" },
        difficulty: "high",
        price: 199,
        is_free: false,
        rating: 4.8,
        participants_count: 1250,
        test_tabs: [
          { id: 1, name: "Mock Test" },
          { id: 2, name: "Previous Year" }
        ]
      },
      {
        id: 2,
        title: "NEET Biology Practice Test",
        description: "Focused practice test for NEET biology with detailed explanations",
        duration: 120,
        total_questions: 45,
        category: { name: "Medical" },
        difficulty: "medium",
        price: 0,
        is_free: true,
        rating: 4.6,
        participants_count: 890,
        test_tabs: [
          { id: 3, name: "Practice Test" }
        ]
      },
      {
        id: 3,
        title: "IBPS Bank PO Reasoning",
        description: "Complete reasoning section practice for IBPS PO exam",
        duration: 90,
        total_questions: 50,
        category: { name: "Banking" },
        difficulty: "medium",
        price: 149,
        is_free: false,
        rating: 4.7,
        participants_count: 567,
        test_tabs: [
          { id: 4, name: "Sectional Test" }
        ]
      }
    ]);

    setCategories([
      { id: 1, name: "Engineering", count: 45, icon: "🔧" },
      { id: 2, name: "Medical", count: 38, icon: "🏥" },
      { id: 3, name: "Banking", count: 32, icon: "🏦" },
      { id: 4, name: "Civil Services", count: 28, icon: "🏛️" },
      { id: 5, name: "Teaching", count: 22, icon: "👨‍🏫" },
      { id: 6, name: "Railway", count: 19, icon: "🚂" }
    ]);

    setLiveTests([
      {
        id: 1,
        title: "JEE Main Full Mock Test",
        startTime: "2024-01-15T10:00:00Z",
        duration: 180,
        participants: 2500
      },
      {
        id: 2,
        title: "NEET Physics Challenge",
        startTime: "2024-01-16T14:00:00Z",
        duration: 120,
        participants: 1800
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Master Your <span className="text-yellow-400">Competitive Exams</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in">
              Practice with India&apos;s most comprehensive online test series platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/test-series">
                  Start Practicing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/user-signup">Sign Up Free</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">50,000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">1,200+</div>
              <div className="text-gray-600">Test Series</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">25+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-gray-600 text-lg">Choose from our wide range of exam categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href="/test-series">
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} tests</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tests Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Test Series</h2>
            <p className="text-gray-600 text-lg">Handpicked test series for your exam preparation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/test-series">
                View All Test Series <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Tests Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Live Tests</h2>
            <p className="text-gray-600 text-lg">Join thousands of students in live test sessions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {liveTests.map((test) => (
              <Card key={test.id} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{test.title}</CardTitle>
                    <Badge className="bg-white text-orange-600">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Jan 15, 2024 &bull; 10:00 AM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{test.participants} joined</span>
                      </div>
                    </div>
                    <Button className="w-full bg-white text-orange-600 hover:bg-gray-100">
                      Join Live Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TestYukti?</h2>
            <p className="text-gray-600 text-lg">Everything you need to ace your competitive exams</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Tests</h3>
              <p className="text-gray-600">Latest pattern tests with detailed solutions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Track your progress with advanced analytics</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All India Rank</h3>
              <p className="text-gray-600">Compare your performance nationwide</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">Get guidance from experienced mentors</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
