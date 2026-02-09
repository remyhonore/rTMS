# Registre rTMS douleur — v0.1.14

Application web **local-only** (aucun envoi de données) pour un registre “vie réelle” rTMS en douleur chronique :
- eCRF minimal : inclusion + séances + suivi + événements indésirables
- règles qualité simples (manquants + cohérences)
- export CSV (tables) + synthèse clinique imprimable (PDF via “Imprimer → Enregistrer en PDF”)
- backup/restore (JSON)

## Nouveau (v0.1.14)
- **Parcours dual** : bouton en haut “Mode patient” vs “Mode clinicien”.
- En **mode patient**, l’interface masque les fonctions non nécessaires au lit du patient (ex. export/dictionnaire/protocole/qualité, backup/reset).
- En **mode clinicien**, l’interface reste complète (comportement par défaut).

## Rappel (v0.1.13)
- **Résumé patient (1 page)** depuis le tableau de bord :
  - ouvre une fenêtre “résumé 1 page” optimisée impression,
  - bouton **Imprimer / enregistrer en PDF** (via l’outil du navigateur),
  - contenu compact : inclusion, évolution (base → dernier suivi), dernière séance, dernier suivi/EI, extrait des derniers enregistrements.
  - aucun changement de la **Synthèse (PDF)** existante.

## Nouveau (v0.1.10)
- **Qualité patient actif** (tableau de bord) : alertes ciblées et structurées en 3 sections :
  - champs manquants (inclusion),
  - incohérences (dates vs inclusion, numéros de séance dupliqués, EI résolution, consentement),
  - infos (couverture).
- Résumé immédiat : compteurs “Champs manquants / Incohérences / Infos”.

## Nouveau (v0.1.9)
- **Export “Dossier patient (ZIP)” (1 clic)** depuis le tableau de bord :
  - télécharge un ZIP unique avec des CSV filtrés sur le patient actif :
    - `patient_<ID>_AAAA-MM-JJ_patients.csv`
    - `patient_<ID>_AAAA-MM-JJ_seances.csv`
    - `patient_<ID>_AAAA-MM-JJ_suivi.csv`
    - `patient_<ID>_AAAA-MM-JJ_ei.csv`
    - + `dictionnaire_donnees_v1.csv` (inchangé)
  - nom du ZIP : `patient_<ID>_AAAA-MM-JJ_dossier.zip`.
  - aucun changement des exports existants (ajout d’un raccourci ZIP uniquement).

## Rappel (v0.1.8)
- **Export “Dossier du patient sélectionné” (1 clic)** depuis le tableau de bord :
  - télécharge des CSV filtrés sur le patient actif : `patients` / `seances` / `suivi` / `evenements_indesirables`.
  - nommage traçable : `patient_<ID>_AAAA-MM-JJ_<table>.csv`.
  - + `dictionnaire_donnees_v1.csv` (inchangé).
  - aucun changement des exports existants (ajout d’un raccourci patient uniquement).

## Rappel (v0.1.7)
- **Export “Tout le registre” (1 clic)** : télécharge d’un coup
  - `patients.csv` / `seances.csv` / `suivi.csv` / `evenements_indesirables.csv`
  - + `dictionnaire_donnees_v1.csv`
  - (les exports unitaires restent inchangés).

## Rappel (v0.1.6)
- **Création rapide d’événement indésirable** depuis le tableau de bord : bouton “Ajouter un EI”.
  - pré-remplit le patient sélectionné,
  - place le focus sur la date (saisie immédiate),
  - n’enregistre rien automatiquement (traçabilité conservée : validation manuelle).

## Rappel (v0.1.4)
- **Création rapide de séance** depuis le tableau de bord : bouton “Ajouter une séance”.
  - pré-remplit le patient sélectionné,
  - place le focus sur la date (saisie immédiate),
  - n’enregistre rien automatiquement (traçabilité conservée : validation manuelle).

## Rappel (v0.1.3)
- Tableau de bord patient (1 page) : complétude, mini-évolution, alertes.
- Protocole global / par centre : séances attendues, points de suivi, couverture + timeline.

## Démarrage (le plus simple)
Ouvre `app/index.html` dans un navigateur récent (Chrome / Edge / Firefox / Safari).

## Données
- Stockage : **localStorage du navigateur** (local uniquement).
- Backup : bouton **Backup** (haut à droite).
- Restauration : bouton **Import** (haut à droite).

## Export
- CSV : onglet **Export**, un bouton par table.
- Synthèse clinique : choisir un patient → **Synthèse clinique (PDF)** → dans la nouvelle fenêtre : **Imprimer / enregistrer en PDF**.

## Notes
- Les champs textes ne doivent pas contenir d’identifiants directs (nom, prénom…).
- Les plages de cohérence sont volontairement larges en v0.1.x (à affiner selon protocole de centre).
