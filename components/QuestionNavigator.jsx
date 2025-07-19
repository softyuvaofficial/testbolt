'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function QuestionNavigator({ 
  questions, 
  currentIndex, 
  answers, 
  markedQuestions, 
  onQuestionSelect 
}) {
  const getQuestionStatus = (index) => {
    const question = questions[index];
    if (!question) return 'not-answered';
    
    const isAnswered = answers[question.id];
    const isMarked = markedQuestions.includes(question.id);
    const isCurrent = index === currentIndex;
    
    if (isCurrent) return 'current';
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    return 'not-answered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-blue-500 text-white border-blue-500';
      case 'answered': return 'bg-green-500 text-white border-green-500';
      case 'marked': return 'bg-yellow-500 text-white border-yellow-500';
      case 'answered-marked': return 'bg-purple-500 text-white border-purple-500';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const answeredCount = Object.keys(answers).length;
  const markedCount = markedQuestions.length;
  const notAnsweredCount = questions.length - answeredCount;

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Palette</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Answered ({answeredCount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Marked ({markedCount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Answered & Marked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Not Answered ({notAnsweredCount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Current</span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="question-nav-grid">
        {questions.map((_, index) => {
          const status = getQuestionStatus(index);
          return (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={cn(
                "question-nav-item",
                getStatusColor(status),
                "hover:opacity-80 transition-opacity"
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Questions:</span>
            <Badge variant="outline">{questions.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Answered:</span>
            <Badge className="bg-green-100 text-green-800">{answeredCount}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Not Answered:</span>
            <Badge className="bg-gray-100 text-gray-800">{notAnsweredCount}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Marked for Review:</span>
            <Badge className="bg-yellow-100 text-yellow-800">{markedCount}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}