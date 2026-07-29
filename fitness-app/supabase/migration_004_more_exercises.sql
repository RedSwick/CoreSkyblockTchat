-- À exécuter si tu avais déjà lancé schema.sql avant l'ajout de ces
-- exercices (fessiers/ischio-jambiers/mollets/triceps/biceps/abdos étaient
-- un peu justes en variété). Si tu pars d'un projet neuf, ignore ce fichier :
-- schema.sql contient déjà tout.

insert into exercises (name, muscle_group, equipment) values
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
