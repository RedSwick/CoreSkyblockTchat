-- À exécuter une seule fois si tu avais déjà lancé supabase/schema.sql avant
-- l'ajout de la messagerie couple. Si tu pars d'un projet Supabase tout neuf,
-- ignore ce fichier : supabase/schema.sql contient déjà tout, y compris cette
-- table.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  from_profile_id uuid not null references profiles(id) on delete cascade,
  to_profile_id uuid not null references profiles(id) on delete cascade,
  kind text not null default 'custom' check (kind in ('custom', 'pr_cheer', 'hydration_nudge')),
  body text not null,
  related_exercise_id uuid references exercises(id),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_to_profile_idx on messages (to_profile_id, created_at desc);
create index if not exists messages_couple_idx on messages (couple_id, created_at desc);

alter table messages enable row level security;

create policy "messages_select" on messages for select using (
  from_profile_id = auth.uid() or to_profile_id = auth.uid()
);
create policy "messages_insert" on messages for insert with check (
  from_profile_id = auth.uid() and is_own_or_partner(to_profile_id)
);
create policy "messages_update" on messages for update using (to_profile_id = auth.uid());

alter publication supabase_realtime add table messages;
