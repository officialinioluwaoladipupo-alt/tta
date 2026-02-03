import type { Metadata } from "next";
import { Inter, Space_Grotesk, MuseoModerno } from "next/font/google";
import { getCommunityHighlights } from "@/lib/community-data";
import { getGlobalSettings } from "@/lib/mdx";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animation/SmoothScroll";
import PageTransition from "@/components/animation/PageTransition";
import CommandPalette from "@/components/ui/CommandPalette";
import Preloader from "@/components/ui/Preloader";
import NoiseBackground from "@/components/visuals/NoiseBackground";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo-moderno",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  const siteName = settings?.siteName || "The Thinking Architect";
  const title = settings?.siteName || "The Thinking Architect | TTA";
  const description = settings?.siteDescription || "An authority signal and gateway to TTA platforms. Calm, Intentional, Durable.";
  const ogImage = settings?.defaultSeoImage || "https://tta.foundation/og.png";

  return {
    title,
    description,
    keywords: ["Architecture", "Education", "TTA", "Design", "Theory", "Professional Practice"],
    openGraph: {
      title,
      description,
      url: "https://tta.foundation",
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@TheThinkingArch",
    },
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const highlights = await getCommunityHighlights();
  const settings = await getGlobalSettings();

  return (
    <html lang="en">
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${museoModerno.variable} antialiased`}
      >
        <SmoothScroll>
          <NoiseBackground />
          <Preloader />
          <CommandPalette />
          <Header highlights={highlights} settings={settings} />
          <main className="min-h-screen pt-20 overflow-hidden">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer settings={settings} />
        </SmoothScroll>
      </body>
    </html>
  );
}
