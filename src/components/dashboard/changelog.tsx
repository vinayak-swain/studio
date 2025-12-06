import Link from 'next/link';
import { changelogItems } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export function Changelog() {
  return (
    <Card className="border-border/60 bg-card/50 transition-colors hover:border-primary/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Latest from our changelog
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {changelogItems.map((item, index) => (
          <div key={item.id} className="relative flex gap-4">
            {index < changelogItems.length - 1 && (
              <div className="absolute left-2.5 top-5 h-full w-px bg-border" />
            )}
            <div className="relative h-min">
              <div className="h-5 w-5 rounded-full border-2 border-primary/50 bg-background" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">{item.date}</p>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        <Link href="#" className="group mt-2 flex items-center gap-2 text-sm font-medium text-primary">
          View changelog
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
