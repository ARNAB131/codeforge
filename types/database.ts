-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique not null,
    full_name text,
    avatar_url text,
    bio text,
    location text,
    website text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- =========================================================
-- REPOSITORIES
-- =========================================================

create table if not exists public.repositories (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    slug text not null,
    description text,
    visibility text not null default 'public'
        check (visibility in ('public', 'private')),
    language text default 'TypeScript',
    readme text default '# New Repository',
    default_branch text not null default 'main',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint repository_name_length
        check (char_length(name) between 1 and 100),

    constraint repository_owner_slug_unique
        unique (owner_id, slug)
);

-- =========================================================
-- STARS
-- =========================================================

create table if not exists public.repository_stars (
    id uuid primary key default gen_random_uuid(),
    repository_id uuid not null
        references public.repositories(id) on delete cascade,
    user_id uuid not null
        references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),

    constraint unique_repository_star
        unique (repository_id, user_id)
);

-- =========================================================
-- PROFILE CREATION FUNCTION
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
    generated_username text;
begin
    generated_username :=
        coalesce(
            nullif(new.raw_user_meta_data ->> 'username', ''),
            split_part(new.email, '@', 1)
        );

    generated_username :=
        lower(
            regexp_replace(
                generated_username,
                '[^a-zA-Z0-9_-]',
                '',
                'g'
            )
        );

    if exists (
        select 1
        from public.profiles
        where username = generated_username
    ) then
        generated_username :=
            generated_username || '-' ||
            substring(new.id::text from 1 for 6);
    end if;

    insert into public.profiles (
        id,
        username,
        full_name,
        avatar_url
    )
    values (
        new.id,
        generated_username,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'avatar_url'
    );

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- UPDATED AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists repositories_set_updated_at
on public.repositories;

create trigger repositories_set_updated_at
before update on public.repositories
for each row execute function public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.repositories enable row level security;
alter table public.repository_stars enable row level security;

-- Profiles can be viewed publicly
create policy "Profiles are publicly readable"
on public.profiles
for select
using (true);

-- Users can update only their profile
create policy "Users can update their profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Public repositories can be read by everyone.
-- Private repositories can only be read by their owners.
create policy "Repositories are readable"
on public.repositories
for select
using (
    visibility = 'public'
    or owner_id = auth.uid()
);

-- Authenticated users can create their repositories
create policy "Users can create repositories"
on public.repositories
for insert
to authenticated
with check (owner_id = auth.uid());

-- Owners can update their repositories
create policy "Owners can update repositories"
on public.repositories
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Owners can delete repositories
create policy "Owners can delete repositories"
on public.repositories
for delete
to authenticated
using (owner_id = auth.uid());

-- Repository stars are publicly readable
create policy "Stars are publicly readable"
on public.repository_stars
for select
using (true);

-- Logged-in users can star repositories
create policy "Users can create stars"
on public.repository_stars
for insert
to authenticated
with check (user_id = auth.uid());

-- Users can remove their stars
create policy "Users can remove their stars"
on public.repository_stars
for delete
to authenticated
using (user_id = auth.uid());

-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists repositories_owner_id_index
on public.repositories(owner_id);

create index if not exists repositories_slug_index
on public.repositories(slug);

create index if not exists repositories_visibility_index
on public.repositories(visibility);

create index if not exists repository_stars_repository_id_index
on public.repository_stars(repository_id);

create index if not exists repository_stars_user_id_index
on public.repository_stars(user_id);
