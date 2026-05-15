create extension if not exists "pgcrypto";

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  harness text not null default 'unknown',
  agent_name text,
  status text not null default 'recording' check (status in ('recording', 'processing', 'replay_ready', 'failed', 'stopped')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_ms integer,
  workspace_name text,
  source_type text not null default 'mcp' check (source_type in ('mcp', 'slash_command', 'simulator', 'json_import', 'adapter')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  seq integer not null,
  timestamp timestamptz not null default now(),
  type text not null,
  category text not null default 'system' check (category in ('intent', 'workspace', 'execution', 'review', 'state', 'system')),
  source text,
  actor text not null default 'agent',
  workspace_path text,
  related_file text,
  related_command text,
  payload_json jsonb not null default '{}'::jsonb,
  redacted_payload_json jsonb not null default '{}'::jsonb,
  display_text text,
  sensitivity text not null default 'none' check (sensitivity in ('none', 'low', 'medium', 'high')),
  redaction_applied boolean not null default false,
  created_at timestamptz not null default now(),
  unique (session_id, seq)
);

create table public.markers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  seq integer not null,
  timestamp timestamptz not null default now(),
  label text not null,
  category text not null,
  reason text,
  needs_review boolean not null default true,
  severity text not null default 'notice' check (severity in ('info', 'notice', 'important', 'sensitive')),
  created_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  start_seq integer not null,
  end_seq integer,
  start_time_ms integer,
  end_time_ms integer,
  title text not null,
  summary text,
  created_at timestamptz not null default now()
);

create table public.session_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.behavior_summary (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  read_count integer not null default 0,
  edit_count integer not null default 0,
  run_count integer not null default 0,
  fail_count integer not null default 0,
  fix_count integer not null default 0,
  verify_count integer not null default 0,
  review_count integer not null default 0,
  important_files_json jsonb not null default '[]'::jsonb,
  important_commands_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.replay_metadata (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  chapters_json jsonb not null default '[]'::jsonb,
  markers_json jsonb not null default '[]'::jsonb,
  behavior_summary_json jsonb not null default '{}'::jsonb,
  notes text,
  redaction_summary_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index sessions_user_id_idx on public.sessions(user_id);
create index sessions_status_idx on public.sessions(status);
create index events_session_id_seq_idx on public.events(session_id, seq);
create index markers_session_id_seq_idx on public.markers(session_id, seq);
create index chapters_session_id_start_seq_idx on public.chapters(session_id, start_seq);
create index api_keys_user_id_idx on public.api_keys(user_id);

alter table public.sessions enable row level security;
alter table public.events enable row level security;
alter table public.markers enable row level security;
alter table public.chapters enable row level security;
alter table public.session_notes enable row level security;
alter table public.behavior_summary enable row level security;
alter table public.replay_metadata enable row level security;
alter table public.api_keys enable row level security;

create policy "owners can manage sessions"
  on public.sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "public can read replay sessions"
  on public.sessions for select
  using (true);

create policy "owners can manage events"
  on public.events for all
  using (exists (
    select 1 from public.sessions
    where sessions.id = events.session_id
      and sessions.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.sessions
    where sessions.id = events.session_id
      and sessions.user_id = auth.uid()
  ));

create policy "public can read replay events"
  on public.events for select
  using (true);

create policy "public can read markers"
  on public.markers for select
  using (true);

create policy "public can read chapters"
  on public.chapters for select
  using (true);

create policy "public can read session notes"
  on public.session_notes for select
  using (true);

create policy "public can read behavior summary"
  on public.behavior_summary for select
  using (true);

create policy "public can read replay metadata"
  on public.replay_metadata for select
  using (true);

create policy "owners can manage api keys"
  on public.api_keys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owners can manage markers"
  on public.markers for all
  using (exists (
    select 1 from public.sessions
    where sessions.id = markers.session_id
      and sessions.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.sessions
    where sessions.id = markers.session_id
      and sessions.user_id = auth.uid()
  ));

create policy "owners can manage chapters"
  on public.chapters for all
  using (exists (
    select 1 from public.sessions
    where sessions.id = chapters.session_id
      and sessions.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.sessions
    where sessions.id = chapters.session_id
      and sessions.user_id = auth.uid()
  ));

create policy "owners can manage session notes"
  on public.session_notes for all
  using (exists (
    select 1 from public.sessions
    where sessions.id = session_notes.session_id
      and sessions.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.sessions
    where sessions.id = session_notes.session_id
      and sessions.user_id = auth.uid()
  ));

create policy "owners can manage behavior summary"
  on public.behavior_summary for all
  using (exists (
    select 1 from public.sessions
    where sessions.id = behavior_summary.session_id
      and sessions.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.sessions
    where sessions.id = behavior_summary.session_id
      and sessions.user_id = auth.uid()
  ));

create policy "owners can manage replay metadata"
  on public.replay_metadata for all
  using (exists (
    select 1 from public.sessions
    where sessions.id = replay_metadata.session_id
      and sessions.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.sessions
    where sessions.id = replay_metadata.session_id
      and sessions.user_id = auth.uid()
  ));
