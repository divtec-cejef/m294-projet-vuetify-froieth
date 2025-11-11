[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/EBdR9AYf)
# 🌐 Mon Projet Vue.js & Vuetify

## 1. 🎨 Présentation du projet

### Concept
- API choisie : Deezer API  
- Public cible : Fans de musique 
- Objectifs de l’application : Présenter des musiques, des albums et des artistes.

### Fonctionnalités principales
- Affichage d’une liste d’éléments (via API)
- Recherche / Tri / Filtres
- Vue détail
- Fonctionnalité interactive (favoris, watchlist, paramètres…)
- Persistance locale (favoris ou préférences)

### Aperçu visuel
_(Capture d’écran de l’application)_  
<img width="1920" height="996" alt="image" src="https://github.com/user-attachments/assets/1f2832e5-db2c-427f-9eae-050e096f7791" />

---

## 2. 📚 Parcours d'apprentissage

### Ressources utilisées
#### Documentation & tutos
- [Vue 3 Docs](https://vuejs.org/guide/introduction.html)
- [Vuetify Docs](https://vuetifyjs.com/en/components/all/)
- [Claude AI](https://claude.ai/)
- [ChatGPT](https://chatgpt.com/)
- [Deezer API](https://developers.deezer.com/api/)
  
#### Progression
- Semaine 1 :
      - Initialisation du projet
      - Prise de connaissance des capacités de l'API
      - Tests de l'API 
      - Ajout du composant des carte des musiques
      - Affichage de ces dernières
      - Correction des premier bugs
- Semaine 2 : 
      - Ajout du code de base de la page favoris
      - Ajout du code de base de la page recherche
      - Ajout du composant des carte artistes
      - Affichage de ces derniers
      - Tri par type des favoris
- Semaine 3 : 
      - Ajout de l'affichage des albums dans la page index
      - Ajout de la recherche dynamique
      - Ajout du tri par type dans la recherche (musique/artiste/album)
      - Correction bugs d'affichage des albums dans l'index
      - Ajout d'un fichier styles.css pour centraliser le CSS
      - Ajout de la page des détails pour les musiques, les albums et les artistes
- Semaine 4 :
      - Corrections des derniers bugs
      - Suppressions des fichiers inutiles
---

## 3. 🛠️ Outils et méthodologie

### Environnement de développement
- **IDE** : WebStorm
- **Versioning** : Git + GitHub
- **Dépendances principales** : Vue 3, Vuetify 3, Pinia, Axios/Fetch
- **Gestion API Keys** : Aucun

### Installation & Run
- Cloner le repo : git clone https://github.com/divtec-cejef/m294-projet-vuetify-froieth
- Installer : npm install
- Lancer : npm run dev
- Variables d’environnement : VITE_API_BASE_URL=https://api.deezer.com

### Méthodologie
- Découpage en composants réutilisables
- Props & Emits clairs
- Store global avec Pinia
- Commits réguliers et explicites
- Tests manuels (UI, persistance, erreurs API)


### Choix techniques
- API sélectionnée :  Deezer API
- Justification du choix :  Pas trop de limite de requètes et bonne quantité de données
- Endpoints utilisés :  https://api.deezer.com
- Limites/quotas connus :  50 / 5sec

### Architecture (Descriptif + schéma simple + data-flow)
- `App.vue` : layout principal  
- `src/pages/` : pages (liste, détail, favoris)  
Outils utiles : Figma et Draw.io

**Data-flow résumé :**  
- Vue déclenche un **event utilisateur** → composant appelle une fonction du **store** → ...

---

## 4. 🧪 Tests et validation

### Tests techniques
- ✅ Appels API fonctionnels  
- ✅ Persistance vérifiée après refresh (localStorage)  
- ✅ Navigation entre les vues OK  

### Tests d’UX
- Navigation intuitive  
- Recherche/tri faciles à comprendre  
- Feedback utilisateur (loading, erreurs, vide)  

### Tests d’accessibilité
- Contraste couleurs (Vuetify par défaut)  
- Labels et placeholders corrects  
- Navigation clavier possible  
- Focus visible  

### Tests d’erreurs & fallback
- API down → **mock fallback** affiché (fichier local ou données simulées)  
- Liste vide → message clair affiché  
- Recherche sans résultat → affichage “Aucun élément trouvé”  

---

## 5. 🤖 Usage d’intelligence artificielle

**⚠️ TRANSPARENCE OBLIGATOIRE** : Si vous utilisez une IA, vous DEVEZ :

### IA utilisée
- **Nom** : ChatGPT / Claude
- **Version** : GPT‑5 / Sonnet 4.5
- **Contexte** : Génération de code / Debugging / Don d'inspiration

### Utilisation détaillée
**Domaines d'aide :**
- Aide au code général : 80%
- Génération de snippets Vue/Vuetify : 70%
- Aide à la structuration du projet : 0%
- Debugging : 70%  
- Recherche d’idées : 20%  

**Compréhension et adaptation**
- Expliquer ce que fait le code généré  
- Dire comment il a été adapté au projet  

### Parties codées manuellement
- Composants principaux : 30% personnel  
- Store & persistance : 60% personnel  
- Routing & navigation : 60% personnel  
- Tests & validation : 100% personnel
  
---

## 6. 🎯 Bilan personnel

### Ce que j’ai appris
- Compétences techniques acquises : Comment utilisé une API
- Découvertes surprenantes : aucune

### Difficultés rencontrées
- Problèmes techniques et solutions trouvées : problème de pull request github
- Aide reçue : aide de M. Tirole

### Réussites et fiertés
- Aspects du projet dont je suis fier : Esthétique du site
- Progrès constatés depuis le début : Mon niveau en Javascript notamment en Vue.js
- Envies de développement futur : Pas pour l'instant

### Améliorations possibles
- Ce que j’ajouterais avec plus de temps : Une fonction pour trier la recherche par genre (rap, house, classique, ...)
- Fonctionnalités bonus envisagées : Une fonction pour trier la recherche par genre (rap, house, classique, ...)
- Compétences à approfondir : aucune

---

## 7. 📚 Références & Sources
- Documentation de l’API : [DeezerAPI](https://developers.deezer.com/api)  
- Tutos clés utilisés : Aucun 
- Usage de l’IA : voir section ci-dessus  
- Autres ressources utiles : Ancien projet (ex : Pokedex)
