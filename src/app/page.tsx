import { getGlobalSettings } from "@/lib/mdx";
import HomeClient from "@/components/home/HomeClient";
import { getUpcomingEvents } from "@/lib/event-data";
import { getLatestVideos } from "@/lib/youtube";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Thinking Architect | TTA",
  description: "TTA is a community, programme and media platform for architecture and the people around it. Honest conversations, mentorship and opportunity, shared early.",
};

export default async function Home() {
  const [settings, upcomingEvents, latestVideos] = await Promise.all([
    getGlobalSettings(),
    getUpcomingEvents(),
    getLatestVideos(),
  ]);

  return (
    <HomeClient
      marqueeText={settings?.marqueeText || "THE THINKING ARCHITECT // MASTERCLASS // 2026 // JOIN THE COMMUNITY"}
      upcomingEvents={upcomingEvents}
      latestVideos={latestVideos.items}
    />
  );
}
