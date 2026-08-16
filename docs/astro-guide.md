# Astro Guide — jeffclarenz.com

## What is Astro?

Astro is a static site framework. It builds your site into plain HTML files that can be hosted anywhere — no Node.js server required in production. Every page is a `.astro` file that looks like HTML with a script block at the top called the **frontmatter**.

Key ideas:

- **Zero JS by default.** Astro strips all JavaScript from the output unless you explicitly add it with `<script>` tags. Pages load fast.
- **File-based routing.** `src/pages/about.astro` becomes `/about`. `src/pages/writing/[slug].astro` becomes `/writing/some-post`.
- **Build-time data fetching.** API calls (like the Sanity fetch) run at build time, not in the browser. The result is baked into static HTML.
- **Components.** `.astro` files in `src/components/` are reusable snippets — Nav, Footer, etc. They work like HTML partials.

---

## Project structure

```
jeffclarenz-dot-com/
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # HTML shell used by every page
│   ├── components/
│   │   ├── Nav.astro           # Sticky nav bar (theme toggle lives here)
│   │   └── Footer.astro        # Site footer
│   ├── lib/
│   │   └── sanity.ts           # Sanity client, Portable Text renderer, fallback posts
│   └── pages/
│       ├── index.astro         # Home (/)
│       ├── work.astro          # Work (/work)
│       ├── about.astro         # About (/about)
│       ├── contact.astro       # Contact (/contact)
│       └── writing/
│           ├── index.astro     # Post list (/writing)
│           └── [slug].astro    # Individual post (/writing/some-slug)
├── public/                     # Static assets (images, fonts, etc.) — copied as-is
├── docs/
│   └── astro-guide.md          # This file
├── archive/                    # Old DC-framework files, kept for reference
├── astro.config.mjs            # Astro config (site URL, integrations)
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## How to run locally

```bash
npm install          # first time only
npm run dev          # starts dev server at http://localhost:4321
```

The dev server has **hot reload** — save a file and the browser updates instantly.

---

## How to update content

### Change text on a page

Open the relevant file in `src/pages/` and edit the HTML directly. The frontmatter (between the `---` fences at the top) is TypeScript that runs at build time. Everything below is the HTML template.

Example — to change the hero headline, open [src/pages/index.astro](../src/pages/index.astro) and find the `<h1>` tag.

### Add a new writing post

Posts are pulled from Sanity at build time. To add a post:

1. Go to your Sanity Studio and create a new `post` document with:
   - `title` — post title
   - `slug.current` — URL-safe slug (e.g. `my-new-post`)
   - `date` — display date (e.g. `Sep 2026`)
   - `tags` — comma/dot separated tags (e.g. `devops · reliability`)
   - `excerpt` — one-sentence summary shown in the list
   - `body` — Portable Text content (Sanity's rich text format)

2. Run `npm run build` or redeploy — the new post is fetched at build time and becomes a static page at `/writing/my-new-slug`.

**Fallback posts:** If Sanity is unreachable or returns zero results, the three hardcoded posts in `src/lib/sanity.ts` are shown instead. Edit them there if you want to change the fallback content.

### Change the Sanity project

The Sanity config is at the top of `src/lib/sanity.ts`:

```ts
export const sanity = createClient({
  projectId: 'fy0w8fxa',   // ← your Sanity project ID
  dataset: 'production',
  apiVersion: '2021-10-21',
  useCdn: true,
});
```

### Add a new page

1. Create `src/pages/my-page.astro`
2. Use the Layout and Nav components:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<Layout title="My Page — Jeff Clarenz">
  <Nav />
  <main>
    <!-- your content here -->
  </main>
  <Footer />
</Layout>
```

3. The page is automatically available at `/my-page`.
4. Add a link to Nav.astro if it belongs in the navigation.

### Update the nav active state

`Nav.astro` accepts an `active` prop that highlights the current nav item:

```astro
<Nav active="work" />   <!-- highlights "work" in the nav -->
```

Valid values: `work`, `about`, `writing`, `contact`. Omit the prop on the home page.

### Add images

Drop image files into `public/` and reference them with a root-relative path:

```html
<img src="/my-photo.jpg" alt="..." />
```

---

## Theme (dark / light)

The theme is stored in `localStorage` under the key `jc-theme`. The anti-flash script in `Layout.astro` reads it before the page renders so there's no flicker. The toggle button in `Nav.astro` switches between `dark` and `light` and saves the preference.

CSS variables for both themes are defined in `Layout.astro` under `:root` and `[data-theme="dark"]`.

---

## Build and deploy

```bash
npm run build      # outputs static files to dist/
npm run preview    # local preview of the built output
```

The `dist/` folder contains plain HTML/CSS/JS — deploy it to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

For Vercel/Netlify, connect the repo and set:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

---

## Updating Astro

```bash
npx @astrojs/upgrade    # interactive upgrade wizard
```

Or manually:

```bash
npm install astro@latest
```

Check the [Astro changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) before upgrading major versions.
