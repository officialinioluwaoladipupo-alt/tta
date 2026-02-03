import { getProgramBySlug, getAllPrograms, getGlobalSettings } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  const settings = await getGlobalSettings();

  if (!program) return {};

  const title = program.seoTitle || `${program.title} | ${settings?.siteName || "TTA"}`;
  const description = program.seoDescription || program.description;
  const image = program.seoImage || program.image || settings?.defaultSeoImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export async function generateStaticParams() {
  const programs = await getAllPrograms();
  return programs.map((program) => ({
    slug: program.slug,
  }));
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pt-20">
      <article className="max-w-[1600px] mx-auto px-6 py-20 border-x border-foreground/5">
        <Link href="/programs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent mb-12 hover:-translate-x-2 transition-transform">
          <ArrowLeft size={14} /> Back to Programs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <div className="max-w-4xl">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">{program.label}</span>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground mb-8 uppercase">
                {program.title}
              </h1>

              <div className="bg-foreground/5 p-8 mb-12 flex flex-wrap gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                    <Tag size={12} /> Status
                  </span>
                  <span className="font-bold uppercase text-accent">{program.status}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                    <Calendar size={12} /> Duration
                  </span>
                  <span className="font-bold uppercase text-foreground">12 Months</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                    <User size={12} /> Capacity
                  </span>
                  <span className="font-bold uppercase text-foreground">50 Seats</span>
                </div>
              </div>

              <div className="prose prose-invert prose-2xl max-w-none text-foreground/70 leading-relaxed font-medium">
                <p className="mb-12 text-2xl text-foreground bg-accent/5 p-6 border-l-4 border-accent">
                  {program.description}
                </p>
                {/* Content could be Markdown or blocks. If blocks, this would need a renderer. */}
                {program.content && <div className="mt-8">{program.content}</div>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            {program.image && (
              <div className="relative aspect-square grayscale saturate-0 contrast-125 hover:grayscale-0 hover:saturate-100 transition-all duration-700">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 border border-white/10" />
              </div>
            )}

            <div className="p-10 border border-foreground/10 flex flex-col gap-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Registration</h3>
              <p className="text-foreground/60 text-sm">
                This program is currently in &quot;{program.status}&quot; status. Please secure your spot early as seats are limited to 50 practitioners.
              </p>
              <button className="btn-primary w-full justify-center">Secure Your Spot</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
