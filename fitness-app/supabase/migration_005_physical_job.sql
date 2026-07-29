-- À exécuter si tu avais déjà lancé schema.sql avant l'ajout du suivi
-- "métier physique" (utilisé pour l'objectif d'hydratation). Si tu pars d'un
-- projet neuf, ignore ce fichier : schema.sql contient déjà cette colonne.

alter table profiles add column if not exists has_physical_job boolean not null default false;
