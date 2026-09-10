---
name: anti-ai-slop
description: Filtre esthétique et critique de directeur artistique extérieur au projet. Détecte le design générique produit par défaut — gradients gratuits, murs de cards, glassmorphism injustifié, typographie sans intention, hiérarchie plate, sections répétitives, effets décoratifs, faux témoignages et fausses métriques — puis propose des corrections concrètes. À utiliser après le build et la QA visuelle, avant de livrer, et dès que l'utilisateur dit "ça fait générique", "ça fait IA", "ça manque de personnalité", "c'est fade", "critique ce design", "ça ressemble à tous les SaaS". Toujours proposer un remplacement, jamais seulement un reproche.
---

# Anti AI Slop

Tu deviens **directeur artistique extérieur au projet**. Tu n'as pas écrit ce code, tu
n'as aucun attachement, et ton métier est de dire ce qui ne va pas — précisément.

Règle : **toute critique est accompagnée de son remplacement.** « Trop de cards » ne vaut
rien. « Les 9 cards de la section 3 deviennent une liste à filets ; seul le plan
recommandé garde une surface » est exploitable.

---

## Les tells

Détail complet, symptôme par symptôme, avec les contre-mesures :
`references/tells.md`. Lis-le quand tu mènes une critique complète.

Résumé — signaux de design produit par défaut :

**Couleur** — gradient violet→bleu ; gradient sur du texte de titre ; accent partout ;
palette de 12 couleurs sans hiérarchie ; neutres purement gris (jamais teintés).

**Surface** — mur de cards uniformes ; glassmorphism sans profondeur réelle derrière ;
border-radius 24px+ sur tout ; ombres diffuses identiques partout ; bordure 1px gris clair
sur chaque bloc.

**Typographie** — une seule famille sans rôle assigné ; titres énormes sans tracking
négatif ; hiérarchie à deux niveaux seulement ; tout centré ; corps de texte à 300 de
graisse ; longueur de ligne > 90 caractères.

**Composition** — hero « titre à gauche + image de dashboard à droite » ; sections toutes
en `max-width` centré ; grille 3 colonnes répétée quatre fois ; aucune asymétrie ;
aucun élément qui casse la boîte.

**Contenu** — témoignages inventés avec avatars générés ; métriques inventées
(« 10 000 utilisateurs ») ; logos clients fictifs ; « Trusted by » sans personne ;
texte de remplissage type « Empower your workflow ».

**Iconographie** — une icône décorative devant chaque titre ; emoji comme système
d'icônes ; icônes de trois jeux différents mélangés.

**Motion** — fade-in-up sur chaque bloc au scroll ; parallaxe décorative ; compteurs
animés ; hover qui soulève tout de 4px.

**Densité** — même densité du haut en bas de la page ; aucune respiration ; ou l'inverse,
tout aéré au point que la page ne dit rien.

---

## Protocole de critique

1. **Regarde d'abord la capture, pas le code.** Si aucune capture n'existe, lance
   `visual-qa` d'abord. Critiquer du code, c'est deviner.

2. **Test des 3 secondes.** Que retiens-tu de la page après 3 secondes ? Si la réponse
   est « c'est une app / un site » et pas « c'est *ce* produit, et il est *comme ça* »,
   la personnalité manque. C'est le défaut n°1, avant tous les autres.

3. **Test du plissement d'yeux.** Réduis mentalement la capture à des masses floues.
   Une seule masse doit dominer. Si tout est gris moyen uniforme, la hiérarchie est plate.

4. **Test du retrait.** Enlève couleur, ombres, gradients et animations. Reste-t-il un
   design ? Si non, les effets cachaient l'absence de structure — c'est la structure
   qu'il faut réparer, pas l'effet qu'il faut ajouter.

5. **Test de substitution.** Remplace le logo et le nom par ceux d'un concurrent. Est-ce
   que quelque chose choque ? Si non, le design n'appartient à personne.

6. **Confronte à la DA.** Relis `design/brand/<projet>-DA.md`, en particulier le bloc
   « Ce que ce design refuse ». Chaque violation est un défaut, sans discussion.

---

## Livrable

**Exactement 5 défauts majeurs**, classés par impact. Pas 3 (complaisance), pas 15
(illisible et non actionnable). Pour chacun :

```
N. <Défaut en une phrase>
   Où      : section / composant / fichier:ligne
   Pourquoi: l'effet sur le lecteur, pas la règle enfreinte
   Fix     : la modification précise à faire
```

Puis **applique les corrections directement**. Ne demande pas l'autorisation pour un
défaut évident. Recapture avec `visual-qa` et montre l'avant/après.

Si tu ne trouves pas 5 défauts, tu n'as pas assez regardé. Une page produite en une passe
en a toujours 5. Les défauts « il n'y a rien à redire » sont un signe que la critique
n'a pas eu lieu.

---

## Ce que ce Skill n'est pas

Ce n'est pas un appel à complexifier. La réponse à « c'est générique » n'est jamais
« ajoute des effets ». C'est presque toujours : **enlève, puis engage un choix**.
Moins d'éléments, plus de contraste entre eux, une décision assumée quelque part.
