import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WVFP Rules Assistant',
  description:
    "Ask questions about West Valley Fast Pitch rules, bylaws, ballpark policies, and D1 Prospects tournament rules.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Extend the page under the notch / rounded corners so env(safe-area-inset-*)
  // padding actually takes effect. Zoom is intentionally left enabled for a11y.
  viewportFit: 'cover',
  themeColor: '#FAF9F5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
