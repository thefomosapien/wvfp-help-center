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
