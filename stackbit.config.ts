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
        // Schema aligned with Decap config (was previously missing 9 fields).
        {
          name: 'Exhibition',
          type: 'data',
          labelField: 'title',
          filePath: 'content/exhibitions/{slug}.md',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'year', type: 'string' },
            { name: 'start_date', type: 'date', description: 'Optional. Leave blank to show year only.' },
            { name: 'end_date', type: 'date' },
            { name: 'featured', type: 'boolean', description: 'Pin this exhibition to the top of /exhibitions as a Hero/Next card.' },
            { name: 'venue', type: 'string' },
            { name: 'city', type: 'string' },
            {
              name: 'exhibition_type',
              type: 'enum',
              options: [
                { label: 'Solo', value: 'Solo' },
                { label: 'Group', value: 'Group' },
                { label: 'Residency', value: 'Residency' },
                { label: 'Art Fair', value: 'Art Fair' },
              ],
            },
            { name: 'hero_image', type: 'image', description: 'Full-bleed image at the top of the detail page.' },
            { name: 'card_thumbnail', type: 'image', description: 'Optional. Used on archive grid cards. Falls back to hero_image.' },
            { name: 'hero_video', type: 'string', description: 'Optional. Path to MP4 or URL (YouTube / Vimeo / Cloudinary). Replaces hero_image when set.' },
            { name: 'description', type: 'text', description: 'Short description shown on listing rows.' },
            // The exhibition's long-form body is the markdown content BELOW the
            // frontmatter delimiter, not a frontmatter field. Stackbit auto-exposes
            // it under the canonical name `markdown_content`. Declaring it here
            // explicitly so the side panel labels it nicely.
            { name: 'markdown_content', type: 'markdown', description: 'Long-form editorial body. Inline ![](url) supports images AND videos.' },
            {
              name: 'gallery',
              type: 'list',
              items: {
                type: 'object',
                fields: [
                  { name: 'image', type: 'image' },
                  { name: 'video', type: 'string', description: 'Optional. MP4 path or YouTube / Vimeo / Cloudinary URL. Replaces image when set.' },
                  { name: 'caption', type: 'string' },
                ],
              },
            },
            { name: 'works_shown', type: 'list', items: { type: 'string' }, description: 'Painting slugs shown at this exhibition (matches Decap relation widget).' },
            { name: 'link', type: 'string', description: 'Optional external press link.' },
            { name: 'image', type: 'image', description: 'Legacy field. Use hero_image / card_thumbnail going forward.' },
            { name: 'sort_order', type: 'number' },
          ],
        },


        // ─── Exhibitions listing page ─────────────────────────────────
        {
          name: 'ExhibitionsPage',
          type: 'page',
          urlPath: '/exhibitions',
          filePath: 'content/pages/exhibitions.md',
          fieldGroups: [
            { name: 'Hero', label: 'Hero' },
            { name: 'Pool', label: 'Image Pool' },
            { name: 'Archive Section', label: 'Archive Section' },
            { name: 'Card Labels', label: 'Card Labels' },
            { name: 'States', label: 'Empty / SEO' },
          ],
          fields: [
            // Hero
            { name: 'hero_eyebrow', type: 'string', group: 'Hero', description: 'Small label above the title (e.g. "Archive").' },
            { name: 'hero_title_prefix', type: 'string', group: 'Hero', description: 'First part of the title — rendered upright (e.g. "The ").' },
            { name: 'hero_title_italic', type: 'string', group: 'Hero', description: 'Italic emphasis part of the title (e.g. "Archive").' },
            { name: 'count_singular', type: 'string', group: 'Hero', description: 'Word shown after the count when there is exactly 1 exhibition (e.g. "exhibition").' },
            { name: 'count_plural', type: 'string', group: 'Hero', description: 'Word shown after the count when there are 0 or 2+ exhibitions (e.g. "exhibitions").' },
            // Image Pool
            { name: 'pool_section_label', type: 'string', group: 'Pool', description: 'Small label above the photo pool (e.g. "Moments").' },
            { name: 'pool_section_intro', type: 'text', group: 'Pool', description: 'Italic serif intro above the masonry photo pool.' },
            // Archive Section
            { name: 'archive_section_label', type: 'string', group: 'Archive Section', description: 'Small label above the archive section intro (e.g. "Exhibition History").' },
            { name: 'archive_section_intro', type: 'text', group: 'Archive Section', description: 'Italic serif intro paragraph above the year-grouped exhibition list.' },
            // Card Labels
            { name: 'view_exhibition_label', type: 'string', group: 'Card Labels', description: 'CTA label shown on Hero and Next featured cards (e.g. "View exhibition").' },
            { name: 'next_badge_label', type: 'string', group: 'Card Labels', description: 'Badge text on the second featured card (e.g. "Next").' },
            { name: 'exhibition_type_fallback', type: 'string', group: 'Card Labels', description: 'Fallback shown on the Next card when an exhibition has no exhibition_type (e.g. "Exhibition").' },
            // States / SEO
            { name: 'empty_state', type: 'text', group: 'States', description: 'Message shown when no exhibitions exist.' },
            { name: 'seo_title', type: 'string', group: 'States', description: 'Browser tab title.' },
            { name: 'seo_description', type: 'text', group: 'States', description: 'SEO meta description.' },
          ],
        },

        // ─── About page ───────────────────────────────────────────────
        {
          name: 'AboutPage',
          type: 'page',
          urlPath: '/about',
          filePath: 'content/pages/about.md',
          fieldGroups: [
            { name: 'Hero', label: 'Hero' },
            { name: 'Biography', label: 'Biography' },
            { name: 'Statement', label: 'Statement' },
            { name: 'CTA', label: 'Closing CTA' },
            { name: 'SEO', label: 'SEO / Meta' },
          ],
          fields: [
            // SEO / Meta
            { name: 'title', type: 'string', group: 'SEO', description: 'Browser tab title (also used as fallback page heading).' },

            // Hero
            { name: 'hero_eyebrow', type: 'string', group: 'Hero', description: 'Small label above the big heading (e.g. "About").' },
            { name: 'hero_title', type: 'string', group: 'Hero', description: 'Big page heading (e.g. "About the artist").' },
            { name: 'bio_intro', type: 'text', group: 'Hero', description: 'Short intro paragraph(s) under the heading. Supports inline markdown (**bold**, *italic*, [link](url)).' },
            { name: 'portrait_image', type: 'image', group: 'Hero' },

            // Biography
            { name: 'biography_title', type: 'string', group: 'Biography', description: 'Section heading (e.g. "Biography").' },
            { name: 'biography_subhead', type: 'string', group: 'Biography', description: 'Small heading in the left column (e.g. "About the artist").' },
            { name: 'bio_body', type: 'markdown', group: 'Biography', description: 'Long-form biography. Full markdown supported.' },

            // Statement
            { name: 'statement_label', type: 'string', group: 'Statement', description: 'Eyebrow label (e.g. "Artist statement").' },
            { name: 'artist_statement', type: 'text', group: 'Statement', description: 'Big quoted statement. Supports inline markdown.' },
            { name: 'studio_label', type: 'string', group: 'Statement', description: 'Eyebrow label (e.g. "Studio note").' },
            { name: 'studio_note', type: 'text', group: 'Statement' },

            // CTA
            { name: 'cta_eyebrow', type: 'string', group: 'CTA', description: 'Small label above the CTA heading (e.g. "Continue").' },
            { name: 'cta_title', type: 'string', group: 'CTA', description: 'CTA heading (e.g. "Explore further").' },
            { name: 'cta_body', type: 'text', group: 'CTA', description: 'CTA paragraph copy.' },
            { name: 'cta_contact_button', type: 'string', group: 'CTA', description: 'Primary button label (e.g. "Get in touch").' },
            { name: 'cta_available_link', type: 'string', group: 'CTA', description: 'Secondary link label (e.g. "View available works").' },
            { name: 'cta_exhibitions_link', type: 'string', group: 'CTA', description: 'Secondary link label (e.g. "View exhibitions").' },
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
            { name: 'Social', label: 'Social' },
            { name: 'Past Works', label: 'Past Works' },
            { name: 'Collectors', label: 'Collectors' },
            { name: 'Exhibitions', label: 'Exhibitions' },
            { name: 'Contact', label: 'Contact' },
            { name: 'Artist Block', label: 'Hero — Artist Block' },
          ],
          fields: [
            // Hero
            { name: 'hero_headline_line1', type: 'string', group: 'Hero', description: 'First line of the big headline (e.g. "Explore the intersection").' },
            { name: 'hero_headline_line2', type: 'string', group: 'Hero', description: 'Second line of the big headline (e.g. "of spirituality and abstraction").' },
            { name: 'hero_slideshow_label', type: 'string', group: 'Hero', description: 'Small label on the slideshow caption (e.g. "Featured Work").' },
            { name: 'hero_portrait_image', type: 'image', group: 'Hero', required: false, description: 'Black-and-white portrait shown top-right of the hero. Upload a normal color photo — the site renders it B&W.' },

            // Available Works
            { name: 'available_title', type: 'string', group: 'Available Works' },
            { name: 'available_cta', type: 'string', group: 'Available Works', description: 'Primary button label (e.g. "View available works").' },
            { name: 'available_secondary_cta', type: 'string', group: 'Available Works', description: 'Secondary link label (e.g. "Browse past works →").' },

            // About
            { name: 'about_big_title', type: 'string', group: 'About' },
            { name: 'about_section_label', type: 'string', group: 'About', description: 'Small heading on the left column.' },
            { name: 'about_cta', type: 'string', group: 'About', description: 'Link label (e.g. "Read Full Biography").' },
            { name: 'about_decoration_left_image', type: 'image', group: 'About', description: 'Small decorative painting on the LEFT of the About section. Defaults to the first available painting if not set.' },
            { name: 'about_decoration_right_image', type: 'image', group: 'About', description: 'Small decorative painting on the RIGHT of the About section. Defaults to the second available painting if not set.' },

            // Social
            { name: 'social_subhead', type: 'string', group: 'Social', description: 'Small label above the social heading (e.g. "Stay close to the studio").' },
            { name: 'social_title', type: 'string', group: 'Social', description: 'Big serif heading (e.g. "Follow the journey").' },
            { name: 'social_handle', type: 'string', group: 'Social', description: 'Instagram @handle shown large. Links to the Instagram URL in Site Settings.' },
            { name: 'social_cta', type: 'string', group: 'Social', description: 'Primary follow button label (e.g. "Follow on Instagram").' },

            // Past Works
            { name: 'past_works_title', type: 'string', group: 'Past Works' },
            { name: 'past_works_subhead', type: 'string', group: 'Past Works' },
            { name: 'past_works_cta', type: 'string', group: 'Past Works' },

            // Collectors
            { name: 'collectors_title', type: 'string', group: 'Collectors', description: 'Section heading (e.g. "Collectors Edit").' },
            { name: 'collectors_subhead', type: 'string', group: 'Collectors', description: 'Small subheading under the section heading.' },
            { name: 'collectors_cta', type: 'string', group: 'Collectors', description: 'Button label below the collectors carousel.' },

            // Exhibitions
            { name: 'exhibitions_title', type: 'string', group: 'Exhibitions' },
            { name: 'exhibitions_subhead', type: 'string', group: 'Exhibitions' },
            { name: 'exhibitions_cta', type: 'string', group: 'Exhibitions' },

            // Contact
            { name: 'contact_headline', type: 'string', group: 'Contact' },
            { name: 'contact_body', type: 'text', group: 'Contact' },
            { name: 'contact_cta', type: 'string', group: 'Contact' },

            // Hero — Artist Block (merged from former HomeArtistSection)
            { name: 'portrait_image', type: 'image', group: 'Artist Block', required: false },
            { name: 'bio_intro', type: 'string', group: 'Artist Block', required: false, description: 'Artist name shown above the hero paragraphs.' },
            { name: 'hero_subhead', type: 'markdown', group: 'Artist Block', required: false, description: 'Hero paragraphs under the big headline. Rich-text modal: supports paragraphs, bold, italic, and links.' },
          ],
        },

        // ─── Available Works listing page ─────────────────────────────
        {
          name: 'AvailablePage',
          type: 'page',
          urlPath: '/available',
          filePath: 'content/pages/available.md',
          fields: [
            { name: 'hero_eyebrow', type: 'string', description: 'Small label above the big heading.' },
            { name: 'hero_title', type: 'string', description: 'Big page heading.' },
            { name: 'hero_description', type: 'text', description: 'Intro paragraph under the heading.' },
            { name: 'tile_hover_label', type: 'string', description: 'Label shown when hovering a painting tile (e.g. "View this piece").' },
            { name: 'tile_view_label', type: 'string', description: 'Label on the small underlined link under each tile (e.g. "View").' },
            { name: 'empty_state', type: 'text', description: 'Message shown when no paintings are currently available.' },
            { name: 'seo_title', type: 'string', description: 'Browser tab title.' },
            { name: 'seo_description', type: 'text', description: 'SEO meta description.' },
          ],
        },

        // ─── Past Works listing page ──────────────────────────────────
        {
          name: 'PastWorksPage',
          type: 'page',
          urlPath: '/past-works',
          filePath: 'content/pages/past-works.md',
          fields: [
            { name: 'hero_eyebrow', type: 'string', description: 'Small label above the big heading.' },
            { name: 'hero_title', type: 'string', description: 'Big page heading.' },
            { name: 'hero_description', type: 'text', description: 'Intro paragraph under the heading.' },
            { name: 'tile_status_label', type: 'string', description: 'Badge label on each tile (e.g. "In Private Collection").' },
            { name: 'tile_hover_label', type: 'string', description: 'Label shown when hovering a painting tile (e.g. "View work").' },
            { name: 'tile_view_label', type: 'string', description: 'Label on the small underlined link under each tile (e.g. "View").' },
            { name: 'empty_state', type: 'text', description: 'Message shown when there are no past works yet.' },
            { name: 'seo_title', type: 'string', description: 'Browser tab title.' },
            { name: 'seo_description', type: 'text', description: 'SEO meta description.' },
          ],
        },

        // ─── Exhibition detail page — shared chrome ───────────────────
        // Shared labels used on EVERY /exhibitions/:slug page.
        // Per-exhibition data lives on the Exhibition model above.
        {
          name: 'ExhibitionDetailChrome',
          type: 'data',
          filePath: 'content/pages/exhibition-detail-chrome.md',
          fields: [
            { name: 'back_link_label', type: 'string', description: 'Back link to /exhibitions (e.g. "← The Archive").' },
            { name: 'works_shown_eyebrow', type: 'string', description: 'Eyebrow above the Works Shown grid (e.g. "Works").' },
            { name: 'works_shown_title', type: 'string', description: 'Section title for the Works Shown grid (e.g. "Works Shown").' },
            { name: 'read_more_label', type: 'string', description: 'External link CTA (e.g. "Read more →").' },
            { name: 'not_found_title', type: 'string', description: 'Heading shown when an exhibition URL is invalid.' },
          ],
        },

        // ─── Painting detail page — shared chrome ─────────────────────
        // Shared labels/headings used on EVERY /paintings/:slug page.
        // Per-painting fields (title, year, medium, image, etc.) live on
        // the Painting model — this file is for the chrome that wraps them.
        {
          name: 'PaintingDetailChrome',
          type: 'data',
          filePath: 'content/pages/painting-detail-chrome.md',
          fieldGroups: [
            { name: 'Back Link', label: 'Back Link' },
            { name: 'Specs', label: 'Spec Labels' },
            { name: 'Artist Note', label: 'Artist Note Section' },
            { name: 'Inquire', label: 'Inquire Section' },
            { name: 'Form', label: 'Inquiry Form' },
            { name: 'Related', label: 'Related Works Section' },
            { name: 'States', label: 'Empty / Error States' },
          ],
          fields: [
            // Back link
            { name: 'back_to_available', type: 'string', group: 'Back Link', description: 'Back link shown on Available pieces (e.g. "← Available Works").' },
            { name: 'back_to_past', type: 'string', group: 'Back Link', description: 'Back link shown on Sold pieces (e.g. "← Past Works").' },

            // Spec labels
            { name: 'spec_label_medium', type: 'string', group: 'Specs', description: 'Label for the Medium row.' },
            { name: 'spec_label_dimensions', type: 'string', group: 'Specs', description: 'Label for the Dimensions row.' },
            { name: 'spec_label_year', type: 'string', group: 'Specs', description: 'Label for the Year row.' },
            { name: 'spec_label_availability', type: 'string', group: 'Specs', description: 'Label for the Availability row.' },
            { name: 'availability_available', type: 'string', group: 'Specs', description: 'Value shown when painting is available (e.g. "Available").' },
            { name: 'availability_sold', type: 'string', group: 'Specs', description: 'Value shown when painting is sold (e.g. "Sold").' },

            // Artist note
            { name: 'artist_note_title', type: 'string', group: 'Artist Note', description: 'Heading for the long-form description section (e.g. "Artist\'s Note").' },

            // Inquire
            { name: 'inquire_title_available', type: 'string', group: 'Inquire', description: 'Heading shown for available pieces (e.g. "Inquire About This Piece").' },
            { name: 'inquire_title_sold', type: 'string', group: 'Inquire', description: 'Heading shown for sold pieces (e.g. "Inquire About Similar Works").' },
            { name: 'inquire_sold_note', type: 'text', group: 'Inquire', description: 'Extra note shown only on sold pieces.' },

            // Form
            { name: 'form_label_name', type: 'string', group: 'Form' },
            { name: 'form_label_phone', type: 'string', group: 'Form' },
            { name: 'form_label_email', type: 'string', group: 'Form' },
            { name: 'form_submit', type: 'string', group: 'Form', description: 'Submit button label.' },
            { name: 'form_submitting', type: 'string', group: 'Form', description: 'Submit button label while sending.' },
            { name: 'form_success_title', type: 'string', group: 'Form', description: 'Heading shown after a successful submission.' },
            { name: 'form_success_body', type: 'text', group: 'Form' },
            { name: 'form_error', type: 'string', group: 'Form', description: 'Error message shown if submission fails.' },

            // Related works
            { name: 'related_title', type: 'string', group: 'Related', description: 'Heading for the "You may also like" section.' },
            { name: 'related_tile_hover', type: 'string', group: 'Related', description: 'Label shown when hovering a related painting tile.' },
            { name: 'related_tile_view', type: 'string', group: 'Related', description: 'Small "View" link under each related tile.' },

            // Empty / error states
            { name: 'not_found_title', type: 'string', group: 'States', description: 'Heading shown when a painting URL is invalid.' },
            { name: 'not_found_cta', type: 'string', group: 'States', description: 'Link shown on the not-found page.' },
            { name: 'image_forthcoming_label', type: 'string', group: 'States', description: 'Placeholder text shown when a painting has no image yet.' },
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
            { name: 'facebook', type: 'string' },
            { name: 'tagline', type: 'string' },
          ],
        },

        // ─── Exhibition Gallery Items ─────────────────────────────────
        {
          name: 'ExhibitionGalleryItem',
          type: 'data',
          labelField: 'caption',
          filePath: 'content/exhibition-gallery/{slug}.md',
          fields: [
            { name: 'image', type: 'image' },
            { name: 'video', type: 'file' },
            { name: 'caption', type: 'string' },
            { name: 'sort_order', type: 'number' },
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
          fieldGroups: [
            { name: 'Hero', label: 'Hero' },
            { name: 'Tiles', label: 'Tile Labels' },
            { name: 'States', label: 'Empty / Navigation' },
            { name: 'SEO', label: 'SEO / Meta' },
          ],
          fields: [
            // Hero
            { name: 'hero_eyebrow', type: 'string', group: 'Hero', description: 'Optional small label above the big heading.' },
            { name: 'hero_title', type: 'string', group: 'Hero', description: 'Big page heading (e.g. "The Collectors Edit").' },
            { name: 'intro', type: 'markdown', group: 'Hero', description: 'Short intro paragraph(s) under the heading. Inline emphasis only.' },
            // Tiles
            { name: 'tile_hover_label', type: 'string', group: 'Tiles', description: 'Label shown when hovering a collector image (e.g. "View").' },
            // States / Navigation
            { name: 'empty_state', type: 'text', group: 'States', description: 'Message shown when no collector pieces are added.' },
            { name: 'back_button_label', type: 'string', group: 'States', description: 'Label on the "Back to Home" button at the bottom.' },
            // SEO
            { name: 'title', type: 'string', group: 'SEO', description: 'Legacy title field (kept for backward compatibility).' },
            { name: 'seo_title', type: 'string', group: 'SEO', description: 'Browser tab title.' },
            { name: 'seo_description', type: 'text', group: 'SEO', description: 'SEO meta description.' },
          ],
        },
      ],
    }),
  ],
})
