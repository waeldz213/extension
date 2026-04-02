-- ============================================
-- DSFGenius – Supabase Schema
-- Exécuter ce SQL dans l'éditeur SQL de Supabase
-- ============================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- Table leads
create table if not exists public.leads (
  id          uuid primary key default uuid_generate_v4(),
  company     text not null,
  website     text not null default '',
  contact_name  text not null default '',
  contact_email text not null default '',
  phone       text,
  heat_score  integer not null default 0,
  status      text not null default 'new'
                check (status in ('new','contacted','meeting','proposal','signed','lost')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast status filtering (Kanban)
create index if not exists idx_leads_status on public.leads (status);

-- Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.leads;
create trigger set_updated_at
  before update on public.leads
  for each row
  execute function public.handle_updated_at();

-- Row Level Security (optional – enable if you add auth)
-- alter table public.leads enable row level security;
-- create policy "Enable all for anon" on public.leads for all using (true);
