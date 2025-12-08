'use client';

import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutGrid, Plus, Rocket } from 'lucide-react';
import Image from 'next/image';

function ProjectsPageContent() {
  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Left Sidebar */}
        <aside className="col-span-1">
          <nav className="flex flex-col space-y-1">
            <Button
              variant="secondary"
              className="justify-start rounded-full bg-accent"
            >
              Recently viewed
            </Button>
            <Button variant="ghost" className="justify-start rounded-full">
              Created by me
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-span-3">
          {/* Hero Banner */}
          <div className="relative mb-8 overflow-hidden rounded-lg border bg-card p-8">
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-transparent"
              style={{ mixBlendMode: 'multiply' }}
            ></div>
            <div className="absolute right-0 top-0 -mr-16 -mt-16 opacity-10">
               <Rocket className="h-64 w-64 text-white" strokeWidth={0.5}/>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold">Welcome to projects</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                A new, flexible, and powerful way to plan and track your work,
                right from your repositories.
              </p>
              <Button variant="outline" className="mt-4">
                Learn more
              </Button>
            </div>
          </div>

          {/* Recently Viewed Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Recently viewed</h3>
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full border border-dashed border-border p-4">
                <LayoutGrid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-semibold">
                Create your first GitHub project
              </h4>
              <p className="mt-2 max-w-md text-muted-foreground">
                Projects are a customizable, flexible tool for planning and
                tracking your work.
              </p>
              <Button className="mt-6 bg-green-600 text-white hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                New project
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <ProjectsPageContent />
    </DashboardLayout>
  );
}
