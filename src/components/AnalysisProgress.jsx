import React from 'react';
import { Progress } from '@/components/ui/progress';

const AnalysisProgress = ({ analyzed, total }) => {
  const percentage = (analyzed / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Analysis Progress</span>
        <span>{analyzed} / {total} games analyzed</span>
      </div>
      <Progress value={percentage} className="w-full" />
    </div>
  );
};

export default AnalysisProgress;
