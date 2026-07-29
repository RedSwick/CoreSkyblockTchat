-- À exécuter si tu avais déjà lancé schema.sql avant l'ajout du suivi
-- "shake protéiné quotidien". Si tu pars d'un projet neuf, ignore ce fichier :
-- schema.sql contient déjà cette colonne.

alter table profiles add column if not exists takes_protein_shake boolean not null default false;
