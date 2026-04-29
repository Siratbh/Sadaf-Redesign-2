import { defineStackbitConfig } from '@stackbit/types'
import { GitContentSource } from '@stackbit/cms-git'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
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
            { name: 'collection', type: 'string' },
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

        // ─── Collections ──────────────────────────────────────────────
        {
          name: 'Collection',
          type: 'data',
          labelField: 'title',
          filePath: 'content/collections/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'slug', required: true },
            { name: 'cover_image', type: 'image' },
            { name: 'intro', type: 'text' },
            { name: 'series_note', type: 'text' },
            { name: 'featured', type: 'boolean' },
            { name: 'seo_title', type: 'string' },
            { name: 'seo_description', type: 'text' },
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

        // ─── Homepage "The Artist" section ────────────────────────────
        {
          name: 'HomeArtistSection',
          type: 'page',
          urlPath: '/',
          filePath: 'content/pages/home-artist.md',
          fields: [
            { name: 'portrait_image', type: 'image' },
            { name: 'bio_intro', type: 'text' },
            { name: 'bio_body', type: 'text' },
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
