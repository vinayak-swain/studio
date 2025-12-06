import Link from 'next/link';
import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeedItemProps {
  item: {
    id: number;
    user: string;
    userAvatarUrl: string;
    action: string;
    repo: string;
    time: string;
    title: string;
    details: string;
  };
}

export const FeedItem: FC<FeedItemProps> = ({ item }) => {
  return (
    <Card className="border-border/60 bg-card/50 transition-colors hover:border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.userAvatarUrl} alt={`${item.user} avatar`} data-ai-hint="user avatar" />
            <AvatarFallback>{item.user.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <span className="font-semibold text-foreground">{item.user}</span>
            <span className="text-muted-foreground"> {item.action} in </span>
            <Link href="#" className="font-semibold text-foreground hover:text-primary hover:underline">
              {item.repo}
            </Link>
            <span className="text-muted-foreground"> • {item.time}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-14">
        <h3 className="font-semibold text-foreground">{item.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.details}</p>
      </CardContent>
    </Card>
  );
};
