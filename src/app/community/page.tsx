import { getCommunityHighlights } from "@/lib/community-data";
import CommunityClient from "./CommunityClient";

export const revalidate = 3600; // Cache for 1 hour

export default async function Community() {
  const highlights = await getCommunityHighlights();

  return <CommunityClient highlights={highlights} />;
}
