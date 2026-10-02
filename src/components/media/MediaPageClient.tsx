"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Play, Youtube } from "lucide-react";
import { fetchMoreVideos } from "@/app/actions/media";
import type { PaginatedResult, Video } from "@/lib/youtube";

const TOPICS = ["Awareness", "Design", "Exposure", "Mentorship", "Opportunity", "Impact"];
const WHATSAPP_URL = "https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO";
const YOUTUBE_URL = "https://www.youtube.com/@TheThinkingArchitect-t4p";
const CONTACT_EMAIL = "media@thethinkingarchitects.com.ng";
type Filter = "All" | "Think Sessions" | (typeof TOPICS)[number];

function matchesFilter(video: Video, filter: Filter) {
  if (filter === "All") return true;
  const text = [video.title, ...(video.tags ?? [])].join(" ").toLowerCase();
  return filter === "Think Sessions"
    ? /think[\s-]?sessions?|session recording/i.test(text)
    : text.includes(filter.toLowerCase());
}

function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group overflow-hidden border border-foreground/10 bg-foreground/[0.02] transition-colors hover:border-accent/50">
      <a href={video.url} target="_blank" rel="noreferrer" className="relative block aspect-video overflow-hidden bg-foreground/5" aria-label={`Watch ${video.title} on YouTube`}>
        {video.thumbnail && <Image src={video.thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
        <span className="absolute inset-0 grid place-items-center bg-black/20 text-white transition-colors group-hover:bg-black/5"><span className="grid size-14 place-items-center rounded-full bg-accent text-black"><Play size={20} fill="currentColor" /></span></span>
      </a>
      <div className="space-y-3 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground/50">{video.date}</p>
        <h3 className="text-xl font-bold leading-tight tracking-tight">{video.title}</h3>
        {video.speaker && <p className="text-sm text-foreground/60">With {video.speaker}</p>}
        <a href={video.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 pt-1 text-sm font-bold text-accent hover:text-foreground">Watch <ArrowUpRight size={16} /></a>
      </div>
    </article>
  );
}

export default function MediaPageClient({ initialVideos, initialNextToken, hasError = false }: {
  initialVideos: Video[];
  initialNextToken?: string;
  hasError?: boolean;
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [nextToken, setNextToken] = useState(initialNextToken);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const visibleVideos = videos.filter((video) => matchesFilter(video, activeFilter));
  const featured = videos[0];

  async function loadMore() {
    if (!nextToken || isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const result: PaginatedResult<Video> = await fetchMoreVideos("PLz-iC_fRiLMdfF41hmf3wEdIeTKd5tEhF", nextToken);
      if (result.status === "error") throw new Error("Load failed");
      setVideos((current) => [...current, ...result.items]);
      setNextToken(result.nextPageToken);
    } catch {
      setLoadMoreFailed(true);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent">The Thinking Architect</p>
        <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tighter sm:text-8xl">Media<span className="text-accent">.</span></h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-foreground/70 sm:text-2xl">Architecture, said honestly. Conversations and lessons from architects, published openly for anyone who cares how places get made.</p>
      </header>

      {featured && !hasError && <section className="mx-auto w-full max-w-[1440px] border-t border-foreground/10 px-5 py-12 sm:px-8 sm:py-16">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-accent">Latest</p>
        <article className="grid overflow-hidden border border-foreground/10 bg-foreground/[0.02] lg:grid-cols-5">
          <a href={featured.url} target="_blank" rel="noreferrer" className="relative block aspect-video bg-foreground/5 lg:col-span-3 lg:aspect-auto lg:min-h-[390px]" aria-label={`Watch ${featured.title} on YouTube`}>
            {featured.thumbnail && <Image src={featured.thumbnail} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />}
            <span className="absolute inset-0 grid place-items-center bg-black/20 text-white"><span className="grid size-16 place-items-center rounded-full bg-accent text-black"><Play size={22} fill="currentColor" /></span></span>
          </a>
          <div className="flex flex-col items-start justify-center gap-5 p-6 sm:p-9 lg:col-span-2 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/50">{featured.date}</p>
            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{featured.title}</h2>
            {featured.speaker && <p className="text-foreground/65">With {featured.speaker}</p>}
            <a href={featured.url} target="_blank" rel="noreferrer" className="btn-primary min-h-12 px-7">Watch <ArrowUpRight size={17} /></a>
          </div>
        </article>
      </section>}

      <section className="mx-auto w-full max-w-[1440px] border-t border-foreground/10 px-5 py-14 sm:px-8 sm:py-20">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-accent">Watch and learn</p>
        <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-6xl">All media<span className="text-accent">.</span></h2>
        <div className="mb-9 flex flex-wrap gap-2" aria-label="Filter media">
          {(["All", "Think Sessions", ...TOPICS] as Filter[]).map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter} className={`min-h-10 rounded-full border px-4 text-xs font-bold transition-colors ${activeFilter === filter ? "border-accent bg-accent text-black" : "border-foreground/15 text-foreground/70 hover:border-accent hover:text-foreground"}`}>{filter}</button>)}
        </div>
        {hasError ? <div className="border border-foreground/10 px-6 py-14 text-center sm:py-20">
          <h3 className="mx-auto max-w-2xl text-xl font-bold sm:text-2xl">We couldn&apos;t load the videos right now. Watch them on our YouTube channel instead.</h3>
          <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="btn-primary mt-7 min-h-12 px-6">Open YouTube <ArrowUpRight size={17} /></a>
        </div> : visibleVideos.length === 0 ? <div className="border border-foreground/10 px-6 py-14 text-center sm:py-20">
          <h3 className="mx-auto max-w-2xl text-xl font-bold sm:text-2xl">Nothing published yet. Join the community to hear when the first piece goes up.</h3>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary mt-7 min-h-12 px-6">Join on WhatsApp <ArrowUpRight size={17} /></a>
        </div> : <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleVideos.map((video) => <VideoCard key={video.id} video={video} />)}</div>
          {nextToken && <div className="mt-10 text-center">
            {loadMoreFailed && <p role="alert" className="mb-3 text-sm text-red-600">We couldn&apos;t load more videos. Please try again.</p>}
            <button type="button" onClick={loadMore} disabled={isLoadingMore} className="btn-outline min-h-12 px-7 disabled:opacity-60">{isLoadingMore ? "Loading…" : loadMoreFailed ? "Try again" : "Load more"}</button>
          </div>}
        </>}
      </section>

      <section className="border-y border-foreground/10 bg-accent/[0.04] px-5 py-16 text-center sm:px-8 sm:py-24">
        <Youtube size={34} className="mx-auto mb-5 text-accent" />
        <h2 className="text-3xl font-black sm:text-5xl">Never miss a conversation.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">New sessions are published on our YouTube channel. Subscribe to watch them as they land.</p>
        <a href={`${YOUTUBE_URL}?sub_confirmation=1`} target="_blank" rel="noreferrer" className="btn-primary mt-7 min-h-12 px-6">Subscribe on YouTube <ArrowUpRight size={17} /></a>
      </section>

      <p className="mx-auto max-w-4xl px-5 py-10 text-center text-sm leading-relaxed text-foreground/50 sm:px-8 sm:py-12">We are also working on written pieces and stories from architects. They will appear here when they are ready.</p>

      <section className="mx-auto grid w-full max-w-[1440px] gap-6 border-t border-foreground/10 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1fr_auto] md:items-center">
        <div><p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-accent">Share your story</p>
          <h2 className="text-3xl font-black sm:text-5xl">Have something worth saying?</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-foreground/70">We publish honest accounts of how architecture is really made, including the parts that don&apos;t make a portfolio. If you&apos;d like to be featured, or have a story to share, write to us.</p>
        </div>
        <a href={`mailto:${CONTACT_EMAIL}?subject=Story%20for%20TTA%20Media`} className="btn-outline min-h-12 px-6">Email the media team <ArrowUpRight size={17} /></a>
      </section>

      <section className="bg-foreground px-5 py-16 text-center text-background sm:px-8 sm:py-24">
        <h2 className="text-4xl font-black sm:text-6xl">Join the conversation.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-background/70">Watching is a start. The conversation carries on in our community.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary mt-8 min-h-12 px-7">Join on WhatsApp <ArrowRight size={18} /></a>
      </section>
    </main>
  );
}
