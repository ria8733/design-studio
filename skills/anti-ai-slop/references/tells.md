# Catalogue des tells — symptôme → cause → remplacement

Référence détaillée du Skill `anti-ai-slop`. À lire pour une critique complète.

---

## 1. Couleur

| Symptôme | Pourquoi ça arrive | Remplacement |
|---|---|---|
| Gradient violet → bleu | Valeur par défaut de tous les kits SaaS depuis 2020 | Une couleur de marque pleine, choisie contre le secteur. Le gradient, s'il reste, devient monochrome (une teinte, deux luminosités) et sert une profondeur réelle |
| Gradient appliqué au texte du titre | Effet « premium » de surface | Titre en couleur pleine, et le contraste vient de la taille et de la graisse |
| Accent utilisé partout | Peur que la page paraisse terne | Accent réservé au CTA principal et à un seul signal. Cible : < 10 % de la surface |
| Neutres purement gris (#888) | `gray-500` par défaut | Neutres teintés vers la marque (chauds si la marque est chaude). Un gris pur à côté d'une couleur chaude paraît sale |
| 12 couleurs sans hiérarchie | Chaque besoin a créé sa couleur | Réduire à : fond ×3, texte ×3, bordure ×2, marque ×2, sémantique ×3 |

## 2. Surfaces et profondeur

| Symptôme | Pourquoi | Remplacement |
|---|---|---|
| Mur de cards identiques | La card est le conteneur par défaut | Liste à filets, tableau, ou grille éditoriale à tailles inégales. Une seule card mise en avant, les autres en lignes |
| Glassmorphism sans rien derrière | Effet copié sans son prérequis | Supprimer. Le flou n'a de sens qu'au-dessus d'un contenu réel qui bouge (image, carte, vidéo) |
| Border-radius 24px+ partout | « Doux = moderne » | Choisir un radius identitaire et le tenir. Coins nets pour un ton technique/brut, doux pour un ton consumer. Jamais les deux |
| Ombre diffuse identique sur tout | `shadow-lg` collé partout | 3 niveaux max, avec une règle d'usage. Sur fond sombre, préférer une bordure claire. Ombre dure décalée sans flou = sérigraphie assumée |
| Bordure 1px gris clair sur chaque bloc | Peur du vide | Séparer par l'espace ou par un changement de fond. La bordure est un dernier recours |

## 3. Typographie

| Symptôme | Pourquoi | Remplacement |
|---|---|---|
| Une seule famille, aucun rôle | Inter partout | Assigner : display (personnalité), texte (lisibilité), numérique (tabulaire). Deux familles suffisent souvent |
| Titre 64px sans tracking ajusté | Le tracking par défaut est calibré pour du corps de texte | `letter-spacing: -0.02em` à -0.04em au-delà de 40px |
| Hiérarchie à deux niveaux | Gros titre + petit texte, rien entre | Au moins 4 niveaux réellement distincts, avec des écarts de taille perceptibles (ratio ≥ 1.25) |
| Tout centré | Le centrage cache l'absence de grille | Aligner à gauche par défaut. Le centrage se réserve à un moment, pas à une page |
| Corps de texte en graisse 300 | « Léger = élégant » | 400 minimum en corps. Le light est illisible sous 18px et sur écran sombre |
| Lignes de 100+ caractères | `max-width` oublié | 45–75 caractères. `max-width: 68ch` |
| Chiffres proportionnels dans un tableau | Police par défaut | `font-variant-numeric: tabular-nums` sur toute donnée alignée |

## 4. Composition

| Symptôme | Pourquoi | Remplacement |
|---|---|---|
| Hero « texte gauche + dashboard droite » | Le layout par défaut de tous les templates | Un vrai parti pris : typo pleine largeur, image en fond, split asymétrique 40/60, produit en débordement, ou pas d'image du tout |
| Toutes les sections en `max-width` centré | Grille unique | Alterner : pleine largeur, contenu étroit, décalé, débordant. Le rythme naît du changement de largeur |
| Grille 3 colonnes répétée 4 fois | Le contenu a été moulé dans le layout | Adapter la grille au contenu : 2 colonnes ici, une bande de 4 là, une pleine largeur ailleurs |
| Aucune asymétrie | Le centrage est plus sûr | Un déséquilibre assumé par page : un bloc décalé, une marge cassée, un chevauchement |
| Rien ne dépasse jamais | Tout est dans sa boîte | Un élément qui traverse une frontière (image qui déborde d'une section, titre qui mord sur l'image) suffit à faire vivre une page |

## 5. Contenu

| Symptôme | Risque | Remplacement |
|---|---|---|
| Témoignages inventés | Faux, et repérable | Aucun témoignage tant qu'il n'y en a pas de vrai. Remplacer la section par une démonstration du produit |
| Métriques inventées | Faux, et juridiquement risqué | Retirer. Ou dire ce qui est vrai, même petit et précis |
| Logos clients fictifs | Faux | Retirer la bande de logos |
| « Empower your workflow », « Seamlessly integrate » | Texte de remplissage | Dire ce que fait le produit, en français concret, avec le vocabulaire de l'utilisateur |
| Faux dashboard en image de hero | Ne montre rien de réel | Un vrai écran, même partiel, même moche. Ou une représentation abstraite assumée qui ne prétend pas être l'app |

## 6. Iconographie

| Symptôme | Remplacement |
|---|---|
| Une icône devant chaque titre de section | Retirer toutes les icônes décoratives. Une icône sert à identifier une action ou un état, pas à décorer un titre |
| Emoji comme système d'icônes | Un jeu d'icônes unique, une graisse unique (Lucide sur ce dépôt) |
| Icônes de plusieurs jeux mélangés | Un seul jeu. Si un glyphe manque, le dessiner dans le style du jeu |
| Illustrations 3D isométriques génériques | Rien, ou un traitement graphique maison (texture, trame, photo retraitée) |

## 7. Motion

| Symptôme | Remplacement |
|---|---|
| Fade-in-up sur chaque bloc au scroll | Supprimer. Au maximum, une entrée sur le hero |
| Parallaxe décorative | Supprimer sauf si elle porte une information de profondeur réelle |
| Compteurs animés | Afficher le nombre |
| Hover qui soulève tout de 4px | Réserver l'élévation aux éléments réellement cliquables, et un seul type de réponse au survol par famille |
| Aucune animation du tout | Ajouter uniquement du feedback : état pressé, transition d'état, retour de chargement |

## 8. Densité

| Symptôme | Remplacement |
|---|---|
| Densité identique du haut en bas | Alterner dense / respirant. Un moment de vide avant le CTA lui donne du poids |
| Tout aéré, la page ne dit rien | Rapprocher ce qui va ensemble. La proximité est le signal de groupement le plus fort, avant la bordure et avant la couleur |
| Tout compressé | Augmenter l'espace **entre** les groupes, pas dans les groupes |

---

## Contre-test final

Avant de valider, poser les cinq questions :

1. Que retient-on après 3 secondes ? (personnalité)
2. Une seule masse domine-t-elle au plissement d'yeux ? (hiérarchie)
3. Sans couleur ni effets, reste-t-il un design ? (structure)
4. En changeant le logo pour un concurrent, quelque chose choque-t-il ? (appartenance)
5. La DA interdisait-elle quelque chose qui est pourtant là ? (discipline)
