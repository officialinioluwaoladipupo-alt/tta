"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowUpRight, ArrowRight, Mail, Youtube, MessageCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Video } from "@/lib/youtube";
import { fetchMoreVideos } from "@/app/actions/media";

const TOPIC_CHIPS = [
  "All",
  "Think Sessions",
  "Awareness",
  "Design",
  "Exposure",
  "Mentorship",
  "Opportunity",
  "Impact",
  "Practice",
  "Craft",
];

const WHATSAPP_LINK = "https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO";
const YOUTUBE_CHANNEL = "https://www.youtube.com/@TheThinkingArchitect-t4p";
const MEDIA_EMAIL = "mailto:media@thethinkingarchitects.com.ng";

function extractSpeaker(title: string, channelTitle?: string): string {
  if (!title) return channelTitle || "The Thinking Architect";

  const withMatch = title.match(/(?:w\/|with|ft\.|feat\.|by)\s+([^|\-–—()]+)/i);
  if (withMatch && withMatch[1]) {
    return withMatch[1].trim();
  }

  const dashMatch = title.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*[\-–—]\s*/);
  if (dashMatch && dashMatch[1] && !["Think Session", "Masterclass", "Episode", "TTA"].some(w => dashMatch[1].includes(w))) {
    return dashMatch[1].trim();
  }

  const pipeMatch = title.match(/\|\s*([^|\-–—()]+)$/);
  if (pipeMatch && pipeMatch[1] && !pipeMatch[1].toLowerCase().includes("tta") && !pipeMatch[1].toLowerCase().includes("thinking architect")) {
    return pipeMatch[1].trim();
  }

  return "The Thinking Architect";
}

interface MediaClientProps {
  initialVideos: Video[];
  initialNextToken?: string;
  hasError?: boolean;
}

export default function MediaClient({ initialVideos, initialNextToken, hasError = false }: MediaClientProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [nextToken, setNextToken] = useState<string | undefined>(initialNextToken);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const remainingVideos = videos.length > 0 ? videos.slice(1) : [];

  // Filter remaining videos based on selected topic chip
  const filteredVideos = remainingVideos.filter(video => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Think Sessions") {
      return (
        video.title.toLowerCase().includes("think session") ||
        video.title.toLowerCase().includes("session") ||
        (video.tags && video.tags.some(t => t.toLowerCase().includes("think")))
      );
    }
    const filterLower = activeFilter.toLowerCase();
    return (
      video.title.toLowerCase().includes(filterLower) ||
      (video.tags && video.tags.some(t => t.toLowerCase().includes(filterLower)))
    );
  });

  const handleLoadMore = async () => {
    if (!nextToken || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      const res = await fetchMoreVideos("PLz-iC_fRiLMdfF41hmf3wEdIeTKd5tEhF", nextToken);
      if (res.items && res.items.length > 0) {
        setVideos(prev => [...prev, ...res.items]);
        setNextToken(res.nextPageToken);
      }
    } catch (err) {
      console.error("Failed to fetch more videos", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground flex flex-col items-center">
      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video bg-black border border-foreground/20 overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-accent hover:text-black transition-colors"
                aria-label="Close video player"
              >
                <X size={20} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo.title}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header & Intro */}
      <section className="w-full max-w-[1600px] px-6 pt-36 pb-16 border-x border-foreground/5">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-accent mb-6">
          The Thinking Architect · Repository
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-foreground">
          Media<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-3xl text-xl md:text-2xl font-medium leading-relaxed text-foreground/60">
          Architecture, said honestly. Conversations and lessons from architects, published openly for anyone who cares how places get made.
        </p>
      </section>

      {/* 2. Featured Section */}
      {featuredVideo && !hasError && (
        <section className="w-full max-w-[1600px] px-6 py-16 border-x border-t border-foreground/5">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-accent flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Section label: Latest
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 hidden sm:block">
              Featured Published Piece
            </span>
          </div>

          <div className="relative border border-foreground/10 bg-foreground/[0.02] p-6 md:p-10 lg:p-12 overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Thumbnail / Watch Trigger */}
              <div className="lg:col-span-7">
                <div
                  className="relative aspect-video w-full bg-foreground/5 overflow-hidden border border-foreground/10 group-hover:border-accent/50 transition-all cursor-pointer"
                  onClick={() => setActiveVideo(featuredVideo)}
                >
                  <Image
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-accent text-black flex items-center justify-center pl-1 shadow-2xl transition-transform group-hover:scale-110">
                      <Play size={28} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6">
                <div>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">
                    <span>{featuredVideo.date}</span>
                    {featuredVideo.duration && (
                      <>
                        <span>·</span>
                        <span>{featuredVideo.duration}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] text-foreground group-hover:text-accent transition-colors">
                    {featuredVideo.title}
                  </h2>
                  <p className="mt-4 text-sm font-semibold text-foreground/60 uppercase tracking-wider">
                    Speaker: {extractSpeaker(featuredVideo.title, featuredVideo.channelTitle)}
                  </p>
                </div>

                <div className="pt-6 border-t border-foreground/10 flex items-center gap-4">
                  <button
                    onClick={() => setActiveVideo(featuredVideo)}
                    className="btn-primary min-h-12 px-8 text-sm"
                  >
                    Watch <Play size={16} fill="currentColor" />
                  </button>
                  <a
                    href={featuredVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline min-h-12 px-6 text-sm"
                  >
                    Watch on YouTube <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. All media Section */}
      <section className="w-full max-w-[1600px] px-6 py-20 border-x border-t border-foreground/5">
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent mb-2">
                Section label: Watch and learn
              </p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground">
                All media<span className="text-accent">.</span>
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
              Conversations & Sessions Archive
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide border-b border-foreground/10">
            {TOPIC_CHIPS.map(chip => {
              const isActive = activeFilter === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveFilter(chip)}
                  className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-accent text-black border-accent shadow-md"
                      : "bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-accent/50 hover:text-foreground"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {hasError ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 border border-red-500/20 bg-red-500/5 text-center">
            <AlertTriangle size={40} className="text-red-500 mb-4" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground max-w-xl">
              We couldn&apos;t load the videos right now. Watch them on our YouTube channel instead.
            </h3>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 px-8 py-4 text-sm"
            >
              Open YouTube <ArrowUpRight size={18} />
            </a>
          </div>
        ) : filteredVideos.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-28 px-6 border border-foreground/10 bg-foreground/[0.02] text-center">
            <MessageCircle size={44} className="text-accent mb-4" />
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground max-w-xl">
              Nothing published yet. Join the community to hear when the first piece goes up.
            </h3>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 px-8 py-4 text-sm"
            >
              Join on WhatsApp <ArrowRight size={18} />
            </a>
          </div>
        ) : (
          /* Media Cards Grid */
          <div className="flex flex-col items-center gap-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {filteredVideos.map((video, idx) => {
                const speaker = extractSpeaker(video.title, video.channelTitle);
                return (
                  <article
                    key={`${video.id}-${idx}`}
                    className="group border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between overflow-hidden hover:border-accent/50 hover:bg-accent/[0.02] transition-all"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <div
                        className="relative aspect-video w-full bg-foreground/5 overflow-hidden cursor-pointer"
                        onClick={() => setActiveVideo(video)}
                      >
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-accent/90 text-black flex items-center justify-center pl-0.5 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                            <Play size={20} fill="currentColor" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-foreground/40">
                          <span>{video.date}</span>
                        </div>
                        <h3
                          className="text-xl font-black uppercase tracking-tight text-foreground line-clamp-2 group-hover:text-accent transition-colors cursor-pointer"
                          onClick={() => setActiveVideo(video)}
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-wider text-foreground/60">
                          Speaker: <span className="text-foreground">{speaker}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="p-6 pt-0 flex items-center justify-between border-t border-foreground/5 mt-4">
                      <button
                        onClick={() => setActiveVideo(video)}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-accent hover:text-foreground transition-colors"
                      >
                        Watch <Play size={14} fill="currentColor" />
                      </button>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-foreground/40 hover:text-foreground uppercase tracking-widest inline-flex items-center gap-1"
                      >
                        YouTube <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Load More */}
            {nextToken && (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="btn-outline px-12 py-4 text-sm disabled:opacity-50"
              >
                {isLoadingMore ? "Loading more..." : "Load More Media"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* 4. Subscribe Section */}
      <section className="w-full max-w-[1600px] px-6 py-20 border-x border-t border-foreground/5 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <Youtube size={44} className="text-accent mb-6" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-4">
            Never miss a conversation<span className="text-accent">.</span>
          </h2>
          <p className="max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-foreground/70 mb-8">
            New sessions are published on our YouTube channel. Subscribe to watch them as they land.
          </p>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary px-10 py-5 text-base"
          >
            Subscribe on YouTube <Youtube size={20} />
          </a>
        </div>
      </section>

      {/* 5. Coming soon Section (Quiet note) */}
      <section className="w-full max-w-[1600px] px-6 py-12 border-x border-t border-foreground/5 bg-foreground/[0.01]">
        <div className="max-w-4xl mx-auto p-6 md:p-8 border border-dashed border-foreground/15 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Coming soon</p>
          <p className="text-base md:text-lg font-medium leading-relaxed text-foreground/60 italic">
            We are also working on written pieces and stories from architects. They will appear here when they are ready.
          </p>
        </div>
      </section>

      {/* 6. Share your story Section */}
      <section className="w-full max-w-[1600px] px-6 py-24 border-x border-t border-foreground/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
              Share your story
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-[0.95]">
              Have something worth saying<span className="text-accent">?</span>
            </h2>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/70 max-w-2xl">
              We publish honest accounts of how architecture is really made, including the parts that don&apos;t make a portfolio. If you&apos;d like to be featured, or have a story to share, write to us.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center">
            <a
              href={MEDIA_EMAIL}
              className="btn-outline min-h-16 px-10 text-base"
            >
              Email the media team <Mail size={20} />
            </a>
            <span className="mt-3 text-xs font-mono text-foreground/40">
              media@thethinkingarchitects.com.ng
            </span>
          </div>
        </div>
      </section>

      {/* 7. Closing CTA Section */}
      <section className="w-full max-w-[1600px] px-6 py-28 border-x border-t border-b border-foreground/5 bg-foreground text-background text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-background mb-6">
          Join the conversation<span className="text-accent">.</span>
        </h2>
        <p className="max-w-2xl text-xl md:text-2xl font-medium leading-relaxed text-background/70 mb-10">
          Watching is a start. The conversation carries on in our community.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="btn-primary min-h-16 px-12 text-base"
        >
          Join on WhatsApp <ArrowRight size={20} />
        </a>
      </section>
    </div>
  );
}
