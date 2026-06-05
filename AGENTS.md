# AGENTS.md - KubeDB Website

This file provides instructions for AI coding agents working in this Hugo-based static website repository.

## Project Overview

Hugo static website for KubeDB (Kubernetes database operator platform). Aggregates documentation from 27+ database operators (Cassandra, ClickHouse, Druid, Elasticsearch, Kafka, MariaDB, MongoDB, MySQL, PostgreSQL, Redis, etc.) and provides marketing content, articles, and product information. Uses custom `hugo-product-theme` as a git submodule.

## Build & Development Commands

```bash
# Local development server (uses config.yaml)
make run
hugo server --config=config.yaml

# Production build with minification
make gen-prod

# Development build (no minification)
make gen

# Deploy to Firebase staging
make qa

# Deploy to Firebase production
make release

# Aggregate docs from remote repositories
make docs               # Full sync: docs + assets
make docs-skip-assets    # Docs content only (faster)
make assets              # Static assets only

# Check for broken links (requires running hugo server)
make check-links
```

### Version Management

```bash
# Update Firebase redirects to new docs version
make set-version VERSION=v2026.1.19

# Update static assets repo URL
make set-assets-repo ASSETS_REPO_URL=https://github.com/appscode/static-assets
```

## Project Structure

```
content/
  docs/v{VERSION}/     # Versioned documentation (100+ versions)
  articles/            # SEO blog posts
  datasheet/{lang}/    # Multi-language datasheets (en, ar, pt, zh-hk, ja)
  features/            # Product feature pages
data/
  products/*.json      # Product metadata, versions, features
  config.json          # Docs aggregation configuration
layouts/
  _default/            # Template overrides
  shortcodes/          # Custom shortcodes (catalogtable, code, notice, versionlist)
themes/
  hugo-product-theme/  # Git submodule - base theme
static/
  assets/images/       # Images (use /assets/ prefix in content)
  files/               # Product files
```

## Configuration

- **config.yaml** - Production domains (kubedb.com, appscode.com)
- **config.yaml** - Firebase preview domains (`*-hugo.web.app`)
- **data/config.json** - Docs aggregation source repos and paths
- **firebase.json** - Hosting rules and redirects

The two config files share the same structure: menu definitions, markup settings, output formats (HTML + JSON for search).

### data/config.json

```json
{
  "assets": {
    "repoURL": "https://github.com/appscode/static-assets",
    "version": "master",
    "dirs": { "data": "data", "files": "static/files", "images": "static/assets/images" }
  }
}
```

The `hugo-tools docs-aggregator` reads this file to fetch versioned documentation from external repositories. After aggregation, CDN URLs are replaced with local paths using `sed`.

## Content Conventions

### Front Matter - Documentation

```yaml
---
title: Page Title
menu:
  docs_v2026.1.19:
    identifier: unique-id
    name: Display Name
    parent: parent-id
    weight: 10
menu_name: docs_v2026.1.19
info:
  autoscaler: v0.45.0
  cli: v0.60.0
  installer: v2026.1.19
---
```

### Front Matter - Articles

```yaml
---
title: Install MySQL using Kubernetes MySQL Operator
Description: SEO-friendly description
alt: Alt text for hero image
date: "2023-09-05"
---
```

### Link Formatting

- Internal docs: `/docs/{version}/{section}/` (trailing slash required)
- Cross-product: Use `domain_` params - `{{ .Site.Params.domain_stash }}`
- Images: Always `/assets/images/` prefix, never `../` relative paths

### Menu Structure

- Main navigation defined in `config.yaml` under `menu.main`
- Database dropdown (`identifier: database`) populated with 27+ databases
- Each database entry includes `pre:` for icon path (`/assets/images/databases/logos/png/{db}s.png`)

### Adding a Database

Edit `config.yaml` under `menu.main`:

```yaml
- name: DatabaseName
  identifier: database-id
  parent: database
  weight: 28
  pre: /assets/images/databases/logos/png/database-ids.png
```

### Creating New Version Docs

1. Create `content/docs/v{VERSION}/` directory
2. Copy structure from previous version
3. Update all `menu_name` and `info` version references in front matter
4. Update `firebase.json` redirects via `make set-version`

### Updating Product Metadata

Edit `data/products/{product}.json` - includes versions array, features, badges, logos. Changes automatically reflect in generated pages.

## Shortcodes

- `{{< notice >}}` - Alerts and callouts
- `{{< catalogtable >}}` - Addon version tables
- `{{< code >}}` - Syntax-highlighted code blocks
- Located in `layouts/shortcodes/` (overrides) and `themes/hugo-product-theme/layouts/shortcodes/`

## CSS Processing

1. PostCSS with Autoprefixer (`postcss.config.js`)
2. PurgeCSS via `process-css.js` removes unused CSS using `hugo_stats.json`
3. Safelist: form elements (`fserv-*`, `fs-*`, `select2-*`), dynamic classes

## Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Hugo | v0.128.2 (extended) | Static site generator |
| Node.js | v20+ | PostCSS processing |
| Firebase CLI | v11.13.0 | Deployment |
| hugo-tools | latest | Docs aggregation (auto-downloaded) |
| yq | v3.3.0 | YAML processing in CI |

## Testing & Validation

There are no unit tests. Validation is via:

1. **Build check** - `make gen-prod` must succeed without errors
2. **Link checking** - `make check-links` (requires local server running)
3. **CI pipeline** - `.github/workflows/ci.yml` runs build on PRs

## Build Artifacts (all gitignored)

- `public/` - Generated site
- `resources/_gen/` - Hugo cache
- `bin/` - Downloaded tools
- `hugo_stats.json` - CSS class tracking

## SEO & Search

- Custom sitemap in `layouts/_default/sitemap.xml` excludes old doc versions
- Only latest version docs (currently `v2026.1.19`) are in sitemap; update `$latestVersion` when releasing
- Typesense/Meilisearch for search (API key in params); search index updated on release via GitHub Actions
- Google Analytics (UA-62096468-4)
- Giscus comments via GitHub Discussions

## CI/CD Workflows

- **ci.yml** - PR build validation, link checking (disabled)
- **release.yml** - Tag-based Firebase deploys (prod vs QA based on tag format)
- **release-tracker.yml** - Commit message parsing for release coordination
- Secrets: `FIREBASE_TOKEN`, `GOOGLE_CUSTOM_SEARCH_API_KEY`, `MEILISEARCH_ADMIN_API_KEY`

## Common Mistakes to Avoid

- Don't use relative image paths (`../images/`); use `/assets/images/`
- Don't forget trailing slashes on internal links
- Don't edit `themes/hugo-product-theme/` directly; override in root `layouts/`
- Don't commit `public/`, `bin/`, or `resources/` directories
- Don't modify old versioned docs unless specifically requested
