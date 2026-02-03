# The Thinking Architect (TTA) Website

High-performance, institutional portal for architecture professionals.

## 🏗️ Hybrid Architecture

This project uses a dual-backend strategy for maximum performance and flexibility.

1.  **Public CMS (Airtable)**: Used for content that requires frequent updates (Events, Highlights, Global Settings).
2.  **Application Database (Supabase)**: Used for secure data, administrative authentication, and internal registries (Submissions).

---

## 🔐 Administrative Access

Access the **Command Center** at `/dashboard`.

- **Authentication**: Managed via Supabase Auth.
- **Registries**: View and export community/event submissions to CSV.
- **Content Creators**: Create, edit, and delete Events and Highlights directly from the dashboard.
- **Media Management**: Powered by Supabase Storage, images are automatically handled during content creation.

---

## 🛠️ Environment Configuration

Ensure your `.env.local` contains the following keys:

### Airtable (CMS)
- `AIRTABLE_API_KEY`: Your personal access token.
- `AIRTABLE_BASE_ID`: The unique ID for the TTA base.

### Supabase (App DB)
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: (Internal use for maintenance).

---

## 🚀 Development

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Start dev server: `npm run dev`.

## 📜 Deployment

The site is configured for SSR with efficient caching. Deployment is handled via **Render** (Node.js/Next.js environment).

---

© 2026 The Thinking Architect. All Intelligence Reserved.
