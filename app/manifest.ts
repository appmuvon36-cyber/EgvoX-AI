import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'EgvoX — Human Experience Data Network',
    short_name: 'EgvoX',
    description:
      'Marketplace and managed data operations platform for egocentric video capture, data annotation, and enterprise datasets.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F4F8F8',
    theme_color: '#027F86',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
