import { getGlobalSettings } from "@/lib/mdx";
import HomeClient from "@/components/home/HomeClient";
import { getCommunityHighlights } from "@/lib/community-data";
import { getUpcomingEvents } from "@/lib/event-data";

export default async function Home() {
  const settings = await getGlobalSettings();
  const highlights = await getCommunityHighlights();
  const upcomingEvents = await getUpcomingEvents();

  return (
    <HomeClient
      marqueeText={settings?.marqueeText || "THE THINKING ARCHITECT // MASTERCLASS // 2026 // JOIN THE COMMUNITY"}
      highlights={highlights}
      upcomingEvents={upcomingEvents}
    />
  );
}
