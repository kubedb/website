# KubeDB Website - AI Agent Instructions

## Project Overview
Hugo-based static website for KubeDB (Kubernetes database operator platform). The site aggregates documentation from multiple database operators (Cassandra, ClickHouse, Druid, Elasticsearch, FerretDB, Kafka, MariaDB, MongoDB, MySQL, PostgreSQL, Redis, etc.) and provides marketing content, articles, and product information.

## Architecture

### Content Structure
- **Versioned Docs**: `content/docs/v{VERSION}/` - Each KubeDB release has isolated documentation with version-specific front matter (`menu_name: docs_v{VERSION}`)
- **Articles**: `content/articles/` - SEO-focused blog posts about database deployments
- **Datasheet**: `content/datasheet/{lang}/` - Multi-language product datasheets (en, ar, pt, zh-hk, ja)
- **Product Data**: `data/products/*.json` - Structured product definitions with versions, features, badges

### Hugo Theme System
- Uses custom `hugo-product-theme` as a git submodule in `themes/`
- Theme provides layouts, shortcodes, and base styling
- Site-specific overrides in root `layouts/` directory
- Custom shortcodes: `catalogtable.html`, `code.html`, `notice.html`, `versionlist.html`

### Asset Management
- **hugo-tools**: Custom binary (`bin/hugo-tools`) aggregates docs from remote repositories
- **Static Assets**: Pulled from `github.com/appscode/static-assets` via `data/config.json` configuration
- **Images**: Stored in `static/assets/images/`, referenced with `/assets/` prefix in content
- **Files**: Product files in `static/files/` (cleaned up post-build to remove cluster-api artifacts)

## Critical Workflows

### Local Development
```bash
make run                    # Runs hugo server with config.dev.yaml (dev domains)
hugo server --config=config.dev.yaml
```

### Documentation Aggregation
```bash
make docs                   # Full sync: pulls docs + assets from remote repos
make docs-skip-assets       # Faster: only syncs docs content
make assets                 # Only sync static assets
```
The `hugo-tools docs-aggregator` reads from `data/config.json` to fetch versioned documentation from external repositories. After aggregation, CDN URLs are replaced with local paths using `sed`.

### Build & Deploy
```bash
make gen-prod              # Production build with minification (config.yaml)
make release               # Deploy to Firebase production
make qa                    # Deploy to Firebase default (staging)
```

### CSS Processing
1. PostCSS with Autoprefixer configured in `postcss.config.js`
2. PurgeCSS in `process-css.js` removes unused CSS using `hugo_stats.json`
3. Safelist includes form elements (`fserv-*`, `fs-*`, `select2-*`) and dynamic classes

## Configuration Files

### config.yaml vs config.dev.yaml
- **config.yaml**: Production domains (kubedb.com, appscode.com)
- **config.dev.yaml**: Firebase preview domains (*-hugo.web.app)
- Shared structure: menu definitions, markup settings, output formats (HTML + JSON for search)

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

### Firebase Configuration
- `firebase.json`: Defines hosting rules, redirects to latest docs version
- Use `make set-version VERSION=v2026.1.19` to update redirect targets

## Conventions & Patterns

### Front Matter Standards
**Documentation pages:**
```yaml
---
title: Page Title
menu:
  docs_v2026.1.19:         # Version-specific menu
    identifier: unique-id
    name: Display Name
    parent: parent-id
    weight: 10
menu_name: docs_v2026.1.19
info:                       # Component versions for this release
  autoscaler: v0.45.0
  cli: v0.60.0
  installer: v2026.1.19
---
```

**Articles:**
```yaml
---
title: Install MySQL using Kubernetes MySQL Operator
Description: SEO-friendly description
alt: Alt text for hero image
date: "2023-09-05"
---
```

### Menu Structure
- Main navigation defined in `config.yaml` under `menu.main`
- Database dropdown (`identifier: database`) populated with 27+ databases
- Each database entry includes `pre:` for icon path (`/assets/images/databases/logos/png/{db}s.png`)

### Link Formatting
- Internal docs links: `/docs/{version}/{section}/` (trailing slash required)
- Cross-product links: Use `domain_` params from config (e.g., `{{ .Site.Params.domain_stash }}`)
- Images: Always use `/assets/images/` prefix, never `../` relative paths

## Common Tasks

### Adding New Database to Menu
Edit `config.yaml` menu structure:
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

### Working with Shortcodes
- `{{< notice >}}` for alerts/callouts
- `{{< catalogtable >}}` for addon version tables
- `{{< code >}}` for syntax-highlighted code blocks
- Located in `layouts/shortcodes/` and `themes/hugo-product-theme/layouts/shortcodes/`

## External Dependencies

- **Hugo**: v0.128.2 (extended version required for SCSS)
- **hugo-tools**: Binary for docs aggregation (auto-downloaded by Makefile)
- **Node.js**: v20+ for PostCSS processing
- **Firebase CLI**: v11.13.0 for deployments
- **yq**: v3.3.0 for YAML processing in CI

## Build Artifacts
- `public/` - Generated site (gitignored)
- `resources/_gen/` - Hugo resource cache (gitignored)
- `bin/` - Downloaded tools (gitignored)
- `hugo_stats.json` - Element tracking for PurgeCSS

## Search & Analytics
- Custom search using Typesense/Meilisearch (API key in params)
- Search index updated on release via GitHub Actions
- Google Analytics 4 tracking (UA-62096468-4)
- Comments powered by Giscus (GitHub Discussions)

## SEO & Sitemap
- Custom sitemap template in `layouts/_default/sitemap.xml` excludes old documentation versions
- Only the latest version docs (currently `v2026.1.19`) are included in sitemap to avoid duplicate content
- When updating to a new version, update the `$latestVersion` variable in the sitemap template

## CI/CD Pipelines
- **ci.yml**: PR checks - build validation, link checking (disabled)
- **release.yml**: Tag-based deploys to Firebase (prod vs QA based on tag format)
- **release-tracker.yml**: Parses commit messages for release coordination
- Secrets required: `FIREBASE_TOKEN`, `GOOGLE_CUSTOM_SEARCH_API_KEY`, `MEILISEARCH_ADMIN_API_KEY`
