# Sadaf — Artist Portfolio

A premium, editorial artist portfolio website built with React, Vite, GSAP, Three.js, and Decap CMS. Deployed on Netlify.

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How Routing Works

Built with React Router v6. All routes are client-side.

| Route | Page |
|---|---|
| `/` | Homepage (WebGL gallery + all sections) |
| `/collections` | All collections index |
| `/collections/:slug` | Single collection with its paintings |
| `/paintings/:slug` | Individual painting detail |
| `/about` | Artist biography |
| `/exhibitions` | Full exhibition archive |
| `/contact` | Contact + inquiry form |
| `/admin` | CMS (Decap CMS — requires Netlify Identity) |

`netlify.toml` includes a catch-all redirect so direct URL visits work correctly in production.

---

## How Content Is Managed

Content lives in `content/` as Markdown files (paintings, collections, exhibitions) and JSON (settings).

The CMS is available at `/admin` after deploying to Netlify with Git Gateway and Identity enabled.

### Add a Painting

1. Go to `/admin` → Paintings → New Painting
2. Fill in: Title, Slug (URL-safe), Collection (optional), Year, Medium, Dimensions, Availability, Featured Image, Description
3. Toggle "Featured on Homepage" to show it in the WebGL carousel
4. Save → commit is made automatically to your repository

Or manually: create `content/paintings/your-slug.md` with this frontmatter:

```md
---
title: Your Painting Title
slug: your-painting-slug
collection: your-collection-slug
year: "2024"
medium: Oil on Canvas
dimensions: 90 × 120 cm
availability: available
featured_image: /images/paintings/your-painting.jpg
thumbnail_image: /images/paintings/your-painting-thumb.jpg
short_description: A brief description.
full_description: A longer artist's note.
inquiry_subject: "Inquiry: Your Painting Title (2024)"
sort_order: 1
featured: true
---
```

### Add a Collection

1. Go to `/admin` → Collections → New Collection
2. Fill in: Title, Slug, Cover Image, Intro, Series Note (optional)
3. Save

Or manually: create `content/collections/your-slug.md`

### Add an Exhibition

1. Go to `/admin` → Exhibitions → New Exhibition
2. Fill in: Year, Title, Venue, City, Type (Solo / Group), Image (optional)
3. Save

---

## Uploading Images

Images go in `public/images/`. Organize as:

```
public/images/
  paintings/
  collections/
  artist-portrait.jpg
```

Reference them in CMS/markdown as `/images/paintings/filename.jpg`

---

## Deployment

### First Deploy

1. Push repository to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

### Enable CMS

1. In Netlify: **Site Settings → Identity → Enable**
2. Under Identity: **Services → Git Gateway → Enable**
3. Invite yourself as a user: **Identity → Invite users**
4. Visit `your-site.netlify.app/admin` and log in

### Subsequent Deploys

Push to `main` — Netlify auto-deploys.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Animation | GSAP 3 + ScrollTrigger |
| WebGL | Three.js |
| Smooth Scroll | Lenis |
| Styling | Tailwind CSS v3 |
| CMS | Decap CMS (formerly Netlify CMS) |
| Forms | Netlify Forms |
| Hosting | Netlify |
