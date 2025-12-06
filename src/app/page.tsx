import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';

export default function HeroPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#070B12] to-[#050509] pattern-bg">
      <div className="absolute inset-0 z-0">
        <div className="glow-effect" />
      </div>

      <header className="fixed top-0 z-20 flex h-20 w-full items-center justify-between px-6 md:px-12 lg:px-20 backdrop-blur-sm bg-black/10">
        <Link href="#" className="flex items-center gap-3 text-lg font-semibold text-white">
          <Logo className="h-7 w-7" />
          <span>Nebula</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider text-gray-400">
          <Link href="#" className="hover:text-white hover:underline-offset-4 hover:underline transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-white hover:underline-offset-4 hover:underline transition-colors">Resources</Link>
          <Link href="#" className="hover:text-white hover:underline-offset-4 hover:underline transition-colors">Community</Link>
          <Link href="#" className="hover:text-white hover:underline-offset-4 hover:underline transition-colors">Download</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <Github className="h-4 w-4" />
            Star Us
          </Link>
          <Button variant="ghost" className="rounded-full text-white hover:bg-white/10">Sign In</Button>
          <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black">
            Sign Up
          </Button>
        </div>
      </header>

      <div className="relative z-10 grid max-w-7xl grid-cols-1 gap-12 px-6 pt-24 md:grid-cols-2 md:px-12 lg:px-20">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Everything App
            <br />
            for your teams
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-400 md:text-xl">
            Nebula, an open-source platform, serves as an all-in-one replacement of Linear, Jira, Slack, and Notion.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group relative rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-8 py-6 text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition-transform duration-300 hover:-translate-y-1"
            >
              See in action
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-gray-500">No credit card required</p>
          </div>
        </div>

        <div className="relative hidden h-full items-center justify-center md:flex">
          <div className="absolute w-[2px] h-[500px] bg-gradient-to-b from-transparent via-blue-400 to-transparent">
             <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
