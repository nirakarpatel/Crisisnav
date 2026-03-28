import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Configured with your Supabase project credentials
const SUPABASE_URL = 'https://nlzfnxtbzbzajoiqfcxn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5semZueHRiemJ6YWpvaXFmY3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTQ4NjAsImV4cCI6MjA5MDI3MDg2MH0.7Fbsr_WUMUE-HpRVIPiyJnpQS2O5E9VHotb67B-PY6E'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
