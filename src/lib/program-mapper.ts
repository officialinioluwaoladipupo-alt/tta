
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  source?: "luma";
  link?: string;
  programs?: string[];
  type?: string;
  focus?: string;
}

export interface ProgramDefinition {
    slug: string;
    name: string;
    keywords: RegExp[];
}

// 3. Dynamic Program Definition
const currentYear = new Date().getFullYear();

export const PROGRAM_DEFINITIONS: ProgramDefinition[] = [
  {
    slug: `locked-in-${currentYear}`,
    name: `Locked-IN ${currentYear}`,
    keywords: [
      new RegExp(`locked[\\s-]?in(\\s?${currentYear})?`, 'i'),  // natural language match
      new RegExp(`#lockedin${currentYear}`, 'i'),              // hashtag match
      new RegExp(`\\[program:\\s*locked-in-${currentYear}\\]`, 'i') // hidden marker
    ]
  }
];

// 5. Event → Program Mapping Logic
export function mapEventToPrograms(event: Event): ProgramDefinition[] {
  // Defensive coding: Ensure strings exist before processing
  const title = event.title || "";
  const desc = event.description || "";
  const text = `${title} ${desc}`.toLowerCase();
  
  return PROGRAM_DEFINITIONS.filter(program =>
    program.keywords.some(rule => rule.test(text))
  );
}

// 4. Central Event Database
// This file acts as the Source of Truth for all program events.
// Update this list to add/remove events from the website.
export const EVENT_REGISTRY: Event[] = [
    {
        id: "evt-001",
        title: "Architecture After School",
        description: "Join us for a session exploring architecture careers. [program: locked-in-2026]",
        startDate: new Date("2026-02-15T18:00:00"),
        endDate: new Date("2026-02-15T20:00:00"),
        link: "https://lu.ma/event-1",
        type: "Talk",
        focus: "Transition from School to Practice"
    },
    {
        id: "evt-002",
        title: "Systems Thinking for Architects",
        description: "An open session on systems theory. #lockedin2026",
        startDate: new Date("2026-03-01T10:00:00"),
        endDate: new Date("2026-03-01T12:00:00"),
        link: "https://lu.ma/event-2",
        type: "Workshop",
        focus: "System Theory Foundations"
    },
    {
        id: "evt-004",
        title: "Industry Future Panel",
        description: "Leading experts discuss the future of the built environment. [program: locked-in-2026]",
        startDate: new Date("2026-04-10T14:00:00"),
        endDate: new Date("2026-04-10T16:00:00"),
        link: "https://lu.ma/event-4",
        type: "Panel",
        focus: "Emerging Trends"
    },
    {
        id: "evt-005",
        title: "Design Thinking Workshop",
        description: "Hands-on conceptual design skills. [program: locked-in-2026]",
        startDate: new Date("2026-05-05T10:00:00"),
        endDate: new Date("2026-05-05T13:00:00"),
        link: "https://lu.ma/event-5",
        type: "Hands-on",
        focus: "Practical Design Skills"
    },
    {
        id: "evt-003",
        title: "General Community Hangout",
        description: "Casual coffee chat for all members.",
        startDate: new Date("2026-02-20T09:00:00"),
        endDate: new Date("2026-02-20T10:00:00"),
        link: "https://lu.ma/event-3",
        type: "Social",
        focus: "Community"
    }
];

// 6. Async Data Fetching (local registry)
export async function fetchEventsForProgram(programSlug: string): Promise<Event[]> {
  return getEventsForProgram(programSlug);
}

// Keep the synchronous version for local fallback
export function getEventsForProgram(programSlug: string): Event[] {
    return EVENT_REGISTRY.filter(event => {
        const matches = mapEventToPrograms(event);
        return matches.some(p => p.slug === programSlug);
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
