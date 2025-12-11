import { PlaceHolderImages } from './placeholder-images';
import { Star, Bot, AppWindow, Zap } from 'lucide-react';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const repositories = [
  {
    owner: 'shadcn',
    name: 'ui',
    avatar: findImage('repo-avatar-1'),
  },
  {
    owner: 'vercel',
    name: 'next.js',
    avatar: findImage('repo-avatar-2'),
  },
  {
    owner: 'facebook',
    name: 'react',
    avatar: findImage('repo-avatar-3'),
  },
  {
    owner: 'tailwindlabs',
    name: 'tailwindcss',
    avatar: findImage('repo-avatar-4'),
  },
  {
    owner: 'openai',
    name: 'gpt-3',
    avatar: findImage('repo-avatar-5'),
  },
    {
    owner: 'google',
    name: 'gemini',
    avatar: findImage('repo-avatar-6'),
  }
];

export const feedItems = [
  {
    repoName: 'movie-web/movie-web',
    description: 'A sleek and modern web application for streaming movies and TV shows.',
    language: 'TypeScript',
    stars: '21.4k',
  },
  {
    repoName: 'twentyhq/twenty',
    description: 'A modern CRM that organizes your customer data and streamlines your sales process.',
    language: 'TypeScript',
    stars: '10.1k',
  },
    {
    repoName: 'open-webui/open-webui',
    description: 'User-friendly WebUI for LLMs. Supports major instruction-following models and features.',
    language: 'JavaScript',
    stars: '15.2k',
  }
];

export const changelogItems = [
  {
    date: 'June 2, 2024',
    title: 'GitHub Actions: New features for enterprise readiness',
  },
  {
    date: 'May 28, 2024',
    title: 'Code scanning now supports Ruby 3.3.0',
  },
  {
    date: 'May 23, 2024',
    title: 'Dependabot now surface alerts for vulnerable GitHub Actions',
  },
];

export const templateCards = [
    {
        icon: 'react',
        title: 'React',
        author: 'GitHub',
        description: 'A classic create-react-app template with a simple folder structure.',
    },
    {
        icon: 'nextjs',
        title: 'Next.js',
        author: 'Vercel',
        description: 'A feature-rich template for Next.js applications with pre-configured settings.',
    },
    {
        icon: 'blank',
        title: 'Blank',
        author: 'GitHub',
        description: 'A completely empty template for starting a project from scratch.',
    },
    {
        icon: 'express',
        title: 'Express',
        author: 'Community',
        description: 'A minimal Express.js template for building back-end applications.',
    }
]

export const marketplaceCategories = [
    { name: 'Featured', icon: Star, active: false },
    { name: 'Models', icon: Bot, active: true },
    { name: 'Apps', icon: AppWindow, active: false },
    { name: 'Actions', icon: Zap, active: false },
]

export const marketplaceItems = [
    {
        icon: Bot,
        title: 'Code Pilot',
        author: 'Nebula',
        description: 'AI-powered code completion and suggestions to boost your productivity.',
        type: 'Model',
    },
    {
        icon: Bot,
        title: 'ImageGen',
        author: 'Artifex',
        description: 'Generate stunning visuals and marketing assets with a simple text prompt.',
        type: 'Model',
    },
    {
        icon: AppWindow,
        title: 'DeployMaster',
        author: 'ShipIt',
        description: 'Seamlessly deploy your applications to any cloud provider with one click.',
        type: 'App',
    },
    {
        icon: AppWindow,
        title: 'TaskBoard',
        author: 'Productiv',
        description: 'A collaborative task management tool that integrates with your repositories.',
        type: 'App',
    }
]

export const popularRepositories = [
  {
    name: 'movie-web',
    description: 'A sleek and modern web application for streaming movies and TV shows.',
    language: 'TypeScript',
    languageColor: 'bg-blue-500',
  },
  {
    name: 'twenty',
    description: 'A modern CRM that organizes your customer data and streamlines your sales process.',
    language: 'TypeScript',
    languageColor: 'bg-blue-500',
  },
];

export const contributionData = {
  totalContributions: 4,
  contributionDays: [
    { date: '2025-11-30', count: 0 }, { date: '2025-12-01', count: 2 }, { date: '2025-12-02', count: 0 },
    { date: '2025-12-03', count: 0 }, { date: '2025-12-04', count: 1 }, { date: '2025-12-05', count: 0 },
    { date: '2025-12-06', count: 0 }, { date: '2025-12-07', count: 0 }, { date: '2025-12-08', count: 0 },
    { date: '2025-12-09', count: 0 }, { date: '2025-12-10', count: 1 }, { date: '2025-12-11', count: 0 },
    { date: '2025-12-12', count: 0 }, { date: '2025-12-13', count: 0 }, { date: '2025-12-14', count: 0 },
    { date: '2025-12-15', count: 0 }, { date: '2025-12-16', count: 0 }, { date: '2025-12-17', count: 0 },
    { date: '2025-12-18', count: 0 }, { date: '2025-12-19', count: 0 }, { date: '2025-12-20', count: 0 },
    { date: '2025-12-21', count: 0 }, { date: '2025-12-22', count: 0 }, { date: '2025-12-23', count: 0 },
    { date: '2025-12-24', count: 0 }, { date: '2025-12-25', count: 0 }, { date: '2025-12-26', count: 0 },
    { date: '2025-12-27', count: 0 }, { date: '2025-12-28', count: 0 }, { date: '2025-12-29', count: 0 },
    { date: '2025-12-30', count: 0 }, { date: '2025-12-31', count: 0 },
  ],
};
    
