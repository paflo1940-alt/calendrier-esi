# Calendrier ESI — React + Vite

## Lancer en local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Déployer sur GitHub Pages

Le projet utilise `base: './'` dans `vite.config.js`, ce qui le rend compatible avec un dépôt GitHub Pages dans un sous-chemin.

Tu peux déployer le dossier `dist/` avec GitHub Actions ou une branche `gh-pages`.

## Fonctionnalités

- React + Vite
- Responsive desktop/mobile
- Ajout / modification / suppression de cours
- Filtres par UE
- Sauvegarde locale avec `localStorage`
- PWA avec manifest + service worker
