
import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mcpServers } from '@/lib/mcp-data';
import {
  Container,
  Search,
  ChevronDown,
  Star,
} from 'lucide-react';

function McpRegistryContent() {
  return (
    <div className="w-full bg-gradient-to-b from-gray-900 to-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
            <Container className="h-12 w-12 text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Connect models to the real world
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            MCP (Model Connection Point) is a standardized way for generative
            models to interface with external tools and services.
          </p>
          <div className="relative mt-8 w-full max-w-lg">
            <Input
              placeholder="Search MCPs"
              className="h-12 rounded-full border-border bg-card/50 py-3 pl-6 pr-20 text-base"
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-teal-500 text-white hover:bg-teal-600"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Content Section */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              All MCP servers
            </h2>
            <Badge variant="secondary" className="text-sm">
              {mcpServers.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mcpServers.map((server, index) => (
              <Card
                key={index}
                className="flex flex-col justify-between border-border bg-card transition-all hover:border-blue-500/50 hover:shadow-lg"
              >
                <div>
                  <CardHeader className="flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <server.icon className="h-6 w-6 text-teal-400" />
                      </div>
                      <CardTitle className="text-lg">{server.name}</CardTitle>
                    </div>
                    <Button className="shrink-0 bg-teal-500 text-white hover:bg-teal-600">
                      Install <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {server.description}
                    </p>
                  </CardContent>
                </div>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>By {server.author}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{server.stars}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function McpRegistryPage() {
  return (
    <DashboardLayout>
      <McpRegistryContent />
    </DashboardLayout>
  );
}
