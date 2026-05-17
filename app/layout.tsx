import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClickSpark from "@/components/ui/ClickSpark";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Peblo AI | Collaborative Notes Workspace",
  description: "High-performance collaborative notes workspace powered by GPT-4. Features streaming AI, public sharing, and productivity insights.",
  keywords: ["notes", "AI", "collaborative", "productivity", "workspace"],
  authors: [{ name: "Peblo Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Fira+Code:wght@300;400;500;600;700&family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Permanent+Marker&family=Inter:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning style={{ overflowX: 'hidden' }}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <ClickSpark
            sparkColor="#00FFFF"
            sparkSize={12}
            sparkRadius={20}
            sparkCount={10}
            duration={600}
          >
            {children}
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  );
}
