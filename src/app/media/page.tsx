import type { Metadata } from "next";
import { getLatestVideos } from "@/lib/youtube";
import MediaPageClient from "@/components/media/MediaPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Media | The Thinking Architect",
  description:
    "Conversations and lessons from architects, published openly. Watch Think Session recordings and more from The Thinking Architect.",
};

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;

  let videos: Awaited<ReturnType<typeof getLatestVideos>>["items"] = [];
  let nextPageToken: string | undefined = undefined;
  let hasError = false;

  try {
    const videoData = await getLatestVideos();
    videos = videoData.items;
    nextPageToken = videoData.nextPageToken;
    hasError = videoData.status === "error";
  } catch (error) {
    console.error("Failed to load Media page videos:", error);
    hasError = true;
  }

  return (
    <MediaPageClient
      initialVideos={videos}
      initialNextToken={nextPageToken}
      hasError={hasError}
    />
  );
}
