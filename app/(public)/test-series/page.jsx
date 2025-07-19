'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestCard from '@/components/TestCard';
import { Search, Filter, SortAsc } from 'lucide-react';

export default function TestSeries() {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Load demo data
    const demoTests = [
      {
        id: 1,
        title: "🎯 JEE Main Complete Mock Test 2024",
        description: "Master JEE Main with our comprehensive mock test series. Latest pattern questions with detailed solutions and performance analytics.",
        duration: 180,
        total_questions: 90,
        category: { name: "Engineering" },
        difficulty: "high",
        price: 0,
        is_free: true,
        rating: 4.8,
        participants_count: 1250,
        test_tabs: [
          { id: 1, name: "Mock Test" },
          { id: 2, name: "Previous Year" }
        ]
      },
      {
        id: 2,
        title: "🧬 NEET Biology Mastery Series",
        description: "Ace NEET Biology with our expertly crafted practice tests. Detailed explanations and concept-wise analysis included.",
        duration: 120,
        total_questions: 45,
        category: { name: "Medical" },
        difficulty: "medium",
        price: 299,
        is_free: false,
        rating: 4.6,
        participants_count: 890,
        test_tabs: [
          { id: 3, name: "Practice Test" }
        ]
      },
      {
        id: 3,
        title: "🏦 IBPS Bank PO Reasoning Pro",
        description: "Master banking reasoning with our comprehensive practice series. Shortcuts, tricks, and time-saving techniques included.",
        duration: 90,
        total_questions: 50,
        category: { name: "Banking" },
        difficulty: "medium",
        price: 199,
        is_free: false,
        rating: 4.7,
        participants_count: 567,
        test_tabs: [
          { id: 4, name: "Sectional Test" }
        ]
      },
      {
        id: 4,
        title: "🏛️ UPSC Prelims GS Paper 1 Elite",
        description: "Crack UPSC Prelims with our elite General Studies Paper 1 series. Current affairs and comprehensive coverage.",
        duration: 120,
        total_questions: 100,
        category: { name: "Civil Services" },
        difficulty: "high",
        price: 499,
        is_free: false,
        rating: 4.9,
        participants_count: 2300,
        test_tabs: [
          { id: 5, name: "Mock Test" },
          { id: 6, name: "Previous Year" }
        ]
      },
      {
        id: 5,
        title: "📊 SSC CGL Mathematics Champion",
        description: "Excel in SSC CGL Mathematics with our step-by-step solution approach. Perfect for government job aspirants.",
        duration: 60,
        total_questions: 25,
        category: { name: "Government" },
        difficulty: "medium",
        price: 149,
        is_free: false,
        rating: 4.5,
        participants_count: 1890,
        test_tabs: [
          { id: 7, name: "Sectional Test" }
        ]
      },
      {
        id: 6,
        title: "📈 CAT Quantitative Aptitude Pro",
        description: "Master CAT Quant with our advanced test series. Detailed analysis and shortcut techniques for MBA aspirants.",
        duration: 40,
        total_questions: 22,
        category: { name: "Management" },
        difficulty: "high",
        price: 399,
        is_free: false,
        rating: 4.8,
        participants_count: 756,
        test_tabs: [
          { id: 8, name: "Sectional Test" }
        ]
      }
    ];

    setTests(demoTests);
    setFilteredTests(demoTests);

    setCategories([
      { name: "All", value: "all" },
      { name: "Engineering", value: "engineering" },
      { name: "Medical", value: "medical" },
      { name: "Banking", value: "banking" },
      { name: "Civil Services", value: "civil-services" },
      { name: "Government", value: "government" },
      { name: "Management", value: "management" }
    ]);
  }, []);

  useEffect(() => {
    let filtered = tests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(test =>
        test.category.name.toLowerCase() === selectedCategory.replace('-', ' ')
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(test => test.difficulty === selectedDifficulty);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.participants_count - a.participants_count);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredTests(filtered);
  }, [tests, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Series</h1>
            <p className="text-xl text-gray-600">
              Choose from our comprehensive collection of test series
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search test series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Test Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredTests.length} of {tests.length} test series
            </p>
          </div>

          {filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}