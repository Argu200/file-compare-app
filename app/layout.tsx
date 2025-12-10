import './globals.css'; // optional, if you have a globals.css
import { ReactNode } from 'react';

export const metadata = {
  title: 'File Compare App',
  description: 'Upload two files and compare them',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
