
import { DashboardLayout } from '@/components/repository/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { feedItems } from '@/lib/data';
import { Star, GitBranch } from 'lucide-react';
import Link from 'next/link';

const languageColors: { [key: string]: string } = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  HTML: 'bg-orange-500',
};

function ExplorePageContent() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Explore</h1>
        <p className="mt-2 text-muted-foreground">
          Discover interesting projects and developers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedItems.map((item, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href="#" className="hover:underline">
                    {item.repoName}
                  </Link>
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        languageColors[item.language] || 'bg-gray-500'
                      }`}
                    ></span>
                    <span>{item.language}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{item.stars}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <DashboardLayout>
      <ExplorePageContent />
    </DashboardLayout>
  );
}
