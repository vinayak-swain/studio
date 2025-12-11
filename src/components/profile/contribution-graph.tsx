'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ContributionDay = {
  date: string;
  count: number;
};

type ContributionGraphProps = {
  contributionDays: ContributionDay[];
};

export function ContributionGraph({ contributionDays }: ContributionGraphProps) {
  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 1) return 'bg-green-900';
    if (count <= 3) return 'bg-green-700';
    if (count <= 5) return 'bg-green-500';
    return 'bg-green-300';
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1">
        {contributionDays.map((day, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`h-3 w-3 rounded-sm ${getContributionColor(day.count)}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {day.count} contribution{day.count !== 1 ? 's' : ''} on{' '}
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
