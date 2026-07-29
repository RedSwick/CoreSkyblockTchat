-- Fitness Couple App - schema Supabase
-- A executer une fois dans SQL editor du projet Supabase (Database > SQL Editor).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Couples : lie deux profils via un code d'invitation partage entre les deux
-- ---------------------------------------------------------------------------
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null default substr(md5(random()::text), 1, 6),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profiles : 1 ligne par utilisateur (etend auth.users)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Moi',
  sex text check (sex in ('male', 'female', 'other')),
  height_cm numeric,
  birth_date date,
  activity_level text not null default 'moderate'
    check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal text not null default 'maintain'
    check (goal in ('gain_muscle', 'lose_fat_tone', 'maintain')),
  target_weight_kg numeric,
  training_days_per_week int not null default 4,
  couple_id uuid references couples(id) on delete set null,
  onboarded boolean not null default false,
  takes_protein_shake boolean not null default false,
  has_physical_job boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles add column if not exists takes_protein_shake boolean not null default false;
alter table profiles add column if not exists has_physical_job boolean not null default false;

-- Cree automatiquement un profil vide a l'inscription
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Moi'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Helper : est-ce mon propre profil ou celui de mon/ma partenaire ?
-- ---------------------------------------------------------------------------
create or replace function is_own_or_partner(target_profile_id uuid)
returns boolean language sql stable as $$
  select target_profile_id = auth.uid()
     or exists (
       select 1 from profiles me
       join profiles them on them.couple_id = me.couple_id
       where me.id = auth.uid()
         and them.id = target_profile_id
         and me.couple_id is not null
     );
$$;

-- ---------------------------------------------------------------------------
-- Poids corporel
-- ---------------------------------------------------------------------------
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  logged_date date not null default current_date,
  weight_kg numeric not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (profile_id, logged_date)
);

-- ---------------------------------------------------------------------------
-- Bibliotheque d'exercices (partagee)
-- ---------------------------------------------------------------------------
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text not null,
  equipment text not null default 'gym' check (equipment in ('gym', 'home', 'both')),
  is_custom boolean not null default false,
  created_by uuid references profiles(id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Programmes d'entrainement
-- ---------------------------------------------------------------------------
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  location text not null check (location in ('home', 'gym')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  day_label text not null,
  day_order int not null default 0
);

create table if not exists program_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references program_days(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  order_index int not null default 0,
  target_sets int not null default 3,
  target_reps_min int not null default 8,
  target_reps_max int not null default 12,
  target_rest_sec int not null default 90,
  notes text
);

-- ---------------------------------------------------------------------------
-- Seances et series realisees
-- ---------------------------------------------------------------------------
create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  program_day_id uuid references program_days(id) on delete set null,
  session_date date not null default current_date,
  location text not null default 'gym' check (location in ('home', 'gym')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  notes text
);

create table if not exists session_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references workout_sessions(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  set_number int not null,
  weight_kg numeric,
  reps int,
  rpe numeric,
  is_pr boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Hydratation
-- ---------------------------------------------------------------------------
create table if not exists hydration_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  logged_date date not null default current_date,
  amount_ml int not null,
  logged_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table couples enable row level security;
alter table profiles enable row level security;
alter table weight_logs enable row level security;
alter table exercises enable row level security;
alter table programs enable row level security;
alter table program_days enable row level security;
alter table program_exercises enable row level security;
alter table workout_sessions enable row level security;
alter table session_sets enable row level security;
alter table hydration_logs enable row level security;

-- couples : lisible par tout utilisateur connecte (necessaire pour rejoindre
-- via un code d'invitation), pas de donnee sensible dedans.
create policy "couples_select" on couples for select using (auth.role() = 'authenticated');
create policy "couples_insert" on couples for insert with check (auth.role() = 'authenticated');

-- profiles
create policy "profiles_select" on profiles for select using (is_own_or_partner(id));
create policy "profiles_update" on profiles for update using (id = auth.uid());
create policy "profiles_insert" on profiles for insert with check (id = auth.uid());

-- weight_logs
create policy "weight_logs_select" on weight_logs for select using (is_own_or_partner(profile_id));
create policy "weight_logs_write" on weight_logs for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- exercises (bibliotheque partagee en lecture)
create policy "exercises_select" on exercises for select using (true);
create policy "exercises_insert" on exercises for insert with check (created_by = auth.uid());
create policy "exercises_update" on exercises for update using (created_by = auth.uid());

-- programs
create policy "programs_select" on programs for select using (is_own_or_partner(profile_id));
create policy "programs_write" on programs for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- program_days
create policy "program_days_select" on program_days for select using (
  is_own_or_partner((select profile_id from programs where programs.id = program_days.program_id))
);
create policy "program_days_write" on program_days for all using (
  exists (select 1 from programs where programs.id = program_days.program_id and programs.profile_id = auth.uid())
) with check (
  exists (select 1 from programs where programs.id = program_days.program_id and programs.profile_id = auth.uid())
);

-- program_exercises
create policy "program_exercises_select" on program_exercises for select using (
  is_own_or_partner((
    select programs.profile_id from program_days
    join programs on programs.id = program_days.program_id
    where program_days.id = program_exercises.program_day_id
  ))
);
create policy "program_exercises_write" on program_exercises for all using (
  exists (
    select 1 from program_days
    join programs on programs.id = program_days.program_id
    where program_days.id = program_exercises.program_day_id and programs.profile_id = auth.uid()
  )
) with check (
  exists (
    select 1 from program_days
    join programs on programs.id = program_days.program_id
    where program_days.id = program_exercises.program_day_id and programs.profile_id = auth.uid()
  )
);

-- workout_sessions
create policy "workout_sessions_select" on workout_sessions for select using (is_own_or_partner(profile_id));
create policy "workout_sessions_write" on workout_sessions for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- session_sets
create policy "session_sets_select" on session_sets for select using (
  is_own_or_partner((select profile_id from workout_sessions where workout_sessions.id = session_sets.session_id))
);
create policy "session_sets_write" on session_sets for all using (
  exists (select 1 from workout_sessions where workout_sessions.id = session_sets.session_id and workout_sessions.profile_id = auth.uid())
) with check (
  exists (select 1 from workout_sessions where workout_sessions.id = session_sets.session_id and workout_sessions.profile_id = auth.uid())
);

-- hydration_logs
create policy "hydration_logs_select" on hydration_logs for select using (is_own_or_partner(profile_id));
create policy "hydration_logs_write" on hydration_logs for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Exercices de base (bibliotheque commune, maison + salle)
-- ---------------------------------------------------------------------------
insert into exercises (name, muscle_group, equipment) values
  ('Développé couché barre', 'Pectoraux', 'gym'),
  ('Développé couché haltères', 'Pectoraux', 'both'),
  ('Développé incliné haltères', 'Pectoraux', 'both'),
  ('Pompes', 'Pectoraux', 'home'),
  ('Pompes lestées', 'Pectoraux', 'home'),
  ('Écarté poulie / haltères', 'Pectoraux', 'both'),
  ('Dips', 'Pectoraux', 'both'),
  ('Tractions pronation', 'Dos', 'both'),
  ('Tractions supination', 'Dos', 'both'),
  ('Tirage vertical poulie', 'Dos', 'gym'),
  ('Tirage horizontal poulie', 'Dos', 'gym'),
  ('Rowing barre', 'Dos', 'gym'),
  ('Rowing haltère unilatéral', 'Dos', 'both'),
  ('Rowing élastique', 'Dos', 'home'),
  ('Soulevé de terre', 'Dos / Jambes', 'gym'),
  ('Développé militaire barre', 'Épaules', 'gym'),
  ('Développé militaire haltères', 'Épaules', 'both'),
  ('Élévations latérales', 'Épaules', 'both'),
  ('Élévations frontales', 'Épaules', 'both'),
  ('Oiseau / élévations arrière', 'Épaules', 'both'),
  ('Curl biceps barre', 'Biceps', 'gym'),
  ('Curl biceps haltères', 'Biceps', 'both'),
  ('Curl marteau', 'Biceps', 'both'),
  ('Extension triceps poulie', 'Triceps', 'gym'),
  ('Extension triceps haltère', 'Triceps', 'both'),
  ('Dips triceps (banc)', 'Triceps', 'home'),
  ('Squat barre', 'Jambes', 'gym'),
  ('Squat gobelet haltère', 'Jambes', 'both'),
  ('Squat au poids du corps', 'Jambes', 'home'),
  ('Presse à cuisses', 'Jambes', 'gym'),
  ('Fentes marchées', 'Jambes', 'both'),
  ('Hip thrust', 'Fessiers', 'both'),
  ('Leg curl allongé', 'Ischio-jambiers', 'gym'),
  ('Extension mollets debout', 'Mollets', 'both'),
  ('Gainage planche', 'Abdominaux', 'home'),
  ('Crunch', 'Abdominaux', 'home'),
  ('Relevé de jambes', 'Abdominaux', 'home'),
  ('Corde à sauter', 'Cardio', 'both'),
  ('Vélo elliptique / rameur', 'Cardio', 'gym'),
  ('Marche rapide / course', 'Cardio', 'both'),
  ('Fentes bulgares', 'Fessiers', 'both'),
  ('Hip thrust unilatéral', 'Fessiers', 'both'),
  ('Abduction hanche', 'Fessiers', 'both'),
  ('Soulevé de terre jambes tendues', 'Ischio-jambiers', 'both'),
  ('Leg curl assis', 'Ischio-jambiers', 'gym'),
  ('Extension mollets assis', 'Mollets', 'gym'),
  ('Presse à mollets', 'Mollets', 'gym'),
  ('Extension triceps barre au sol', 'Triceps', 'both'),
  ('Curl pupitre', 'Biceps', 'gym'),
  ('Gainage latéral', 'Abdominaux', 'home'),
  ('Rotation russe', 'Abdominaux', 'both')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Messages entre partenaires (encouragements, rappels, notes libres)
-- ---------------------------------------------------------------------------
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

-- Active le temps réel pour que la cloche se mette à jour sans recharger la page
alter publication supabase_realtime add table messages;
