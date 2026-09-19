-- Katie: 1인 사업가 비즈니스 매니저 - Supabase 스키마
-- Supabase 프로젝트의 SQL Editor에서 이 파일 전체를 실행하세요.

create extension if not exists "pgcrypto";

-- 사업자 프로필 (설정 페이지에서 사용, 견적서/청구서 헤더에 표시)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  business_name text not null default '',
  owner_name text not null default '',
  business_number text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  bank_info text not null default '',
  updated_at timestamptz not null default now()
);

-- 거래처 (CRM)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  business_number text,
  memo text,
  created_at timestamptz not null default now()
);

-- 매출/지출 내역
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  date date not null,
  amount numeric not null check (amount > 0),
  category text not null,
  client_id uuid references public.clients (id) on delete set null,
  memo text,
  created_at timestamptz not null default now()
);

-- 견적서/청구서 (품목은 jsonb 배열로 저장)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('quote', 'invoice')),
  doc_number text not null,
  client_id uuid not null references public.clients (id) on delete cascade,
  issue_date date not null,
  due_date date,
  items jsonb not null default '[]'::jsonb,
  tax_rate numeric not null default 10,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'cancelled')),
  memo text,
  created_at timestamptz not null default now()
);

-- 할 일/일정
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  memo text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists clients_user_id_idx on public.clients (user_id);
create index if not exists documents_user_id_idx on public.documents (user_id);
create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- Row Level Security: 각 사용자는 자신의 데이터만 조회/수정 가능
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.transactions enable row level security;
alter table public.documents enable row level security;
alter table public.tasks enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = user_id);

create policy "clients_select_own" on public.clients for select using (auth.uid() = user_id);
create policy "clients_insert_own" on public.clients for insert with check (auth.uid() = user_id);
create policy "clients_update_own" on public.clients for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "clients_delete_own" on public.clients for delete using (auth.uid() = user_id);

create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

create policy "documents_select_own" on public.documents for select using (auth.uid() = user_id);
create policy "documents_insert_own" on public.documents for insert with check (auth.uid() = user_id);
create policy "documents_update_own" on public.documents for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "documents_delete_own" on public.documents for delete using (auth.uid() = user_id);

create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);
