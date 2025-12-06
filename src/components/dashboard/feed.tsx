import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronDown } from 'lucide-react';
import { feedItems } from '@/lib/data';
import Link from 'next/link';

const languageColors: { [key: string]: string } = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  HTML: 'bg-orange-500',
};

export function Feed() {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="text-base font-semibold">Feed</CardTitle>
        <Link href="#" className="text-xs text-blue-400 hover:underline">
          Trending repositories · See more
        </Link>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {feedItems.map((item, index) => (
          <Card key={index} className="bg-[#161b22] border-[#30363d]">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Link href="#" className="font-semibold hover:underline">
                  {item.repoName}
                </Link>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-7 rounded-md border-[#30363d] px-2 text-xs">
                    <Star className="mr-1 h-3 w-3" />
                    Star
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-[#30363d]">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-sm text-gray-400 pt-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <span className={`h-3 w-3 rounded-full ${languageColors[item.language] || 'bg-gray-500'}`}></span>
                        <span>{item.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{item.stars}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
