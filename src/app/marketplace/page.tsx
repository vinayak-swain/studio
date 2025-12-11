
'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { marketplaceCategories, marketplaceItems } from '@/lib/data';
import { Search } from 'lucide-react';
import Link from 'next/link';

const AsteroidIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-purple-400">
        <path d="M12.2 2.3a.7.7 0 0 0-.4 0l-4.3 2.5a.7.7 0 0 0-.4.6v5a.7.7 0 0 0 .4.6l4.3 2.5a.7.7 0 0 0 .8 0l4.3-2.5a.7.7 0 0 0 .4-.6v-5a.7.7 0 0 0-.4-.6L12.2 2.3z" />
        <path d="m10 12.5 4.3 2.5" />
        <path d="m10 7.5 4.3 2.5" />
        <path d="M12 2v5" />
        <path d="m14.3 15 4.3 2.5" />
        <path d="M14.3 5 4.3 10" />
        <path d="m5.7 15-1.4 2.5" />
        <path d="M5.7 5 10 2.5" />
        <path d="M12 17.5v5" />
        <path d="m18.3 10 4.3-2.5" />
    </svg>
);


function MarketplacePageContent() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full border-b border-border bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="container mx-auto flex max-w-7xl flex-col items-start px-4 text-left sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Build with the power of the universe
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                The best tools from the developer community to help you build, ship, and secure your software.
              </p>
              <div className="mt-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for apps, actions, and models"
                    className="w-full rounded-md border-border bg-card py-3 pl-12 pr-4 text-lg"
                  />
                </div>
              </div>
            </div>
             <div className="hidden lg:block">
                <AsteroidIcon />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Left Sidebar */}
          <aside className="col-span-1">
            <nav className="flex flex-col space-y-1">
              {marketplaceCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={category.active ? 'secondary' : 'ghost'}
                  className="justify-start rounded-md px-3 py-2 text-sm font-medium"
                >
                  <category.icon className="mr-3 h-5 w-5" />
                  {category.name}
                </Button>
              ))}
            </nav>
            <div className="mt-8">
                <Link href="#" className="text-sm text-blue-500 hover:underline">
                    Create a new extension
                </Link>
            </div>
          </aside>

          {/* Right Content */}
          <main className="col-span-3">
            <div>
              <h2 className="text-2xl font-semibold">Models for your every use case</h2>
              <p className="mt-2 text-muted-foreground">
                Discover models to supercharge your AI-powered applications.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {marketplaceItems.map((item, index) => (
                <Card key={index} className="flex flex-col justify-between transition-all hover:border-blue-500/50 hover:shadow-lg">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <item.icon className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                    <CardDescription>by {item.author}</CardDescription>
                                </div>
                            </div>
                            <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                {item.type}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
    return (
        <DashboardLayout>
            <MarketplacePageContent />
        </DashboardLayout>
    )
}

    