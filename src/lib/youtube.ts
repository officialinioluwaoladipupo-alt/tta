interface YouTubeApiItem {
  id?: string | { videoId?: string };
  snippet?: {
    title?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;
    description?: string;
    thumbnails?: Record<string, { url?: string }>;
    resourceId?: { videoId?: string };
    topLevelComment?: { snippet?: { authorDisplayName?: string; authorProfileImageUrl?: string; textDisplay?: string; likeCount?: string; publishedAt?: string } };
    tags?: string[];
  };
  contentDetails?: { itemCount?: number; duration?: string };
  statistics?: { viewCount?: string; likeCount?: string; commentCount?: string; subscriberCount?: string; videoCount?: string };
}

interface YouTubeApiResponse { items?: YouTubeApiItem[]; nextPageToken?: string }
export interface ChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
  duration?: string;
  views?: string;
  likes?: string;
  commentCount?: string;
  tags?: string[];
  channelTitle?: string;
  speaker?: string;
}

export interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: string;
  date: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextPageToken?: string;
  status?: "ok" | "empty" | "error";
}

const DEFAULT_PLAYLIST_ID = "PLz-iC_fRiLMdfF41hmf3wEdIeTKd5tEhF";
let CACHED_CHANNEL_ID: string | null = null;
const API_KEY = process.env.YOUTUBE_API_KEY;

// --- Helpers ---

function formatDuration(isoDuration: string): string {
  if (!isoDuration) return "";
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "";

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  const h = hours ? parseInt(hours) : 0;
  const m = minutes ? parseInt(minutes) : 0;
  const s = seconds ? parseInt(seconds) : 0;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(views: string): string {
  const v = parseInt(views);
  if (isNaN(v)) return "";
  if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  return v.toString();
}

function extractSpeaker(description = "", title = "") {
  const descriptionMatch = description.match(/^\s*(?:speaker|guest|featuring|with)\s*[:\-]\s*([^\r\n|]+)/im);
  const titleMatch = title.match(/\b(?:with|featuring)\s+([^|–—-]+)/i);
  return (descriptionMatch?.[1] || titleMatch?.[1] || "").trim() || undefined;
}

async function getChannelId(): Promise<string | null> {
  if (CACHED_CHANNEL_ID) return CACHED_CHANNEL_ID;
  if (!API_KEY) return null;

  try {
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${DEFAULT_PLAYLIST_ID}&key=${API_KEY}`;
    const res = await fetch(playlistUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json() as YouTubeApiResponse;
    const channelId = data.items?.[0]?.snippet?.channelId;
    if (channelId) {
      CACHED_CHANNEL_ID = channelId;
      return CACHED_CHANNEL_ID;
    }
  } catch (e) {
    console.error("Failed to fetch channel ID", e);
  }
  return null;
}

// --- Features ---

export async function getLiveStatus(): Promise<boolean> {
  if (!API_KEY) return false;
  const channelId = await getChannelId();
  if (!channelId) return false;

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 mins
    const data = await res.json() as YouTubeApiResponse;
    return Boolean(data.items?.length);
  } catch (e) {
    console.error("Failed to check live status", e);
    return false;
  }
}

export async function getChannelStats(): Promise<ChannelStats | null> {
  if (!API_KEY) return null;
  const channelId = await getChannelId();
  if (!channelId) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json() as YouTubeApiResponse;

    const stats = data.items?.[0]?.statistics;
    if (stats) {
      return {
        subscriberCount: formatViews(stats.subscriberCount ?? "0"),
        viewCount: formatViews(stats.viewCount ?? "0"),
        videoCount: stats.videoCount ?? "0"
      };
    }
    return null;
  } catch (e) {
    console.error("Failed to fetch channel stats", e);
    return null;
  }
}

export async function getChannelPlaylists(): Promise<Playlist[]> {
  if (!API_KEY) return [];
  const channelId = await getChannelId();
  if (!channelId) return [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=20&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json() as YouTubeApiResponse;

    return (data.items || []).map((item) => ({
      id: typeof item.id === "string" ? item.id : "",
      title: item.snippet?.title ?? "Untitled playlist",
      thumbnail: item.snippet?.thumbnails?.medium?.url || "",
      itemCount: item.contentDetails?.itemCount ?? 0
    }));
  } catch (e) {
    console.error("Failed to fetch playlists", e);
    return [];
  }
}

export async function getVideoComments(videoId: string): Promise<Comment[]> {
  if (!API_KEY) return [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=3&order=relevance&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json() as YouTubeApiResponse;

    return (data.items || []).map((item) => {
      const snippet = item.snippet?.topLevelComment?.snippet;
      return {
        id: typeof item.id === "string" ? item.id : "",
        author: snippet?.authorDisplayName ?? "YouTube user",
        avatar: snippet?.authorProfileImageUrl ?? "",
        text: snippet?.textDisplay ?? "",
        likes: formatViews(snippet?.likeCount ?? "0"),
        date: snippet?.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : ""
      };
    });
  } catch (e) {
    console.error("Failed to fetch comments", e);
    return [];
  }
}

export async function searchVideos(query: string): Promise<PaginatedResult<Video>> {
  if (!API_KEY) return { items: [], status: "error" };
  const channelId = await getChannelId();
  if (!channelId) return { items: [], status: "error" };

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${query}&type=video&maxResults=20&order=date&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { items: [], status: "error" };
    const data = await res.json() as YouTubeApiResponse;

    // Note: Search endpoint doesn't return view counts/durations directly, 
    // normally we'd do a second fetch but for speed/quota we might skip or do minimal.
    // For search results, we'll map what we have.

    const videos = (data.items || []).map((item) => ({
      id: typeof item.id === "object" ? item.id?.videoId ?? "" : "",
      title: item.snippet?.title ?? "Untitled video",
      url: `https://www.youtube.com/watch?v=${typeof item.id === "object" ? item.id?.videoId ?? "" : ""}`,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
      date: item.snippet?.publishedAt ? new Date(item.snippet.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "",
      channelTitle: item.snippet?.channelTitle,
      speaker: extractSpeaker(item.snippet?.description, item.snippet?.title),
    }));
    return { items: videos, status: videos.length ? "ok" : "empty" };

  } catch (e) {
    console.error("Search failed", e);
    return { items: [], status: "error" };
  }
}

export async function getLatestVideos(playlistId: string = DEFAULT_PLAYLIST_ID, pageToken?: string): Promise<PaginatedResult<Video>> {
  if (!API_KEY || playlistId.includes("xxxx")) {
    return { items: [], status: "error" };
  }

  try {
    let playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`;
    if (pageToken) {
      playlistUrl += `&pageToken=${pageToken}`;
    }

    const res = await fetch(playlistUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Playlist Fetch Failed: ${res.status}`);

    const playlistData = await res.json() as YouTubeApiResponse;
    if (!playlistData.items || playlistData.items.length === 0) return { items: [], status: "empty" };

    const videoIds = playlistData.items.map((item) => item.snippet?.resourceId?.videoId).filter((id): id is string => Boolean(id)).join(',');

    // Cache Channel ID if first request
    if (playlistData.items[0]?.snippet?.channelId && !CACHED_CHANNEL_ID) {
      CACHED_CHANNEL_ID = playlistData.items[0].snippet.channelId;
    }

    // Fetch details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsRes = await fetch(detailsUrl, { next: { revalidate: 3600 } });

    const detailsMap = new Map();
    if (detailsRes.ok) {
      const detailsData = await detailsRes.json() as YouTubeApiResponse;
      detailsData.items?.forEach((item) => { if (typeof item.id === "string") detailsMap.set(item.id, item); });
    }

    const videos = playlistData.items.map((item) => {
      const videoId = item.snippet?.resourceId?.videoId ?? "";
      const details = detailsMap.get(videoId);

      const publishedAt = item.snippet?.publishedAt;
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "";

      return {
        id: videoId,
        title: item.snippet?.title ?? "Untitled video",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: item.snippet?.thumbnails?.maxresdefault?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
        date: date,
        duration: details?.contentDetails?.duration ? formatDuration(details.contentDetails.duration) : "",
        views: formatViews(details?.statistics?.viewCount ?? "0"),
        likes: formatViews(details?.statistics?.likeCount ?? "0"),
        commentCount: formatViews(details?.statistics?.commentCount ?? "0"),
        tags: details?.snippet?.tags ?? [],
        speaker: extractSpeaker(item.snippet?.description, item.snippet?.title),
      };
    });

    return {
      items: videos,
      nextPageToken: playlistData.nextPageToken,
      status: videos.length ? "ok" : "empty",
    };

  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return { items: [], status: "error" };
  }
}
