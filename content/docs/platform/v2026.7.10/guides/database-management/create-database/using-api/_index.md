---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: database-management-create-api
    name: Using the API
    parent: database-management-create
    weight: 6
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Creating a Database via API

Everything the **Create Database** wizard does (see [Common Steps](../../common-steps.md)) can
also be done directly against the platform API — useful for scripting, CI/CD pipelines, or
automating database provisioning without the UI.

The flow is the same for every database engine: fetch the engine's default form values,
render them into a full values model (dry-run), then submit to create the database. Only the
`spec` fields you customize (mode, version, replicas, resources, storage) differ per engine.

## Before You Start

- **Base URL**: `https://<your-host>/api/v1/clusters/<org>/<cluster>`
- **Auth**: every call needs your session cookie and CSRF token:
  ```
  -H "Cookie: <your-session-cookie>"
  -H "x-csrf-token: <your-csrf-token>"
  -H "content-type: application/json"
  ```

## The 3-Call Flow

| # | Call | Purpose |
|---|------|---------|
| 1 | `GET /helm/packageview/values` | Get the default form values for the engine |
| 2 | `PUT /helm/options/model` | Render your inputs into a full values model (dry-run) |
| 3 | `PUT /helm/editor` | **Submit — this creates the database** |

Call 1 returns the default config for the engine (all the fields the UI shows, with their
defaults). Note the shape: `form`, `metadata`, and `spec` are **top-level siblings** — the
editable database config lives under the top-level `spec`, not under `form`. Fields like the
available versions and storage classes usually come back empty — set your preferred values
before moving to call 2.

Call 2 takes the `form` object from call 1 with your choices filled in (name, namespace,
version, mode, replicas, resources, storage, etc.) and renders it into the full set of
Kubernetes manifests that would be applied — without creating anything. The response's
`resources` map (e.g. `resources.kubedbCom<Engine>`) is exactly what call 3 will apply, so
this is the point to verify your configuration before submitting.

Call 3 takes the same `form`/`metadata` plus the rendered `resources` map from call 2 and
submits it via `?response-id=<uuid>` (any client-generated UUID, used only to correlate the
request with a progress stream). A `200` response means the database — and its
autoscaler/binding/backup config — has been created.

## Supported Engines

- [MongoDB](../mongodb.md)
- [PostgreSQL](../postgres.md)

> More engines will be documented here as their API flows are captured. Until then, follow
> the pattern above against `GET /helm/packageview/values` with your engine's `kind` (e.g.
> `Redis`, `MySQL`) to discover its fields.
