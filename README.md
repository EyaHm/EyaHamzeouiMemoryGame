Memory Game 

Description du projet:
Memory Game est un jeu de mémoire interactif développé en JavaScript.
Le joueur doit retrouver toutes les paires de cartes identiques dans un temps limité, avec différents niveaux de difficulté.
Le jeu intègre un système de score basé sur la rapidité et le nombre de mouvements, ainsi qu’un tableau des meilleurs scores.

Technologies utilisées:
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript 
- LocalStorage (pour sauvegarde des meilleurs scores)
- Audio API (pour la gestion de la musique de fond)

Fonctionnalités principales:
- Sélection de niveau de difficulté (facile, moyen, difficile)
- Animation des cartes lors des retournements, des bonnes/mauvaises paires
- Timer avec décompte et gestion de fin de partie
- Calcul et affichage du score
- Sauvegarde et affichage des meilleurs scores par niveau
- Musique de fond avec bouton ON/OFF
- Interface responsive adaptée aux mobiles et tablettes
- Modal de fin de partie avec message personnalisé (nouveau record ou score)

Lien vers la page GitHub Pages:
[Memory Game - Démo en ligne](https://eyahm.github.io/EyaHamzeouiMemoryGame/)
lien vers repo GitHub:
[EyaHamzeouiMemoryGame](https://github.com/EyaHm/EyaHamzeouiMemoryGame)

Nouveautés explorées:
- Utilisation avancée de **CSS Grid** pour la gestion dynamique de la grille de cartes
- Gestion du **LocalStorage** pour persister les données utilisateurs
- Animation CSS combinée avec JavaScript pour améliorer l’expérience utilisateur
- Mise en place de la **musique de fond** contrôlable par l’utilisateur avec l’API Audio
- Techniques de développement responsive via les **media queries** pour optimiser l’affichage mobile

Difficultés rencontrées:
- Synchronisation du timer avec la logique du jeu (démarrage, arrêt, reset)
- Gestion des états complexes lors du retournement des cartes (éviter que l’utilisateur retourne trop vite)
- Calcul d’un score équilibré entre temps et nombre de mouvements pour que ce soit juste entre les niveaux
- Rendre l’interface esthétique tout en conservant une bonne lisibilité sur mobile
- Résoudre des problèmes liés au stockage local (LocalStorage) lors des tests sur plusieurs navigateurs

Solutions apportées:
- Recherche approfondie sur les timers JavaScript et gestion des `setInterval`/`clearInterval`
- Implémentation d’un verrouillage du plateau (`lockBoard`) pour éviter plusieurs clics pendant les animations
- Formule de score basée sur la proportion de paires trouvées, le temps restant et les mouvements, testée et ajustée
- Utilisation de flexbox et grid combinés pour une mise en page adaptative, avec tests fréquents sur émulateurs et téléphones réels
- Consultation de la documentation MDN et tutoriels pour LocalStorage, ainsi que tests croisés sur Chrome
