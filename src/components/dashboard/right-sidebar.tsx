import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { changelogItems } from '@/lib/data';
import Link from 'next/link';

export function RightSidebar() {
  return (
    <aside className="hidden w-64 flex-col gap-6 lg:flex">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-sm font-semibold">
            Latest from our changelog
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="space-y-4">
            {changelogItems.map((item, index) => (
              <li key={index} className="space-y-1">
                <p className="text-xs text-gray-400">{item.date}</p>
                <Link href="#" className="text-sm font-medium hover:text-blue-400 hover:underline">
                    {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="#" className="mt-4 block text-xs text-blue-400 hover:underline">
            View changelog →
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
