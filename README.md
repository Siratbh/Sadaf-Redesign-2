# Sadaf Redesign Standalone

This is the standalone repo-ready version of the redesigned Sadaf portfolio site.

It is intended to be:

- pushed to its own GitHub repository
- connected directly to Netlify
- deployed as an independent site

## What Is Included

- redesigned React + Vite frontend
- content-driven pages from `content/**`
- artwork and supporting assets from `public/images/**`
- Netlify config in `netlify.toml`
- optional admin/CMS files under `public/admin/`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Build

```bash
npm run build
```

The production build is output to `dist/`.

## GitHub Setup

Inside this folder:

```bash
git init
git add .
git commit -m "Initial standalone redesign"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Netlify Setup

1. Create a new site in Netlify from Git.
2. Select the GitHub repository you pushed from this folder.
3. Confirm these settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22`

These values already match `netlify.toml`.

## Content

- Paintings: `content/paintings/*.md`
- Collections: `content/collections/*.md`
- Exhibitions: `content/exhibitions/*.md`
- Site settings: `content/settings/site.json`
- Images: `public/images/**`

## Notes

- This standalone copy excludes the old `V4` reference folder, the `v3` folder, local build output, and installed dependencies.
- If you want CMS editing on Netlify, enable Identity and Git Gateway after deploy.
