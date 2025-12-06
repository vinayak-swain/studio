import { PlaceHolderImages } from './placeholder-images';

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
