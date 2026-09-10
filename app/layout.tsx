import type { Metadata, Viewport } from 'next';
import './globals.css';

// Resolve the site's absolute base URL so social scrapers get an absolute image
// URL. Prefer an explicit override, then Vercel's deployment env vars, else local.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

const TITLE = 'WVFP Rules Assistant';
const DESCRIPTION =
  'Ask questions about West Valley Fastpitch rules, bylaws, ballpark policies, and D1 Prospects tournament rules.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'West Valley Fastpitch',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'West Valley Fastpitch Rules Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Extend the page under the notch / rounded corners so env(safe-area-inset-*)
  // padding actually takes effect. Zoom is intentionally left enabled for a11y.
  viewportFit: 'cover',
  themeColor: '#FFF7E8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;700;800;900&family=Lato:ital,wght@0,400;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,500;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
