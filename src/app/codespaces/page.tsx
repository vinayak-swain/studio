'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Code,
  FileText,
  Github,
  Gitlab,
  BookOpen,
  LifeBuoy,
  MessageSquare,
  Plus,
  Container,
} from 'lucide-react';
import Link from 'next/link';
import { templateCards } from '@/lib/data';


function CodespacesPageContent() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-14 left-0 z-20 hidden h-full w-20 flex-col items-center border-r border-border bg-background py-4 md:flex">
        <nav className="flex flex-col items-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-lg bg-accent"
          >
            <Container className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-lg"
          >
            <FileText className="h-6 w-6" />
          </Button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto md:pl-20">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Your instant dev environment
              </h1>
              <p className="mt-2 text-muted-foreground">
                An ephemeral development environment for you and your team.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Go to docs</Button>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                New workspace
              </Button>
            </div>
          </div>

          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Explore quick start templates
              </h2>
              <Link
                href="#"
                className="text-sm text-blue-500 hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {templateCards.map((card, index) => (
                    <Card key={index} className="flex flex-col justify-between transition-all hover:border-blue-500/50 hover:shadow-lg">
                        <div>
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    {
                                        {
                                            react: <Code className="h-6 w-6 text-blue-400" />,
                                            nextjs: <Code className="h-6 w-6 text-blue-400" />,
                                            blank: <FileText className="h-6 w-6 text-gray-400" />,
                                            express: <Code className="h-6 w-6 text-green-400" />,
                                        }[card.icon]
                                    }
                                </div>
                                <CardTitle className="text-base">{card.title}</CardTitle>
                                <CardDescription className="text-xs">By {card.author}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </div>
                        <div className="p-6 pt-0">
                            <Button className="w-full">Use this template</Button>
                        </div>
                    </Card>
                ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="mb-6 text-xl font-semibold">Getting started</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-5 w-5" /> Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn about features, configuration, and advanced options.
                    <Link href="#" className="ml-1 text-blue-500 hover:underline">
                      Learn more
                    </Link>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <LifeBuoy className="h-5 w-5" /> Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get help with any questions or issues from our community.
                    <Link href="#" className="ml-1 text-blue-500 hover:underline">
                      Ask a question
                    </Link>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-5 w-5" /> Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Share your feedback and help us improve the product.
                    <Link href="#" className="ml-1 text-blue-500 hover:underline">
                      Give feedback
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


export default function CodespacesPage() {
  return (
    <DashboardLayout>
      <CodespacesPageContent />
    </DashboardLayout>
  );
}
