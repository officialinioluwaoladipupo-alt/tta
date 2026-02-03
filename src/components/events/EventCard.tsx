"use client";

import { Event } from "@/lib/event-data";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
    event: Event;
}

export default function EventCard({ event }: EventCardProps) {
    return (
        <Link
            href={`/events/${event.slug}`}
            className="group relative block bg-white border border-foreground/10 overflow-hidden hover:shadow-xl transition-all duration-500 ease-out flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden shrink-0">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 flex flex-col items-center border border-black/5 shadow-sm">
                    <span className="text-xs font-black uppercase tracking-wider text-accent">
                        {event.displayDate.split(" ")[0]}
                    </span>
                    <span className="text-xl font-black text-foreground leading-none">
                        {event.displayDate.split(" ")[1].replace(",", "")}
                    </span>
                </div>

                {/* Tags */}
                <div className="absolute top-4 right-4 flex gap-2">
                    {event.tags.map(tag => (
                        <span key={tag} className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-white/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-4 flex-grow">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-foreground/70 text-sm line-clamp-2 leading-relaxed">
                        {event.shortDescription || event.description}
                    </p>
                </div>

                {/* Speakers Section */}
                {event.speakers && event.speakers.length > 0 && (
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {event.speakers.map((speaker) => (
                                <div key={speaker.id} className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-foreground/10">
                                    {speaker.avatar ? (
                                        <Image src={speaker.avatar} alt={speaker.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-foreground/50">{speaker.name[0]}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-foreground/60 uppercase tracking-widest">
                            With {event.speakers[0].name} {event.speakers.length > 1 && `+ ${event.speakers.length - 1} others`}
                        </span>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-foreground/5 grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-foreground/50">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-accent" />
                        {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-accent" />
                        {event.location}
                    </div>
                </div>

                <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <div className="w-10 h-10 bg-accent text-white flex items-center justify-center rounded-full shadow-lg">
                        <ArrowUpRight size={20} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
