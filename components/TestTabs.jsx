'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Play, Lock } from 'lucide-react';

export default function TestTabs({ testSeries, onStartTest }) {
  const [activeTab, setActiveTab] = useState('mock');

  const getTabTests = (tabType) => {
    return testSeries.test_tabs?.filter(tab => tab.type === tabType) || [];
  };

  const renderTestCard = (test, tabType) => (
    <Card key={test.id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{test.title}</CardTitle>
          {test.is_free ? (
            <Badge className="bg-green-100 text-green-800">Free</Badge>
          ) : (
            <Lock className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {test.duration} min
            </span>
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {test.questions} questions
            </span>
          </div>
          
          <Button 
            className="w-full" 
            variant={test.is_free ? "default" : "outline"}
            onClick={() => onStartTest(test.id)}
            disabled={!test.is_free && !testSeries.is_purchased}
          >
            {test.is_free ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Test
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                {testSeries.is_purchased ? 'Start Test' : 'Purchase Required'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mock">Mock Tests</TabsTrigger>
          <TabsTrigger value="pyq">Previous Year</TabsTrigger>
          <TabsTrigger value="booster">Booster</TabsTrigger>
          <TabsTrigger value="sectional">Sectional</TabsTrigger>
        </TabsList>

        <TabsContent value="mock" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mock Tests</h3>
              <p className="text-gray-600">
                Full-length mock tests simulating actual exam conditions with time limits and real exam patterns.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTabTests('mock').map(test => renderTestCard(test, 'mock'))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pyq" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Previous Year Questions</h3>
              <p className="text-gray-600">
                Authentic previous year questions from actual exams with detailed explanations and solutions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTabTests('pyq').map(test => renderTestCard(test, 'pyq'))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="booster" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booster Tests</h3>
              <p className="text-gray-600">
                Topic-wise practice tests designed to strengthen your concepts and improve weak areas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTabTests('booster').map(test => renderTestCard(test, 'booster'))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sectional" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sectional Tests</h3>
              <p className="text-gray-600">
                Subject-wise sectional tests for focused practice and subject mastery.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTabTests('sectional').map(test => renderTestCard(test, 'sectional'))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}