# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hugo static website for KubeDB (Kubernetes database operator platform). Aggregates documentation from 27+ database operators and provides marketing content, articles, and product information. Uses `hugo-product-theme` as a git submodule (`themes/hugo-product-theme/`).

## Commands

```bash
# Local development server
make run                          # hugo server --config=config.yaml

# Build
make gen                          # Development build (no minification)
make gen-prod                     # Production build with minification

# Deploy
make qa                           # Deploy to Firebase staging
make release                      # Deploy to Firebase production

# Aggregate docs from remote repositories
make docs                         # Full sync: docs + assets
make docs-skip-assets             # Docs content only (faster)
make assets                       # Static assets only

# Version management
make set-operator-version VERSION=v2026.1.19
make set-platform-version VERSION=v2026.1.19
make set-assets-repo ASSETS_REPO_URL=https://github.com/appscode/static-assets

# Link checking (requires running server)
make check-links
```

## Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Hugo | v0.128.2 (extended) | Static site generator |
| Node.js | v20+ | PostCSS processing |
| Firebase CLI | v11.13.0 | Deployment |
| hugo-tools | latest | Docs aggregation (auto-downloaded to `bin/`) |
| yq | v3.3.0 | YAML processing in CI |

## Architecture

### Configuration

- **config.yaml** — Production config (domains, menus, markup, Hugo params)
- **config.dev.yaml** — Development overrides (Firebase preview domains `*-hugo.web.app`)
- **data/config.json** — Controls docs aggregation: source repos, paths, asset URLs
- **firebase.json** — Hosting rules and URL redirects (updated by `make set-operator-version`)

Both config files share the same structure. The `hugo-tools docs-aggregator` reads `data/config.json` to fetch versioned docs from external repos; CDN URLs (`cdn.appscode.com`) are then replaced with local paths (`/assets/images`) via `sed`.

### Content Structure

```
content/
  docs/v{VERSION}/     # Versioned operator docs (100+ versions, aggregated)
  docs/platform/       # Platform docs (aggregated separately)
  articles/            # SEO blog posts
  datasheet/{lang}/    # Multi-language datasheets (en, ar, pt, zh-hk, ja)
  features/            # Product feature pages
data/
  products/*.json      # Product metadata, versions, features, badges
  config.json          # Docs aggregation configuration
layouts/               # Template overrides (takes precedence over theme)
  shortcodes/          # Custom shortcodes
static/
  assets/images/       # Images (always use /assets/ prefix, never ../relative)
  files/               # Product files
themes/
  hugo-product-theme/  # Git submodule — never edit directly
```

### Layout Override Pattern

Override theme templates by placing files with the same relative path under root `layouts/`. Custom shortcodes in `layouts/shortcodes/` override those in `themes/hugo-product-theme/layouts/shortcodes/`.

Available shortcodes: `notice`, `catalogtable`, `code`, `versionlist`.

### CSS Pipeline

1. PostCSS + Autoprefixer (`postcss.config.js`)
2. PurgeCSS via `process-css.js` uses `hugo_stats.json` to remove unused classes
3. Safelist: `fserv-*`, `fs-*`, `select2-*` form element classes

### Search & SEO

- Typesense/Meilisearch for search (API key in `config.yaml` params)
- Custom sitemap at `layouts/_default/sitemap.xml` excludes old doc versions — update `$latestVersion` variable there when releasing a new version
- Output formats: HTML + JSON (for search index) on homepage

## Content Conventions

### Docs Front Matter

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

### Links and Images

- Internal docs links: `/docs/{version}/{section}/` (trailing slash required)
- Images: always `/assets/images/` prefix, never `../` relative paths
- Cross-product links: use `{{ .Site.Params.domain_stash }}` style params

### Adding a Database to Navigation

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
2. Update all `menu_name` and `info` version references in front matter
3. Run `make set-operator-version VERSION=v{VERSION}` to update Firebase redirects
4. Update `$latestVersion` in `layouts/_default/sitemap.xml`

## CI/CD

- **ci.yml** — PR build validation
- **release.yml** — Tag-based Firebase deploys (prod vs QA based on tag format)
- **release-tracker.yml** — Commit message parsing for release coordination
- Required secrets: `FIREBASE_TOKEN`, `GOOGLE_CUSTOM_SEARCH_API_KEY`, `MEILISEARCH_ADMIN_API_KEY`

## Validation

No unit tests. Validate via:
1. `make gen-prod` — must succeed without errors
2. `make check-links` — requires local server running on port 1313

## Gitignored Build Artifacts

`public/`, `resources/_gen/`, `bin/`, `hugo_stats.json`
