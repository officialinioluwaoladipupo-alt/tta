"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Video } from "@/lib/youtube";
import { useState } from "react";
import { fetchMoreVideos } from "@/app/actions/media";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

interface Props {
  initialVideos: Video[];
  initialNextToken?: string;
  playlistId?: string;
}

export default function MediaGrid({ initialVideos, initialNextToken, playlistId }: Props) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [nextToken, setNextToken] = useState<string | undefined>(initialNextToken);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    if (!nextToken || isLoading) return;
    setIsLoading(true);

    try {
      // Default playlist ID if none provided
      const pid = playlistId || "PLz-iC_fRiLMdfF41hmf3wEdIeTKd5tEhF";
      const res = await fetchMoreVideos(pid, nextToken);
      if (res.items) {
        setVideos(prev => [...prev, ...res.items]);
        setNextToken(res.nextPageToken);
      }
    } catch (error) {
      console.error("Failed to load more videos", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 opacity-50">
        <div className="w-16 h-1 bg-accent mb-8 animate-pulse" />
        <h3 className="text-2xl font-black uppercase tracking-widest text-foreground">Videos coming soon.</h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mt-2">
          Check back soon for new recordings and talks.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 items-center w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 w-full"
      >
        {videos.map((video, i) => (
          <motion.div
            key={`${video.id}-${i}`}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className={`group cursor-pointer p-8 transition-all hover:bg-foreground/5 border-foreground/5 ${i % 3 !== 2 ? 'lg:border-r' : ''}`}
            onClick={() => window.open(video.url, '_blank')}
          >
            <div className="aspect-video bg-foreground/5 relative flex items-center justify-center overflow-hidden border border-foreground/10 group-hover:border-accent transition-all">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 bg-cover bg-center opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: `url(${video.thumbnail})` }}
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                  {video.duration}
                </div>
              )}
              <Play size={48} className="text-foreground opacity-40 group-hover:opacity-100 group-hover:text-accent group-hover:scale-110 transition-all relative z-10" />
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                {video.channelTitle || "Youtube"}
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight group-hover:translate-x-2 transition-all text-foreground line-clamp-2">
                {video.title}
              </h3>
              {video.date && (
                <div className="flex items-center gap-3 mt-1 text-xs text-foreground/40 font-bold uppercase tracking-widest">
                  <span>{video.date}</span>
                  {video.views && (
                    <>
                      <span className="w-1 h-1 bg-accent/50 rounded-full" />
                      <span className="text-foreground/60">{video.views} Views</span>
                    </>
                  )}
                  {video.likes && (
                    <>
                      <span className="w-1 h-1 bg-accent/50 rounded-full" />
                      <span className="text-foreground/60">{video.likes} Likes</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {nextToken && (
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          onClick={handleLoadMore}
          disabled={isLoading}
          className="btn-outline px-12 py-4 text-sm disabled:opacity-50"
        >
          {isLoading ? "Acquiring Signal..." : "Load More Signals"}
        </motion.button>
      )}
    </div>
  );
}
