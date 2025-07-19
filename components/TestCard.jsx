'use client';

import { Star, Users, BookOpen, Trophy, Zap, Play, ShoppingCart, Award, Target } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TestCard = ({ test }) => {
  const {
    id,
    title,
    description,
    price,
    is_free,
    category,
    difficulty,
    participants_count,
    rating,
    test_tabs
  } = test;

  const difficultyConfig = {
    easy: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🟢' },
    medium: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🟡' },
    hard: { color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    high: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🟣' }
  };

  const currentDifficulty = difficultyConfig[difficulty] || difficultyConfig.medium;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Popular Badge */}
      {participants_count > 1000 && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transform rotate-12 animate-pulse">
            🔥 POPULAR
          </div>
        </div>
      )}

      {/* Free Badge */}
      {is_free && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 text-xs font-bold shadow-lg">
            ✨ FREE
          </Badge>
        </div>
      )}

      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className={`${currentDifficulty.color} border font-medium`}>
              {currentDifficulty.icon} {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{rating}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tab Wise Test Count */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {test_tabs && test_tabs.length > 0 ? (
            test_tabs.map((tab, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-500 rounded-lg p-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-900">{tab.test_count}</div>
                    <div className="text-xs text-blue-600">{tab.name}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-sm text-gray-500">No Test Tabs Available</div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          {is_free ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-pulse" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold mb-1">FREE</div>
                  <div className="text-green-100 text-sm font-medium">🎉 Limited Time Offer!</div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 animate-pulse" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-3xl font-bold">₹{price}</span>
                    <span className="text-blue-200 text-lg line-through">₹{Math.round(price * 1.5)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1">
                      {Math.round(((price * 1.5 - price) / (price * 1.5)) * 100)}% OFF
                    </Badge>
                    <span className="text-blue-100 text-sm">💎 Best Value</span>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-semibold"
              asChild
            >
              <Link href={`/test-series/${id}`}>
                <Target className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </Button>
            
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href={is_free ? `/${id}/instructions` : `#purchase-${id}`}>
                {is_free ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Now
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </>
                )}
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            {!is_free && (
              <>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>30-day guarantee</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
              </>
            )}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Instant access</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Expert solutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500" />
    </div>
  );
};

export default TestCard;
