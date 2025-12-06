import { feedItems } from '@/lib/data';
import { FeedItem } from './feed-item';

export function Feed() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold tracking-tight">Feed</h2>
      <div className="flex flex-col gap-4">
        {feedItems.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
