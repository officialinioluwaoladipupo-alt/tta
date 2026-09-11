import { getLatestVideos, getChannelStats, getLiveStatus, getVideoComments, searchVideos, PaginatedResult, Video } from "@/lib/youtube";
import MediaGrid from "@/components/media/MediaGrid";
import MediaHeader from "@/components/media/MediaHeader";
import MediaFooter from "@/components/media/MediaFooter";
import MediaHero from "@/components/media/MediaHero";
import MediaSearch from "@/components/media/MediaSearch";
import MediaCategories from "@/components/media/MediaCategories";

export const revalidate = 3600;

export default async function Media({ searchParams }: { searchParams: Promise<{ q?: string, playlistId?: string }> }) {
  const { q, playlistId } = await searchParams;

  const stats = await getChannelStats();
  const isLive = await getLiveStatus();

  let videoData: PaginatedResult<Video>;
  let featuredVideo: Video | undefined;

  if (q) {
    const items = await searchVideos(q);
    videoData = { items };
  } else {
    videoData = await getLatestVideos(playlistId);
    const allVideos = videoData.items || [];
    if (allVideos.length > 0) {
      featuredVideo = allVideos[0];
      videoData = {
        items: allVideos.slice(1),
        nextPageToken: videoData.nextPageToken
      };
    }
  }

  const comments = featuredVideo ? await getVideoComments(featuredVideo.id) : [];

  return (
    <div className="bg-background min-h-screen text-foreground flex flex-col items-center">
      <section className="w-full max-w-[1600px] px-6 pt-40 pb-16">
        <p className="text-[11px] font-black uppercase tracking-widest text-accent mb-6">Media</p>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">Talks, recordings,<br />and conversations.</h1>
        <p className="mt-8 max-w-2xl text-xl text-foreground/60">All in one place.</p>
      </section>
      <MediaHeader stats={stats} isLive={isLive} />

      <section className="w-full max-w-[1600px] px-6 flex flex-col items-center gap-8 mb-12 relative z-20">
        <MediaSearch />
        <MediaCategories activeId={playlistId} />
      </section>

      {featuredVideo && !q && <MediaHero video={featuredVideo} comments={comments} />}

      <section className="max-w-[1600px] w-full px-6 py-20 border-x border-t border-foreground/5">
        <MediaGrid
          initialVideos={videoData.items}
          initialNextToken={videoData.nextPageToken}
          playlistId={playlistId}
        />
      </section>

      <section className="w-full max-w-[1600px] px-6 py-20 text-center border-t border-foreground/5">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">More on our channel.</h2>
        <p className="mt-4 text-foreground/60">Full archive lives on YouTube.</p>
        <a href="https://www.youtube.com/@TheThinkingArchitect-t4p" className="btn-primary inline-flex mt-8">Visit our YouTube →</a>
      </section>

      <MediaFooter />
    </div>
  );
}
