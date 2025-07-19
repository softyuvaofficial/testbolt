'use client';

import { Button } from '@/components/ui/button';
import { Save, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

export default function SaveNextButton({ 
  onSave, 
  onNext, 
  onPrevious, 
  onMarkForReview,
  canGoNext, 
  canGoPrevious, 
  isLastQuestion,
  isMarked 
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-t">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={onMarkForReview}
          className={isMarked ? 'bg-yellow-100 border-yellow-400' : ''}
        >
          <Flag className="h-4 w-4 mr-1" />
          {isMarked ? 'Marked' : 'Mark for Review'}
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
        >
          {isLastQuestion ? 'Save & Review' : 'Save & Next'}
          {!isLastQuestion && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}