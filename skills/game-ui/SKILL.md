---
name: game-ui
description: Conception d'interfaces de jeu — HUD, panneaux, lisibilité d'un état de partie complexe, feedback de conséquence d'une décision, données de simulation sans effet tableur, ton visuel et game feel. À utiliser dès qu'il s'agit de concevoir ou corriger l'interface d'un jeu : jeu de gestion, de stratégie, de simulation politique ou économique, jeu narratif, roguelike, jeu de cartes. Déclencher sur "HUD", "interface de jeu", "écran de partie", "panneau de gestion", "game UI", "game feel", "juice", "le joueur ne comprend pas ce qui se passe", "trop d'informations à l'écran", "ça fait tableur". Complète design-director et design-system, ne les remplace pas.
---

# Game UI

Une interface de jeu n'obéit pas aux règles d'une interface produit.

La différence tient en une phrase : **le joueur revient**. Il apprend l'interface, et
cet apprentissage change ce qui est bon. Une densité qui serait une faute sur une
landing page est une qualité dans un jeu de gestion — le joueur veut voir son empire,
pas le découvrir écran par écran. Inversement, une interface de jeu trop douce, trop
« app », tue l'immersion plus sûrement qu'une interface dense.

Ce Skill vient **après** `design-director` (le concept, le ton) et `design-system`
(les tokens). Il ne les remplace pas.

---

## 1. Les trois couches

Séparer avant de dessiner. Chaque couche a ses règles ; les mélanger produit le HUD
illisible typique du prototype.

**Le monde** — la carte, le plateau, la scène. C'est le sujet. Tout le reste lui vole
de la place et doit le justifier.

**Le HUD** — permanent, lu en périphérie, sans lecture consciente. Contraintes strictes :
peu d'éléments, positions absolument stables, pas de déplacement d'un état à l'autre.
Un chiffre qui change de position quand il passe à 4 chiffres est un bug de conception.
Réserve la place du pire cas dès le départ.

**Les panneaux** — ouverts volontairement, lus avec attention. C'est là que va la
densité, la donnée, le détail. Le joueur a choisi d'y entrer : il accepte l'effort.

Erreur la plus fréquente : mettre du contenu de panneau dans le HUD « pour que ce soit
visible ». Résultat, plus rien n'est visible.

---

## 2. Lisibilité de l'état

À tout instant, le joueur doit pouvoir répondre à quatre questions sans chercher :

1. **Où j'en suis** — tour, date, phase, ressources vitales.
2. **Qu'est-ce qui a changé** depuis ma dernière action.
3. **Qu'est-ce que je peux faire** maintenant.
4. **Qu'est-ce que ça va me coûter**.

La question 2 est celle qu'on oublie et c'est la plus importante. Un chiffre qui bouge
en silence entre deux tours est une information perdue. Le delta doit être **montré**
— pas seulement la nouvelle valeur : `48 % (−3)`, avec le signe et la direction lisibles
sans couleur.

**Hiérarchie des ressources** : identifier les 2 ou 3 valeurs dont la perte fait perdre
la partie. Elles seules ont droit au HUD permanent et au traitement typographique fort.
Le reste descend d'un cran. Un HUD qui affiche huit compteurs de même poids n'en affiche
aucun.

---

## 3. Feedback de conséquence

C'est le cœur d'un jeu où l'on prend des décisions, et le point où la plupart échouent.

Une décision doit produire une **chaîne traçable** :

```
décision → effet immédiat visible → effet différé annoncé → conséquence systémique
```

Règles :

- **Avant** l'action : montrer le coût et la fourchette d'effet attendu. Une décision
  prise à l'aveugle n'est pas une décision, c'est un tirage.
- **Au moment** : un feedback immédiat, court, dirigé — le regard va là où ça change.
- **Après** : le joueur doit pouvoir remonter la cause. « Pourquoi ma cote a chuté ? »
  doit avoir une réponse consultable, pas devinable.
- **Incertitude assumée** : si le résultat est probabiliste, le dire avant, pas après.
  Un jeu qui cache son aléa passe pour cassé, pas pour profond.

Un journal des événements — court, filtrable, horodaté par tour — résout à lui seul la
moitié des « je ne comprends pas ce qui se passe ».

---

## 4. Données sans effet tableur

Le piège des jeux de simulation politique, économique ou de gestion : tout finit en
tableau, et l'interface devient un fichier de comptabilité avec un thème sombre.

Contre-mesures :

- **Une forme par question, pas par donnée.** Une tendance se lit en courbe, une
  composition en barre unique segmentée, une comparaison en barres, une position en
  point sur un axe. Le tableau ne sert qu'à la consultation exhaustive, jamais à la
  compréhension.
- **La donnée est diégétique.** Un sondage se lit comme un sondage : une une de presse,
  un écran de plateau télé, une note de conseiller. Pas comme une ligne de tableur.
  C'est le levier de différenciation le plus fort d'un jeu politique, et il ne coûte
  presque rien techniquement — c'est du cadrage et de la typographie.
- **Seuils avant précision.** `41 %` ne dit rien seul. `41 % — sous la barre du second
  tour` dit tout. Placer les seuils qui comptent directement sur la représentation.
- **Chiffres tabulaires partout.** Toute donnée alignée ou qui change en place utilise
  des chiffres à chasse fixe, sinon elle danse.
- **Agréger par défaut, détailler à la demande.** Le joueur ouvre le détail quand il en
  a besoin ; il ne doit pas le subir en permanence.

Pour toute représentation de données, appliquer aussi le Skill `dataviz` s'il est
disponible.

---

## 5. Ton et diégèse

Le ton est une décision de direction artistique, prise en pass 2, et il commande tout :

- **Satire** — couleurs saturées, typographie de presse populaire, mise en page de
  tabloïd, illustration marquée. Le risque : que le jeu ne soit jamais pris au sérieux
  au moment où il le faudrait.
- **Gravité institutionnelle** — sobriété, sérif de rapport, papier, tampons, filets,
  peu de couleur. Le risque : l'austérité qui ennuie.
- **Techno-thriller** — écrans de veille, flux, monospace, contraste dur, alertes.
  Le risque : le cliché « salle de crise » vu mille fois.

Choisir, et le tenir jusque dans les micro-textes. Un jeu politique dont les boutons
disent « Confirmer » et « Annuler » a raté son ton : ils disent « Signer le décret » et
« Ajourner ».

**Diégétique par défaut, quand c'est gratuit.** Habiller un panneau en dossier, en
dépêche, en note de service ou en écran de contrôle ne coûte qu'un cadrage et une typo,
et transforme complètement la perception. Ne pas le faire quand ça nuit à la lisibilité :
un texte sur fond de papier froissé est joli et illisible. L'habillage s'arrête là où la
compréhension commence à souffrir.

---

## 6. Game feel

Le feedback est fonctionnel avant d'être plaisant.

- **Réponse immédiate.** Tout clic produit un retour sous 100 ms, même si le résultat
  met plus longtemps. Sans ça, le joueur reclique.
- **Anticipation et résolution.** Une action importante mérite un très court temps de
  montée puis une résolution nette. C'est ce qui donne du poids.
- **Le son fait la moitié du travail.** Prévoir les emplacements sonores dès la
  conception, même sans son implémenté.
- **La retenue est ce qui distingue.** Un effet sur l'action majeure, rien sur les
  actions mineures. Un jeu où tout scintille ne met rien en valeur.
- **Tout est interruptible.** Une animation de fin de tour qu'on ne peut pas passer
  devient insupportable à la vingtième partie. Prévoir le saut dès le premier jour.
- **Vitesse de jeu** : si le jeu a des tours ou du temps réel, le contrôle de vitesse
  est une fonctionnalité de confort majeure, pas une option.

---

## 7. Accessibilité

Non optionnelle, et particulièrement négligée dans le jeu :

- **Jamais l'information par la seule couleur.** Un parti, une faction, un état ajoutent
  une forme, un motif ou un libellé. Environ 8 % des joueurs masculins sont concernés.
- **Taille de texte réglable**, et le HUD doit survivre à +25 % sans casser.
- **Contraste réel sur le monde** : un HUD posé sur une carte change de fond en
  permanence. Il faut un support (voile, plaque, contour) — pas espérer que ça passe.
- **Réduction des animations** respectée, y compris les secousses d'écran.
- **Cibles cliquables ≥ 44 px** même en interface dense, ou zone de clic élargie autour
  d'un visuel plus petit.
- **Contrôles remappables** dès qu'il y a du clavier.

---

## 8. QA visuelle spécifique au jeu

`visual-qa` capture des pages. Un jeu se juge sur des **états**, pas sur des écrans.

Capturer au minimum :

- **début de partie** — peu de contenu, HUD presque vide. Le piège du vide.
- **milieu de partie** — le cas nominal.
- **partie saturée** — beaucoup d'entités, longs noms, grands nombres, listes pleines.
  C'est là que tout casse.
- **moment de crise** — plusieurs alertes simultanées. Est-ce encore lisible ?
- **défaite / fin** — presque toujours bâclé, et c'est le dernier souvenir du joueur.

Et tester avec les **pires données** : le nom le plus long, le nombre le plus grand,
la valeur négative, le zéro, la liste vide, la liste à 200 entrées.

Si le jeu tourne dans le navigateur (canvas, WebGL, DOM), `shoot.mjs` fonctionne
directement — instrumenter le jeu pour pouvoir charger un état précis par paramètre
d'URL est le meilleur investissement de QA possible :

```bash
node ~/.claude/skills/visual-qa/scripts/shoot.mjs "http://localhost:5173/?state=crise" \
  --viewports desktop --wait 2000 --selector "#hud"
```

Si le jeu tourne dans un moteur natif (Unity, Godot, Unreal), Playwright ne voit rien :
brancher les captures du moteur lui-même sur les mêmes états, et appliquer la grille de
lecture de `visual-qa` sur ces images.

---

## 9. Ce qu'il faut refuser

Les tells du prototype de jeu jamais fini :

- HUD qui affiche tout « au cas où » ;
- panneaux qui se ressemblent tous, dont on ne sait plus lequel est ouvert ;
- infobulles qui répètent le libellé au lieu d'expliquer l'effet ;
- police système par défaut sur une interface au ton marqué ;
- icônes génériques de bibliothèque là où le jeu a besoin d'un vocabulaire propre ;
- un rouge et un vert comme seule grammaire de l'état ;
- écrans de menu soignés et écrans de jeu négligés — c'est l'inverse qu'il faut ;
- aucun état vide traité, aucun état d'erreur traité ;
- des nombres bruts sans unité, sans seuil, sans delta.
