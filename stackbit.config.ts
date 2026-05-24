import { defineStackbitConfig } from '@stackbit/types'
import { GitContentSource } from '@stackbit/cms-git'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '22',
  devCommand: 'node ./node_modules/.bin/vite --port {PORT} --host {HOSTNAME} --strictPort',
  experimental: {
    ssg: {
      name: 'vite',
      logPatterns: { up: ['Local:', 'ready in'] },
      proxyWebsockets: true,
      passthrough: ['/@vite/**', '/@fs/**', '/@id/**', '/node_modules/**'],
    },
  },
  contentSources: [
    new GitContentSource({
      rootPath: process.cwd(),
      contentDirs: ['content'],
      assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/',
      },
      models: [
        // ─── Paintings ────────────────────────────────────────────────
        {
          name: 'Painting',
          type: 'data',
          labelField: 'title',
          filePath: 'content/paintings/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'slug', required: true },
            { name: 'year', type: 'string' },
            { name: 'medium', type: 'string' },
            { name: 'dimensions', type: 'string' },
            {
              name: 'availability',
              type: 'enum',
              options: [
                { label: 'Available', value: 'available' },
                { label: 'Sold', value: 'sold' },
                { label: 'Not for Sale', value: 'nfs' },
              ],
            },
            { name: 'featured', type: 'boolean' },
            { name: 'featured_image', type: 'image' },
            { name: 'thumbnail_image', type: 'image' },
            { name: 'short_description', type: 'text' },
            { name: 'full_description', type: 'markdown' },
            { name: 'inquiry_subject', type: 'string' },
            { name: 'seo_title', type: 'string' },
            { name: 'seo_description', type: 'text' },
            { name: 'sort_order', type: 'number' },
          ],
        },

        // ─── Exhibitions ──────────────────────────────────────────────
        {
          name: 'Exhibition',
          type: 'data',
          labelField: 'title',
          filePath: 'content/exhibitions/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'year', type: 'string' },
            { name: 'venue', type: 'string' },
            { name: 'city', type: 'string' },
            {
              name: 'exhibition_type',
              type: 'enum',
              options: [
                { label: 'Solo', value: 'Solo' },
                { label: 'Group', value: 'Group' },
                { label: 'Residency', value: 'Residency' },
              ],
            },
            { name: 'description', type: 'text' },
            { name: 'image', type: 'image' },
            { name: 'sort_order', type: 'number' },
          ],
        },


        // ─── About page ───────────────────────────────────────────────
        {
          name: 'AboutPage',
          type: 'page',
          urlPath: '/about',
          filePath: 'content/pages/about.md',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'portrait_image', type: 'image' },
            { name: 'bio_intro', type: 'text' },
            { name: 'bio_body', type: 'markdown' },
            { name: 'artist_statement', type: 'text' },
            { name: 'studio_note', type: 'text' },
          ],
        },

        // ─── Homepage (owns / URL path) ───────────────────────────────
        // All editable copy for HomeV4.jsx. Lists (paintings, exhibitions,
        // collectors) come from their own collections — not modeled here.
        {
          name: 'HomePage',
          type: 'page',
          urlPath: '/',
          filePath: 'content/pages/home.md',
          fieldGroups: [
            { name: 'Hero', label: 'Hero' },
            { name: 'Available Works', label: 'Available Works' },
            { name: 'About', label: 'About' },
            { name: 'Past Works', label: 'Past Works' },
            { name: 'Collectors', label: 'Collectors' },
            { name: 'Exhibitions', label: 'Exhibitions' },
            { name: 'Contact', label: 'Contact' },
          ],
          fields: [
            // Hero
            { name: 'hero_headline_line1', type: 'string', group: 'Hero', description: 'First line of the big headline (e.g. "Explore the intersection").' },
            { name: 'hero_headline_line2', type: 'string', group: 'Hero', description: 'Second line of the big headline (e.g. "of spirituality and abstraction").' },
            { name: 'hero_slideshow_label', type: 'string', group: 'Hero', description: 'Small label on the slideshow caption (e.g. "Featured Work").' },

            // Available Works
            { name: 'available_title', type: 'string', group: 'Available Works' },
            { name: 'available_cta', type: 'string', group: 'Available Works', description: 'Primary button label (e.g. "View available works").' },
            { name: 'available_secondary_cta', type: 'string', group: 'Available Works', description: 'Secondary link label (e.g. "Browse past works →").' },

            // About
            { name: 'about_big_title', type: 'string', group: 'About' },
            { name: 'about_section_label', type: 'string', group: 'About', description: 'Small heading on the left column.' },
            { name: 'about_cta', type: 'string', group: 'About', description: 'Link label (e.g. "Read Full Biography").' },

            // Past Works
            { name: 'past_works_title', type: 'string', group: 'Past Works' },
            { name: 'past_works_subhead', type: 'string', group: 'Past Works' },
            { name: 'past_works_cta', type: 'string', group: 'Past Works' },

            // Collectors
            { name: 'collectors_cta', type: 'string', group: 'Collectors', description: 'Button label below the collectors carousel.' },

            // Exhibitions
            { name: 'exhibitions_title', type: 'string', group: 'Exhibitions' },
            { name: 'exhibitions_subhead', type: 'string', group: 'Exhibitions' },
            { name: 'exhibitions_cta', type: 'string', group: 'Exhibitions' },

            // Contact
            { name: 'contact_headline', type: 'string', group: 'Contact' },
            { name: 'contact_body', type: 'text', group: 'Contact' },
            { name: 'contact_cta', type: 'string', group: 'Contact' },
          ],
        },

        // ─── Homepage "The Artist" data block (portrait + hero paragraphs) ──
        // Read by HomeV4 hero (hero_subhead). Not the page-of-record any more.
        {
          name: 'HomeArtistSection',
          type: 'data',
          filePath: 'content/pages/home-artist.md',
          fields: [
            { name: 'portrait_image', type: 'image' },
            { name: 'bio_intro', type: 'string', description: 'Artist name shown above the hero paragraphs.' },
            { name: 'hero_subhead', type: 'text', description: 'Hero paragraphs under the big headline. Separate paragraphs with a blank line.' },
          ],
        },

        // ─── Contact page ─────────────────────────────────────────────
        {
          name: 'ContactPage',
          type: 'page',
          urlPath: '/contact',
          filePath: 'content/pages/contact.md',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'intro', type: 'text' },
            { name: 'email', type: 'string' },
            { name: 'instagram', type: 'string' },
            { name: 'response_note', type: 'text' },
          ],
        },

        // ─── Site-wide settings ───────────────────────────────────────
        {
          name: 'SiteSettings',
          type: 'data',
          filePath: 'content/settings/site.json',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'seo_title', type: 'string' },
            { name: 'seo_description', type: 'text' },
            { name: 'inquiry_email', type: 'string' },
            { name: 'footer_text', type: 'string' },
            { name: 'instagram', type: 'string' },
            { name: 'tagline', type: 'string' },
          ],
        },

        // ─── Collector Items ──────────────────────────────────────────
        {
          name: 'CollectorItem',
          type: 'data',
          labelField: 'title',
          filePath: 'content/collectors/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'slug', required: true },
            { name: 'painting_title', type: 'string' },
            { name: 'image', type: 'image', required: true },
            { name: 'caption', type: 'text' },
            { name: 'sort_order', type: 'number' },
          ],
        },

        // ─── Collectors Edit page ───────────────────────────────────────
        {
          name: 'CollectorsEditPage',
          type: 'page',
          urlPath: '/collectors-edit',
          filePath: 'content/pages/collectors-edit.md',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'intro', type: 'text' },
            { name: 'seo_title', type: 'string' },
            { name: 'seo_description', type: 'text' },
          ],
        },
      ],
    }),
  ],
})
