import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const repositories: any[] = [];

export const feedItems: any[] = [];

export const changelogItems: any[] = [];
