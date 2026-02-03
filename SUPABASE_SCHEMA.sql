-- ==========================================
-- PRODUCTION HARDENED SCHEMA // TTA
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to Auth)
-- Stores admin metadata and roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMPTZ DEFAULT now(),
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer'))
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- 3. SUBMISSIONS TABLE (Enhanced)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    type TEXT NOT NULL CHECK (type IN ('join', 'event')),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    event_id TEXT, -- Link to Airtable Record ID
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived', 'rejected')),
    internal_notes TEXT
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_submissions_email ON public.submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON public.submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Only authenticated staff can see submissions
CREATE POLICY "Staff can view submissions" 
    ON public.submissions FOR SELECT 
    TO authenticated 
    USING (true);

-- Authenticated staff can update status or notes
CREATE POLICY "Staff can update submissions" 
    ON public.submissions FOR UPDATE 
    TO authenticated 
    USING (true);

-- Anyone can submit (for public forms)
CREATE POLICY "Public can insert submissions" 
    ON public.submissions FOR INSERT 
    WITH CHECK (true);

-- 4. STORAGE POLICIES (for 'media' bucket)
-- Note: Create the 'media' bucket manually in the dashboard first.
-- These policies assume a bucket named 'media' exists.

/* 
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;
*/

-- Allow public read access to media
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated admins to upload/modify
CREATE POLICY "Admin Upload" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Admin Update" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'media');

CREATE POLICY "Admin Delete" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'media');

-- 5. AUTOMATIC PROFILE CREATION
-- Creates a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_submissions_modtime
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE OR REPLACE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
