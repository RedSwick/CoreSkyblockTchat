-- À exécuter si tu avais déjà lancé schema.sql avant l'ajout de : l'ajustement
-- calorique auto, le bilan hebdo et le suivi mensurations/photos de progression.
-- Si tu pars d'un projet neuf, ignore ce fichier : schema.sql contient déjà tout.

alter table profiles add column if not exists calorie_adjustment_kcal numeric not null default 0;
alter table profiles add column if not exists calorie_adjustment_updated_at timestamptz;

create table if not exists body_measurements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  logged_date date not null default current_date,
  waist_cm numeric,
  chest_cm numeric,
  arm_cm numeric,
  thigh_cm numeric,
  photo_path text,
  notes text,
  created_at timestamptz not null default now(),
  unique (profile_id, logged_date)
);

alter table body_measurements enable row level security;

create policy "body_measurements_select" on body_measurements for select using (is_own_or_partner(profile_id));
create policy "body_measurements_write" on body_measurements for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "progress_photos_select" on storage.objects for select using (
  bucket_id = 'progress-photos' and is_own_or_partner((storage.foldername(name))[1]::uuid)
);
create policy "progress_photos_insert" on storage.objects for insert with check (
  bucket_id = 'progress-photos' and (storage.foldername(name))[1]::uuid = auth.uid()
);
create policy "progress_photos_delete" on storage.objects for delete using (
  bucket_id = 'progress-photos' and (storage.foldername(name))[1]::uuid = auth.uid()
);
