import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase 환경변수가 설정되지 않았습니다. .env.example을 참고해 .env 파일을 만들어주세요.',
  );
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder');
