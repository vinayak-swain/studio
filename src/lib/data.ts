import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const repositories = [
  { id: 1, name: 'nebula-design/react', avatarUrl: findImage('repo-avatar-1'), owner: 'nebula-design' },
  { id: 2, name: 'firebase/firebase-ios-sdk', avatarUrl: findImage('repo-avatar-2'), owner: 'firebase' },
  { id: 3, name: 'vercel/next.js', avatarUrl: findImage('repo-avatar-3'), owner: 'vercel' },
  { id: 4, name: 'shadcn/ui', avatarUrl: findImage('repo-avatar-4'), owner: 'shadcn' },
  { id: 5, name: 'genkit-ai/genkit', avatarUrl: findImage('repo-avatar-5'), owner: 'genkit-ai' },
  { id: 6, name: 'tailwindlabs/tailwindcss', avatarUrl: findImage('repo-avatar-6'), owner: 'tailwindlabs' },
];

export const feedItems = [
  {
    id: 1,
    user: 'jaredpalmer',
    userAvatarUrl: findImage('user-avatar-1'),
    action: 'opened a new issue',
    repo: 'vercel/next.js',
    time: '2 hours ago',
    title: '#68420 Bug: `next/image` does not work with `output: "export"`',
    details: 'The new Image component seems to be missing styles when running `next export`. The images are rendered, but they are not styled correctly and cause layout shifts.',
  },
  {
    id: 2,
    user: 'shadcn',
    userAvatarUrl: findImage('user-avatar-2'),
    action: 'pushed a new commit',
    repo: 'shadcn/ui',
    time: '5 hours ago',
    title: 'feat: add new `Card` component variants',
    details: 'This commit introduces `variant="outline"` and `variant="ghost"` for the Card component, providing more flexibility for different UI needs. Also includes updates to documentation.',
  },
  {
    id: 3,
    user: 'leerob',
    userAvatarUrl: findImage('user-avatar-3'),
    action: 'commented on an issue',
    repo: 'vercel/next.js',
    time: '1 day ago',
    title: '#68411 `app/` directory memory leak in development',
    details: 'We are actively investigating this issue and have a potential fix in the works. We appreciate your patience and will provide updates as soon as they are available.',
  },
];

export const changelogItems = [
  {
    id: 1,
    date: 'June 20, 2024',
    title: 'New AI-Powered Prompt',
    description: 'The "Ask anything" prompt is now powered by a generative model to help you find repositories, files, and more.',
  },
  {
    id: 2,
    date: 'June 15, 2024',
    title: 'Dashboard Feed Improvements',
    description: 'Your feed is now more personalized and surfaces the most relevant activity from your repositories.',
  },
  {
    id: 3,
    date: 'June 5, 2024',
    title: 'Dark Mode is now default',
    description: 'We have fully transitioned to our new dark theme. Let us know what you think!',
  },
];
