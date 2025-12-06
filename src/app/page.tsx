import { LeftSidebar } from '@/components/dashboard/left-sidebar';
import { RightSidebar } from '@/components/dashboard/right-sidebar';
import { PromptCard } from '@/components/dashboard/prompt-card';
import { Feed } from '@/components/dashboard/feed';
import { Button } from '@/components/ui/button';
import { AlertCircle, FilePlus, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto max-w-screen-2xl">
      <div className="grid grid-cols-1 items-start gap-8 p-4 md:p-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_300px]">
        <aside className="hidden lg:block">
          <LeftSidebar />
        </aside>

        <section className="flex flex-col gap-6">
          <h1 className="text-2xl font-medium tracking-tight">Home</h1>
          <PromptCard />
          <div className="flex items-center gap-2">
            <Button variant="outline" className="transition-colors hover:bg-accent/50 hover:text-accent-foreground">
              <FilePlus className="mr-2 h-4 w-4" />
              Task
            </Button>
            <Button variant="outline" className="transition-colors hover:bg-accent/50 hover:text-accent-foreground">
              <AlertCircle className="mr-2 h-4 w-4" /> Create issue
            </Button>
            <Button variant="outline" className="transition-colors hover:bg-accent/50 hover:text-accent-foreground">
              <Sparkles className="mr-2 h-4 w-4" /> Spark
            </Button>
          </div>
          <Feed />
        </section>

        <aside className="hidden xl:block">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}
