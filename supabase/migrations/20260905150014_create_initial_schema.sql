create table public.plans (
  id uuid primary key default gen_random_uuid(),

  owner_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  share_token_hash text not null unique,

  title text not null,
  description text,

  start_date date not null,
  end_date date not null,

  duration_minutes integer,
  duration_days integer,

  response_deadline timestamptz not null,

  status text not null default 'open'
    check (status in ('open', 'finalising', 'decided', 'expired')),

  selected_start timestamptz,
  selected_end timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (end_date >= start_date),

  check (
    (duration_minutes is not null and duration_days is null)
    or
    (duration_minutes is null and duration_days is not null)
  )
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),

  plan_id uuid not null
    references public.plans(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null,

  submitted_at timestamptz,

  created_at timestamptz not null default now(),

  unique (plan_id, user_id)
);

create table public.availability (
  id uuid primary key default gen_random_uuid(),

  participant_id uuid not null
    references public.participants(id)
    on delete cascade,

  available_date date not null,

  status text not null
    check (status in ('free', 'partial', 'unavailable')),

  start_time time,
  end_time time,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (participant_id, available_date),

  check (
    status <> 'partial'
    or
    (start_time is not null and end_time is not null)
  ),

  check (
    start_time is null
    or end_time is null
    or end_time > start_time
  )
);

create table public.join_codes (
  id uuid primary key default gen_random_uuid(),

  plan_id uuid not null
    references public.plans(id)
    on delete cascade,

  code text not null,

  status text not null default 'active'
    check (status in ('active', 'cooldown', 'released')),

  created_at timestamptz not null default now(),
  released_at timestamptz
);

create unique index join_codes_reserved_code_unique
on public.join_codes (code)
where status in ('active', 'cooldown');