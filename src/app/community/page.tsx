import type { Metadata } from "next";
import { getCommunityHighlights } from "@/lib/community-data";
import CommunityClient from "./CommunityClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Community | The Thinking Architect",
  description:
    "Join The Thinking Architect's WhatsApp community: honest conversation for architects, students, educators and anyone in the built environment.",
};

export default async function Community() {
  const highlights = await getCommunityHighlights();

  return <CommunityClient highlights={highlights} />;
}
