export interface ExerciseInfo {
  purpose: string
  steps: string[]
  cue: string
  mistakes: string[]
}

export const EXERCISE_INFO: Record<string, ExerciseInfo> = {
  'Développé couché barre': {
    purpose: "L'exercice de base pour les pectoraux : masse et force sur le haut du corps, implique aussi épaules et triceps.",
    steps: [
      'Allonge-toi sur le banc, pieds bien ancrés au sol, cambrure naturelle du dos.',
      'Prise un peu plus large que les épaules, la barre au-dessus des épaules (pas du cou).',
      "Descends la barre en contrôlant jusqu'à toucher légèrement le bas des pectoraux.",
      "Pousse en gardant les coudes à ~45° du buste, pas complètement écartés.",
    ],
    cue: "Inspire en descendant, contracte les pectoraux et souffle en poussant vers le haut. Serre les omoplates ensemble avant de commencer.",
    mistakes: ['Rebondir la barre sur la poitrine', 'Décoller les fesses du banc', 'Coudes à 90° (stress les épaules)'],
  },
  'Développé couché haltères': {
    purpose: 'Comme le développé barre mais avec plus d\'amplitude et de travail unilatéral, bon pour corriger les déséquilibres.',
    steps: [
      'Assieds-toi avec les haltères sur les cuisses, puis allonge-toi en les amenant au niveau des épaules.',
      'Coudes à ~45°, poignets alignés au-dessus des coudes.',
      'Descends jusqu\'à sentir un bel étirement dans les pectoraux.',
      'Pousse les deux haltères vers le haut en les rapprochant légèrement au sommet.',
    ],
    cue: 'Contracte les pectoraux en haut du mouvement sans claquer les haltères entre eux.',
    mistakes: ['Descendre trop vite et perdre le contrôle', 'Cambrer excessivement le bas du dos'],
  },
  'Développé incliné haltères': {
    purpose: 'Cible le haut des pectoraux, complète le développé couché plat.',
    steps: [
      'Banc incliné à 30-45°, haltères au niveau des épaules.',
      'Descends en contrôlant jusqu\'à l\'étirement des pectoraux hauts.',
      'Pousse vers le haut et légèrement vers l\'intérieur.',
    ],
    cue: 'Vise le plafond avec un léger angle vers l\'arrière, pas droit au-dessus du visage.',
    mistakes: ['Inclinaison trop forte (>45°) qui transfère le travail aux épaules'],
  },
  Pompes: {
    purpose: 'Renforce les pectoraux, triceps et épaules au poids du corps, gainage abdominal en prime.',
    steps: [
      'Mains légèrement plus larges que les épaules, corps aligné tête-talons.',
      'Descends en gardant les coudes à ~45°, poitrine proche du sol.',
      'Pousse en gardant le gainage jusqu\'en haut.',
    ],
    cue: 'Serre les fessiers et les abdos pour garder le corps bien droit, comme une planche.',
    mistakes: ['Bassin qui tombe (dos creux)', 'Amplitude trop courte'],
  },
  'Pompes lestées': {
    purpose: 'Version surchargée des pompes (gilet lesté, disque sur le dos) pour continuer à progresser en force.',
    steps: ['Même exécution que la pompe classique avec une charge additionnelle stable sur le haut du dos.'],
    cue: 'Garde le même gainage que sans charge, ne précipite pas le mouvement.',
    mistakes: ['Charge mal fixée qui bouge pendant le mouvement'],
  },
  'Écarté poulie / haltères': {
    purpose: "Isole les pectoraux en étirement, bon complément aux mouvements de poussée pour la définition et l'amplitude.",
    steps: [
      'Bras légèrement fléchis, ouvre les bras sur les côtés en gardant l\'angle du coude fixe.',
      'Descends jusqu\'à sentir l\'étirement des pectoraux.',
      'Ramène les bras devant toi comme pour enlacer un tronc d\'arbre.',
    ],
    cue: 'Le mouvement part des épaules, pas des coudes : imagine serrer quelque chose entre tes bras.',
    mistakes: ['Trop de poids qui force à plier les coudes comme un développé'],
  },
  Dips: {
    purpose: 'Excellent pour pectoraux bas et triceps, exercice de poussée verticale au poids du corps.',
    steps: [
      'Bras tendus sur les barres parallèles, penche légèrement le buste en avant pour cibler les pectoraux.',
      'Descends en pliant les coudes jusqu\'à ~90°.',
      'Pousse pour remonter sans verrouiller brutalement les coudes.',
    ],
    cue: 'Penche-toi en avant pour les pectoraux, reste vertical pour cibler plus les triceps.',
    mistakes: ['Descendre trop bas et stresser les épaules', 'Épaules qui remontent vers les oreilles'],
  },
  'Tractions pronation': {
    purpose: 'Le mouvement de tirage vertical de référence : dos (grand dorsal) et biceps.',
    steps: [
      'Prise mains légèrement plus large que les épaules, paumes vers l\'avant.',
      'Tire en amenant les coudes vers le bas et l\'arrière, poitrine vers la barre.',
      'Descends en contrôlant jusqu\'à extension complète des bras.',
    ],
    cue: 'Pense à "ramener les coudes vers les poches arrière" plutôt qu\'à tirer avec les bras.',
    mistakes: ['Balancer le corps (kipping non contrôlé)', 'Amplitude incomplète'],
  },
  'Tractions supination': {
    purpose: 'Variante paumes vers soi qui sollicite davantage les biceps en plus du dos.',
    steps: ['Prise mains largeur épaules, paumes vers toi.', 'Tire en gardant les coudes proches du corps.'],
    cue: 'Contracte les biceps en plus du dos pendant la traction.',
    mistakes: ['Prise trop large qui limite l\'amplitude'],
  },
  'Tirage vertical poulie': {
    purpose: 'Alternative aux tractions pour construire le dos progressivement avec une charge ajustable.',
    steps: [
      'Assis, cuisses bloquées, prise large.',
      'Tire la barre vers le haut de la poitrine en amenant les coudes vers le bas.',
      'Remonte en contrôlant, bras tendus.',
    ],
    cue: 'Sors la poitrine et tire avec le dos, pas seulement les bras.',
    mistakes: ['Se pencher très en arrière pour "tricher" le mouvement'],
  },
  'Tirage horizontal poulie': {
    purpose: 'Travaille le milieu du dos (rhomboïdes, trapèzes) en tirage horizontal.',
    steps: [
      'Assis, dos droit, prise la poignée.',
      'Tire vers le bas du buste en ramenant les omoplates ensemble.',
      'Reviens en contrôlant, bras tendus, dos toujours droit.',
    ],
    cue: 'Termine chaque répétition en serrant les omoplates 1 seconde.',
    mistakes: ['Dos qui s\'arrondit', 'Se servir de l\'élan du buste'],
  },
  'Rowing barre': {
    purpose: 'Mouvement polyarticulaire majeur pour l\'épaisseur du dos.',
    steps: [
      'Buste penché à ~45°, dos plat, barre en prise pronation.',
      'Tire la barre vers le bas du ventre en ramenant les coudes en arrière.',
      'Redescends en contrôlant sans arrondir le dos.',
    ],
    cue: 'Garde le dos plat comme une planche du début à la fin, gainage abdo actif.',
    mistakes: ['Dos rond (risque lombaire)', 'Se redresser à chaque répétition pour tricher'],
  },
  'Rowing haltère unilatéral': {
    purpose: 'Version un bras, genou et main en appui, permet de bien isoler chaque côté du dos.',
    steps: [
      'Genou et main sur le banc, dos plat et parallèle au sol.',
      'Tire l\'haltère vers la hanche en ramenant le coude en arrière.',
      'Redescends en contrôlant.',
    ],
    cue: 'Imagine allumer une tondeuse à gazon : le coude part vers l\'arrière et le haut.',
    mistakes: ['Tourner le buste pour aider le mouvement'],
  },
  'Rowing élastique': {
    purpose: 'Équivalent du rowing poulie à la maison avec un élastique, pratique quand la salle n\'est pas possible.',
    steps: ['Élastique fixé devant toi, tire vers le buste en ramenant les coudes en arrière, dos droit.'],
    cue: 'Serre les omoplates en fin de mouvement, comme pour le tirage poulie.',
    mistakes: ['Élastique trop souple qui ne crée pas assez de tension'],
  },
  'Soulevé de terre': {
    purpose: 'Mouvement complet postérieur (dos, fessiers, ischio-jambiers) : l\'un des meilleurs pour la force générale.',
    steps: [
      'Pieds largeur bassin, barre au-dessus du milieu du pied.',
      'Dos plat, hanches en arrière, attrape la barre juste à l\'extérieur des jambes.',
      'Pousse le sol avec les jambes en gardant la barre proche du corps jusqu\'à l\'extension complète.',
      'Redescends en reculant les hanches en premier, dos toujours plat.',
    ],
    cue: 'Pense "pousser le sol" plutôt que "tirer la barre" : les jambes initient le mouvement.',
    mistakes: ['Dos qui s\'arrondit', 'Barre qui s\'éloigne du corps', 'Hyperextension du dos en haut'],
  },
  'Développé militaire barre': {
    purpose: 'Développe la force et le volume des épaules (deltoïdes) et des triceps.',
    steps: [
      'Debout, barre au niveau des clavicules, prise un peu plus large que les épaules.',
      'Pousse la barre au-dessus de la tête en gardant le gainage abdominal serré.',
      'Redescends en contrôlant jusqu\'aux clavicules.',
    ],
    cue: 'Serre les fessiers et abdos pour ne pas cambrer excessivement le bas du dos.',
    mistakes: ['Cambrer le dos au lieu de gainer', 'Pousser la barre trop en avant'],
  },
  'Développé militaire haltères': {
    purpose: 'Version haltères, plus d\'amplitude et de travail de stabilisation pour les épaules.',
    steps: ['Haltères au niveau des épaules, pousse vers le haut jusqu\'à extension quasi complète, redescends en contrôlant.'],
    cue: 'Garde le gainage actif, ne cambre pas pour "aider" la poussée.',
    mistakes: ['Utiliser l\'élan des jambes (push press non voulu)'],
  },
  'Élévations latérales': {
    purpose: 'Isole le deltoïde latéral pour des épaules larges et rondes.',
    steps: [
      'Haltères le long du corps, légère flexion des coudes.',
      'Lève les bras sur les côtés jusqu\'à hauteur des épaules.',
      'Redescends en contrôlant, sans relâcher brutalement.',
    ],
    cue: 'Mène le mouvement avec les coudes, comme si tu versais une bouteille en haut du mouvement.',
    mistakes: ['Utiliser l\'élan du buste pour lever plus lourd', 'Monter trop haut au-dessus des épaules'],
  },
  'Élévations frontales': {
    purpose: 'Cible le deltoïde antérieur (avant de l\'épaule).',
    steps: ['Haltère(s) devant les cuisses, lève devant toi jusqu\'à hauteur des épaules, redescends en contrôlant.'],
    cue: 'Garde le buste immobile, seul le bras bouge.',
    mistakes: ['Se balancer avec le dos pour prendre de l\'élan'],
  },
  'Oiseau / élévations arrière': {
    purpose: 'Travaille le deltoïde postérieur, souvent négligé mais important pour la posture et l\'équilibre des épaules.',
    steps: [
      'Buste penché en avant, dos plat, légère flexion des coudes.',
      'Ouvre les bras sur les côtés en ramenant les omoplates ensemble.',
      'Redescends en contrôlant.',
    ],
    cue: 'Imagine vouloir toucher les murs derrière toi avec tes coudes.',
    mistakes: ['Se redresser pendant le mouvement pour tricher'],
  },
  'Curl biceps barre': {
    purpose: 'Exercice de base pour la masse des biceps.',
    steps: [
      'Debout, prise supination largeur épaules, coudes fixes le long du corps.',
      'Fléchis les coudes pour monter la barre vers les épaules.',
      'Redescends en contrôlant jusqu\'à extension complète.',
    ],
    cue: 'Garde les coudes collés au corps, seul l\'avant-bras bouge.',
    mistakes: ['Balancer le buste (élan)', 'Coudes qui partent vers l\'avant'],
  },
  'Curl biceps haltères': {
    purpose: 'Permet un travail unilatéral et une rotation du poignet pour bien contracter le biceps.',
    steps: ['Coude fixe le long du corps, monte l\'haltère en tournant légèrement le poignet vers l\'extérieur en haut.'],
    cue: 'Contracte fort le biceps 1 seconde en haut du mouvement.',
    mistakes: ['Utiliser l\'épaule pour lancer l\'haltère'],
  },
  'Curl marteau': {
    purpose: 'Prise neutre qui cible aussi le brachial et l\'avant-bras, en plus du biceps.',
    steps: ['Comme le curl haltère mais paumes qui restent face à face (prise "marteau") du début à la fin.'],
    cue: 'Garde le poignet neutre et rigide tout au long du mouvement.',
    mistakes: ['Tourner le poignet comme sur un curl classique'],
  },
  'Extension triceps poulie': {
    purpose: 'Isole les triceps, exercice clé pour des bras complets.',
    steps: [
      'Coudes fixes le long du corps, prise sur la barre/corde.',
      'Pousse vers le bas jusqu\'à extension complète des bras.',
      'Remonte en contrôlant sans bouger les coudes.',
    ],
    cue: 'Les coudes restent collés au corps du début à la fin, seul l\'avant-bras bouge.',
    mistakes: ['Coudes qui s\'écartent du corps', 'Se pencher en avant pour pousser plus lourd'],
  },
  'Extension triceps haltère': {
    purpose: 'Variante haltère au-dessus de la tête, cible bien la longue portion du triceps.',
    steps: ['Haltère au-dessus de la tête, descends derrière la tête en pliant les coudes, remonte en extension complète.'],
    cue: 'Garde les coudes pointés vers l\'avant/le haut, pas écartés sur les côtés.',
    mistakes: ['Descendre trop bas et stresser les épaules'],
  },
  'Dips triceps (banc)': {
    purpose: 'Variante accessible au poids du corps pour les triceps, faisable à la maison avec un banc/chaise.',
    steps: [
      'Mains sur le bord du banc, jambes tendues devant, descends en pliant les coudes vers l\'arrière.',
      'Remonte en poussant sur les mains.',
    ],
    cue: 'Reste bien vertical (buste droit) pour que ça travaille les triceps et non les épaules.',
    mistakes: ['Descendre trop bas', 'Épaules qui remontent vers les oreilles'],
  },
  'Squat barre': {
    purpose: 'Le mouvement roi pour les jambes : quadriceps, fessiers, ischio-jambiers, et gainage général.',
    steps: [
      'Barre sur le haut du dos (trapèzes), pieds largeur épaules.',
      'Descends en poussant les hanches en arrière et les genoux dans l\'axe des pieds, jusqu\'à cuisses parallèles au sol ou plus bas.',
      'Remonte en poussant le sol avec tout le pied.',
    ],
    cue: 'Regarde un point fixe devant toi, garde la poitrine haute et le gainage serré tout du long.',
    mistakes: ['Genoux qui rentrent vers l\'intérieur', 'Talons qui décollent', 'Dos qui s\'arrondit en bas'],
  },
  'Squat gobelet haltère': {
    purpose: 'Variante accessible tenue avec un seul haltère devant la poitrine, bonne pour apprendre la technique.',
    steps: ['Haltère tenu à deux mains devant la poitrine, descends comme un squat classique en gardant le buste droit.'],
    cue: 'Le poids devant t\'aide à garder le buste vertical naturellement.',
    mistakes: ['Se pencher trop en avant'],
  },
  'Squat au poids du corps': {
    purpose: 'Version sans charge, parfaite pour la maison ou l\'échauffement.',
    steps: ['Pieds largeur épaules, descends hanches en arrière jusqu\'à cuisses parallèles, remonte en poussant les talons.'],
    cue: 'Bras tendus devant toi pour t\'aider à garder l\'équilibre.',
    mistakes: ['Amplitude trop courte'],
  },
  'Presse à cuisses': {
    purpose: 'Permet de charger lourd les jambes en toute sécurité, dos soutenu par la machine.',
    steps: [
      'Pieds largeur épaules sur le plateau, dos et tête bien calés contre le dossier.',
      'Descends en pliant les genoux jusqu\'à ~90°, sans décoller le bas du dos.',
      'Pousse le plateau sans verrouiller violemment les genoux en haut.',
    ],
    cue: 'Ne décolle jamais le bas du dos du dossier, même avec des charges lourdes.',
    mistakes: ['Descendre trop bas et décoller le bassin', 'Verrouiller brutalement les genoux'],
  },
  'Fentes marchées': {
    purpose: 'Travail unilatéral des jambes et fessiers, utile pour l\'équilibre et corriger les déséquilibres gauche/droite.',
    steps: [
      'Fais un grand pas en avant, descends jusqu\'à ce que le genou arrière frôle le sol.',
      'Pousse sur la jambe avant pour avancer et enchaîner le pas suivant.',
    ],
    cue: 'Le genou avant reste au-dessus de la cheville, pas au-delà des orteils.',
    mistakes: ['Pas trop court qui stresse le genou avant', 'Buste penché en avant'],
  },
  'Hip thrust': {
    purpose: 'L\'exercice le plus efficace pour les fessiers : force et galbe, en plus de protéger le bas du dos au quotidien.',
    steps: [
      'Haut du dos calé contre un banc, barre posée sur les hanches (avec un coussin), pieds à plat au sol.',
      'Pousse les hanches vers le haut jusqu\'à ce que le corps forme une ligne droite genoux-hanches-épaules.',
      'Contracte fort les fessiers en haut 1 seconde, puis redescends en contrôlant.',
    ],
    cue: 'Pense "serrer une pièce de monnaie entre les fessiers" au sommet du mouvement.',
    mistakes: ['Cambrer le bas du dos au lieu de pousser avec les fessiers', 'Amplitude trop courte'],
  },
  'Leg curl allongé': {
    purpose: 'Isole les ischio-jambiers (arrière de cuisse), complémentaire du squat et du soulevé de terre.',
    steps: ['Allongé sur la machine, fléchis les genoux pour amener les talons vers les fessiers, redescends en contrôlant.'],
    cue: 'Garde le bassin plaqué contre le banc, ne le soulève pas pour tricher.',
    mistakes: ['À-coups au lieu d\'un mouvement contrôlé'],
  },
  'Extension mollets debout': {
    purpose: 'Cible les mollets (gastrocnémiens), souvent oubliés mais utiles pour l\'explosivité et l\'esthétique des jambes.',
    steps: ['Debout, monte sur la pointe des pieds le plus haut possible, redescends en contrôlant jusqu\'à un bel étirement.'],
    cue: 'Marque une pause en haut et en bas de chaque répétition.',
    mistakes: ['Rebondir trop vite sans contrôle', 'Amplitude trop courte'],
  },
  'Gainage planche': {
    purpose: 'Renforce toute la sangle abdominale et protège le bas du dos, base de la stabilité du tronc.',
    steps: [
      'Avant-bras et pointes de pieds au sol, corps aligné tête-talons.',
      'Contracte les abdos et les fessiers, ne laisse pas le bassin tomber ni monter.',
    ],
    cue: 'Respire normalement tout en gardant la ceinture abdominale contractée.',
    mistakes: ['Bassin qui tombe (dos creux)', 'Fesses trop hautes (perd l\'efficacité)'],
  },
  Crunch: {
    purpose: 'Cible le grand droit de l\'abdomen (le "six-pack").',
    steps: ['Allongé, genoux pliés, décolle les épaules du sol en contractant les abdos, redescends en contrôlant.'],
    cue: 'Le mouvement vient des abdos, pas des mains qui tirent sur la nuque.',
    mistakes: ['Tirer sur la nuque avec les mains'],
  },
  'Relevé de jambes': {
    purpose: 'Cible le bas des abdominaux et les fléchisseurs de hanche.',
    steps: ['Allongé ou suspendu, jambes tendues ou fléchies, lève les jambes en gardant le bas du dos plaqué au sol/gainé.'],
    cue: 'Bascule légèrement le bassin en fin de mouvement pour bien sentir le bas des abdos.',
    mistakes: ['Cambrer le bas du dos pour lever plus haut'],
  },
  'Corde à sauter': {
    purpose: 'Cardio efficace, améliore le cardio, la coordination et dépense pas mal de calories en peu de temps.',
    steps: ['Sauts légers sur la pointe des pieds, poignets qui font tourner la corde, genoux légèrement fléchis.'],
    cue: 'Reste léger sur les appuis, pas besoin de sauter haut.',
    mistakes: ['Sauter trop haut, ce qui fatigue vite les mollets'],
  },
  'Vélo elliptique / rameur': {
    purpose: 'Cardio porté, bon complément aux séances de muscu pour la dépense calorique sans trop impacter les articulations.',
    steps: ['Maintiens un rythme régulier sur une durée donnée, ajuste la résistance selon ton niveau.'],
    cue: 'Vise une intensité où tu peux encore parler mais pas chanter.',
    mistakes: ['Intensité trop faible pour avoir un vrai effet cardio'],
  },
  'Marche rapide / course': {
    purpose: 'Cardio simple et accessible, très efficace pour la dépense calorique globale.',
    steps: ['Marche ou course à un rythme soutenu et régulier pendant la durée prévue.'],
    cue: 'Une bonne paire de chaussures adaptées évite les douleurs articulaires.',
    mistakes: [],
  },
  'Fentes bulgares': {
    purpose: 'Variante de fente pied arrière surélevé : encore plus ciblée sur le fessier et le quadriceps de la jambe avant, très efficace pour le galbe.',
    steps: [
      'Place le dessus du pied arrière sur un banc, jambe avant à bonne distance devant toi.',
      'Descends en pliant le genou avant jusqu\'à ce que la cuisse soit parallèle au sol.',
      'Pousse sur le talon avant pour remonter.',
    ],
    cue: 'Garde le buste droit et pousse en imaginant écraser le sol avec le talon avant, pas la pointe du pied.',
    mistakes: ['Trop se pencher en avant', 'Genou avant qui part vers l\'intérieur'],
  },
  'Hip thrust unilatéral': {
    purpose: 'Version une jambe du hip thrust : corrige les déséquilibres gauche/droite et augmente l\'intensité sur chaque fessier.',
    steps: [
      'Haut du dos calé contre un banc, une jambe pliée pied au sol, l\'autre tendue en l\'air.',
      'Pousse les hanches vers le haut avec la seule jambe au sol, contracte le fessier en haut.',
      'Redescends en contrôlant sans laisser le bassin partir de travers.',
    ],
    cue: 'Garde le bassin bien droit (pas de rotation), comme s\'il y avait un verre d\'eau posé dessus.',
    mistakes: ['Bassin qui tourne vers le côté de la jambe levée', 'Amplitude trop courte'],
  },
  'Abduction hanche': {
    purpose: 'Isole le moyen fessier (sur le côté de la hanche), important pour le galbe et la stabilité du bassin.',
    steps: [
      'Assis(e) sur la machine, cuisses contre les appuis, ou debout avec un élastique aux chevilles.',
      'Écarte les jambes contre la résistance en gardant le buste stable.',
      'Reviens en contrôlant sans laisser la résistance ramener les jambes trop vite.',
    ],
    cue: 'Pense à pousser avec le côté extérieur de la cuisse, pas avec le bas du dos.',
    mistakes: ['Se pencher ou se balancer pour aider le mouvement'],
  },
  'Soulevé de terre jambes tendues': {
    purpose: 'LE mouvement de référence pour les ischio-jambiers et le bas du dos, en complément du squat.',
    steps: [
      'Barre devant les cuisses, jambes presque tendues (légère flexion des genoux fixe).',
      'Pousse les hanches vers l\'arrière en gardant le dos plat, la barre glisse le long des jambes.',
      'Descends jusqu\'à sentir un étirement marqué des ischio-jambiers, puis remonte en poussant les hanches vers l\'avant.',
    ],
    cue: 'Le mouvement vient des hanches qui reculent, les genoux bougent très peu.',
    mistakes: ['Arrondir le dos', 'Plier trop les genoux (ça devient un squat)'],
  },
  'Leg curl assis': {
    purpose: 'Isole les ischio-jambiers en position assise, complémentaire du leg curl allongé.',
    steps: ['Assis(e) sur la machine, jambes tendues sur l\'appui, fléchis les genoux pour amener les talons sous le siège, redescends en contrôlant.'],
    cue: 'Garde le dos bien calé contre le dossier tout le long du mouvement.',
    mistakes: ['Décoller les cuisses de l\'assise pour tricher'],
  },
  'Extension mollets assis': {
    purpose: 'Cible le soléaire (sous le gastrocnémien), complémentaire de l\'extension mollets debout pour des mollets complets.',
    steps: ['Assis(e), genoux sous les appuis, monte sur la pointe des pieds le plus haut possible, redescends en contrôlant jusqu\'à l\'étirement.'],
    cue: 'Marque une pause en haut et en bas de chaque répétition, comme pour l\'extension debout.',
    mistakes: ['Amplitude trop courte', 'Mouvement trop rapide'],
  },
  'Presse à mollets': {
    purpose: 'Permet de charger très lourd les mollets en toute sécurité, sur la machine de presse à cuisses.',
    steps: ['Pieds sur le bas du plateau, pointes seulement, jambes tendues, pousse en montant sur la pointe des pieds, redescends en contrôlant.'],
    cue: 'Amplitude complète : étirement en bas, contraction franche en haut.',
    mistakes: ['Verrouiller les genoux au lieu de garder les jambes tendues sans blocage', 'Amplitude trop courte'],
  },
  'Extension triceps barre au sol': {
    purpose: 'Isolation triceps allongé(e), permet de charger plus lourd que la poulie pour la masse du triceps.',
    steps: [
      'Allongé(e) sur le dos, barre tenue bras tendus au-dessus des épaules.',
      'Descends la barre vers le front en pliant uniquement les coudes.',
      'Remonte en extension complète sans bouger les épaules.',
    ],
    cue: 'Les coudes restent fixes, pointés vers le plafond, seul l\'avant-bras bouge.',
    mistakes: ['Coudes qui partent vers l\'arrière ou s\'écartent', 'Descendre la barre trop vite'],
  },
  'Curl pupitre': {
    purpose: 'Le pupitre (banc Scott) bloque la triche : isolation quasi parfaite du biceps.',
    steps: ['Bras posés sur le pupitre, aisselles calées contre le haut du support, monte la barre en contractant le biceps, redescends en contrôlant jusqu\'à extension quasi complète.'],
    cue: 'Ne redresse pas les épaules pour finir la répétition : si ça bloque, c\'est que le poids est trop lourd.',
    mistakes: ['Décoller les bras du pupitre en fin de série', 'Extension complète brutale en bas (risque sur le coude)'],
  },
  'Gainage latéral': {
    purpose: 'Renforce les obliques et la sangle abdominale latérale, complémentaire de la planche classique pour un gainage complet.',
    steps: [
      'Allongé(e) sur le côté, appui sur l\'avant-bras, corps aligné tête-pieds.',
      'Soulève les hanches du sol pour aligner tout le corps, tiens la position.',
    ],
    cue: 'Ne laisse pas les hanches tomber vers le sol : imagine un fil qui tire ta hanche vers le plafond.',
    mistakes: ['Hanches qui s\'affaissent', 'Épaule qui remonte vers l\'oreille'],
  },
  'Rotation russe': {
    purpose: 'Cible les obliques (rotation du tronc), utile pour la sangle abdominale complète et la stabilité en mouvement.',
    steps: [
      'Assis(e), buste légèrement en arrière, pieds décollés du sol (ou posés si trop dur au début).',
      'Tourne le buste d\'un côté puis de l\'autre en touchant le sol à côté de la hanche (à mains nues ou avec un poids/médecine ball).',
    ],
    cue: 'Le mouvement part du buste, pas juste des bras qui balancent.',
    mistakes: ['Aller trop vite au détriment du contrôle', 'Bouger seulement les bras sans faire tourner le buste'],
  },
}
