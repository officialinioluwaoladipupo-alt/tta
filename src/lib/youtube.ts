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

async function getChannelId(): Promise<string | null> {
  if (CACHED_CHANNEL_ID) return CACHED_CHANNEL_ID;
  if (!API_KEY) return null;

  try {
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${DEFAULT_PLAYLIST_ID}&key=${API_KEY}`;
    const res = await fetch(playlistUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      CACHED_CHANNEL_ID = data.items[0].snippet.channelId;
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
    const data = await res.json();
    return data.items && data.items.length > 0;
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
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      return {
        subscriberCount: formatViews(stats.subscriberCount),
        viewCount: formatViews(stats.viewCount),
        videoCount: stats.videoCount
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
    const data = await res.json();

    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || "",
      itemCount: item.contentDetails.itemCount
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
    const data = await res.json();

    return (data.items || []).map((item: any) => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {
        id: item.id,
        author: snippet.authorDisplayName,
        avatar: snippet.authorProfileImageUrl,
        text: snippet.textDisplay,
        likes: formatViews(snippet.likeCount),
        date: new Date(snippet.publishedAt).toLocaleDateString()
      };
    });
  } catch (e) {
    console.error("Failed to fetch comments", e);
    return [];
  }
}

export async function searchVideos(query: string): Promise<Video[]> {
  if (!API_KEY) return [];
  const channelId = await getChannelId();
  if (!channelId) return [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&q=${query}&type=video&maxResults=20&order=date&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    // Note: Search endpoint doesn't return view counts/durations directly, 
    // normally we'd do a second fetch but for speed/quota we might skip or do minimal.
    // For search results, we'll map what we have.

    return (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      date: new Date(item.snippet.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      channelTitle: item.snippet.channelTitle
    }));

  } catch (e) {
    console.error("Search failed", e);
    return [];
  }
}

export async function getLatestVideos(playlistId: string = DEFAULT_PLAYLIST_ID, pageToken?: string): Promise<PaginatedResult<Video>> {
  if (!API_KEY || playlistId.includes("xxxx")) {
    return { items: [] };
  }

  try {
    let playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`;
    if (pageToken) {
      playlistUrl += `&pageToken=${pageToken}`;
    }

    const res = await fetch(playlistUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Playlist Fetch Failed: ${res.status}`);

    const playlistData = await res.json();
    if (!playlistData.items || playlistData.items.length === 0) return { items: [] };

    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');

    // Cache Channel ID if first request
    if (playlistData.items[0]?.snippet?.channelId && !CACHED_CHANNEL_ID) {
      CACHED_CHANNEL_ID = playlistData.items[0].snippet.channelId;
    }

    // Fetch details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
    const detailsRes = await fetch(detailsUrl, { next: { revalidate: 3600 } });

    const detailsMap = new Map();
    if (detailsRes.ok) {
      const detailsData = await detailsRes.json();
      detailsData.items.forEach((item: any) => detailsMap.set(item.id, item));
    }

    const videos = playlistData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const details = detailsMap.get(videoId);

      const publishedAt = item.snippet.publishedAt;
      const date = new Date(publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

      return {
        id: videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: item.snippet.thumbnails?.maxresdefault?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
        date: date,
        duration: details ? formatDuration(details.contentDetails.duration) : "",
        views: details ? formatViews(details.statistics.viewCount) : "",
        likes: details ? formatViews(details.statistics.likeCount) : "",
        commentCount: details ? formatViews(details.statistics.commentCount) : "",
        tags: details?.snippet?.tags || []
      };
    });

    return {
      items: videos,
      nextPageToken: playlistData.nextPageToken
    };

  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return { items: [] };
  }
}

const MOCK_VIDEOS: Video[] = [
  { id: "1", title: "Institutional Architectural Thought", url: "#", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", date: "Oct 24, 2024", duration: "45:12", views: "1.2k" },
  { id: "2", title: "Building for Durability", url: "#", thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", date: "Oct 18, 2024", duration: "28:05", views: "856" },
  { id: "3", title: "The Architectural Gateway", url: "#", thumbnail: "https://images.unsplash.com/photo-1470723710355-95304d8aece4", date: "Sep 30, 2024", duration: "1:02:10", views: "3.4k" },
];
