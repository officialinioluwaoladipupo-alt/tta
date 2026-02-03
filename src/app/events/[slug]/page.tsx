import { getEventBySlug } from "@/lib/event-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EventRegistrationForm from "@/components/events/EventRegistrationForm";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: "Event Not Found" };

    return {
        title: `${event.title} - TTA Events`,
        description: event.seoDescription || event.shortDescription || event.description,
        openGraph: {
            images: event.seoImage ? [{ url: event.seoImage }] : undefined,
        }
    };
}

export default async function EventPage({ params }: Props) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-20">
            <div className="max-w-[1600px] mx-auto px-6">

                {/* Back Link */}
                <Link href="/events" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-accent mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Schedule
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">

                    {/* Left Content */}
                    <div className="lg:col-span-8">

                        {/* Hero Image */}
                        <div className="relative aspect-video w-full overflow-hidden bg-foreground/5 mb-12 border border-foreground/10">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Title & Metadata */}
                        <div className="mb-12">
                            <div className="flex flex-wrap gap-4 mb-6">
                                {event.tags.map(tag => (
                                    <span key={tag} className="bg-accent/10 text-accent px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-foreground mb-8">
                                {event.title}
                            </h1>

                            <div className="flex flex-col md:flex-row gap-8 md:gap-16 border-y border-foreground/10 py-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-accent" size={20} />
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Date</span>
                                        <span className="font-bold text-foreground">{event.displayDate}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="text-accent" size={20} />
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Time</span>
                                        <span className="font-bold text-foreground">{event.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-accent" size={20} />
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Location</span>
                                        <span className="font-bold text-foreground">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight max-w-none text-foreground/80">
                            <p className="text-xl leading-relaxed text-foreground font-medium mb-8">
                                {event.description}
                            </p>

                            {event.learningPoints && event.learningPoints.length > 0 && (
                                <div className="bg-foreground/5 p-8 border-l-4 border-accent my-8">
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-4">What you will learn</h3>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {event.learningPoints.map((point, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <span className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
                                                <span className="text-foreground/90 font-medium">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Speakers */}
                        {event.speakers && event.speakers.length > 0 && (
                            <div className="mt-16 pt-16 border-t border-foreground/10">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/40 mb-8">Speakers</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {event.speakers.map((speaker, i) => (
                                        <div key={i} className="flex items-center gap-6 group">
                                            <div className="w-20 h-20 bg-foreground/10 rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-accent transition-colors">
                                                {speaker.avatar ? (
                                                    <Image
                                                        src={speaker.avatar}
                                                        alt={speaker.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-foreground/30 font-black text-2xl">
                                                        {speaker.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xl uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors">
                                                    {speaker.name}
                                                </h4>
                                                <p className="text-xs text-foreground/50 font-bold uppercase tracking-[0.2em] mt-1">
                                                    {speaker.role}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Sidebar: Registration - Sticky */}
                    <div className="lg:col-span-4 lg:relative">
                        <div className="lg:sticky lg:top-32">
                            <EventRegistrationForm
                                eventId={event.id}
                                eventTitle={event.title}
                                eventDate={event.date}
                                customFields={event.formFields}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
