---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-ace-installer-ace-installer
    name: Platform Installer
    parent: api-ace-installer
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Platform Installer

The Platform Installer endpoints generate and manage self-host installer bundles for the
KubeDB Platform. All paths on this page are relative to the
API root `/api/v1` — for example `/ace-installer/schema.json` is
`/api/v1/ace-installer/schema.json`.

> **AppsCode-hosted only.** These routes exist only on the AppsCode-hosted (SaaS)
> deployment. On self-hosted KubeDB Platform installations the `/ace-installer` routes are not
> registered and every call returns `404 Not Found`. (This was confirmed live — see the
> verification notes below.)

## Authentication and authorization

All endpoints accept a bearer token via any of the supported schemes
(`Authorization: token <token>`, the `Token` cookie, or an `AccessToken`). Requests are
scoped to an organization that is resolved from the `org` query parameter. Beyond the
base token/org check, most endpoints enforce a per-action authorization on the
organization's hosted-mode capability:

| Action | Required authorization |
|--------|------------------------|
| View / list / versions | `view_installers` (`Organization_HostedModeCanViewInstallers`) |
| Generate | `create_installers` (`Organization_HostedModeCanCreateInstallers`) |
| Import | `import_installers` (`Organization_HostedModeCanImportInstallers`) |
| Reconfigure | `reconfigure_installers` (`Organization_HostedModeCanReconfigureInstallers`) |
| Upgrade | `upgrade_installers` (`Organization_HostedModeCanUpgradeInstallers`) |
| Download archive | `download_installers` (`Organization_HostedModeCanDownloadInstallers`) |
| Delete | `delete_installers` (`Organization_HostedModeCanDeleteInstallers`) |
| Serve installer options (`model.json`) | `create_installers` |

A documented call looks like:

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://appscode.com/api/v1/ace-installer/latest-version?org=appscode"
```

## Common query parameter

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | yes | Organization slug used to resolve the org context (e.g. `appscode`). |

## Data models

### InstallerMetadata

Metadata describing a generated or imported installer.

```json
{
  "ID": "inst-01hxyz",
  "installerName": "acme-prod",
  "deploymentType": "SelfHosted",
  "requestedDomain": "ace.example.com",
  "host": "ace.example.com",
  "hostType": "Custom",
  "hostedDomain": "acme.ace.appscode.com",
  "ownerName": "appscode",
  "requesterDisplayName": "Example User",
  "requesterUsername": "user",
  "adminDisplayName": "Example Admin",
  "adminEmail": "user@example.com",
  "accessTokenID": 12345,
  "clusterID": "<uid>",
  "version": "v2025.7.14",
  "promotedToProduction": false,
  "createTimestamp": "2026-07-14T10:00:00Z",
  "expiryTimestamp": "2026-08-14T10:00:00Z",
  "lastUpgradeTimestamp": "2026-07-14T10:00:00Z",
  "lastUpdateTimestamp": "2026-07-14T10:00:00Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Installer ID. |
| `installerName` | string | Installer name (installers are grouped by name). |
| `deploymentType` | string | KubeDB Platform deployment type. |
| `requestedDomain` | string | Domain requested for the installer. |
| `host` | string | Effective host for the deployment. |
| `hostType` | string | Host type. |
| `hostedDomain` | string | AppsCode-hosted domain assigned to the deployment. |
| `ownerName` | string | Owner organization slug. |
| `requesterDisplayName` | string | Display name of the requester. |
| `requesterUsername` | string | Username of the requester. |
| `adminDisplayName` | string | Display name of the platform admin. |
| `adminEmail` | string | Email of the platform admin. |
| `accessTokenID` | integer (int64) | ID of the access token that created the installer. |
| `clusterID` | string | Cluster identifier bound to the installer. |
| `version` | string | installer chart version. |
| `promotedToProduction` | boolean | Whether the installer has been promoted to production. |
| `createTimestamp` | string (date-time) | Creation time. |
| `expiryTimestamp` | string (date-time) | Expiry time. |
| `lastUpgradeTimestamp` | string (date-time) | Last upgrade time. |
| `lastUpdateTimestamp` | string (date-time) | Last update time. |

### InstallerDetails

```json
{
  "meta": { "...": "InstallerMetadata" },
  "readme": "<base64-encoded readme bytes>",
  "archiveZipURL": "https://.../installer.zip",
  "archiveTarURL": "https://.../installer.tar.gz"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `meta` | InstallerMetadata | Installer metadata. |
| `readme` | string (byte) | Base64-encoded readme content. |
| `archiveZipURL` | string | Download URL for the `.zip` archive. |
| `archiveTarURL` | string | Download URL for the `.tar.gz` archive. |

### InstallerVersion

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Version string. |
| `creationTime` | string (date-time) | When the version/archive was created. |
| `archiveURL` | string | Archive download URL. |
| `archiveName` | string | Archive file name. |
| `createdBy` | User | User who created the version. |
| `lastOperation` | string | The last operation applied for this version. |
| `latestInstaller` | boolean | Whether this is the latest installer version. |

### MarketplaceInstallerStatus

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Either `Pending` or `Bound`. |
| `link` | string | Marketplace / self-host link. |
| `meta` | InstallerMetadata | Installer metadata. |
| `isExpired` | boolean | Whether the subscription has expired. |

---

## Schema and default options

### GET /ace-installer/schema.json

Returns the raw OpenAPI v3 JSON schema for installer options
(`ace-options/values.openapiv3_schema.yaml`) as a dynamic JSON object.

- **Auth:** token; org resolved from the `org` query param.
- **Query parameters:**

  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `org` | string | yes | Organization slug. |

- **Response `200`:** an arbitrary Kubernetes-style JSON object (the OpenAPI v3 schema
  document). The body is free-form and passed through verbatim, so no fixed field set is
  documented here.

> **Verified:** returned `404` against `appscode` on the self-hosted platform
> (`<akp-host>`) on 2026-07-14 — the ace-installer routes are AppsCode-hosted only and are
> not registered on this install (body: `{"message":"Not Found"}`).

### GET /ace-installer/model.json

Returns the default options model (`AceOptionsSpec`) pre-filled with the requesting
user's admin details, as a dynamic JSON object.

- **Auth:** token; org context.
- **Query parameters:** `org` (string, required).
- **Response `200`:** an arbitrary Kubernetes-style options JSON object (`AceOptionsSpec`).

> **Verified:** returned `404` against `appscode` on the self-hosted platform on
> 2026-07-14 (AppsCode-hosted only; route not registered).

---

## Generate and import

### POST /ace-installer/generate

Generates a new installer from the supplied `AceOptionsSpec` options and returns the
resulting installer metadata.

- **Auth:** token; org context; requires `create_installers`.
- **Query parameters:** `org` (string, required).
- **Request body:** a free-form `AceOptionsSpec` object, bound as a dynamic JSON map and
  then decoded into `AceOptionsSpec`. The set of options mirrors the schema served by
  `GET /ace-installer/schema.json` (a Kubernetes-style values object); the exact fields are
  defined by that schema rather than a fixed request model.

  ```json
  {
    "...": "AceOptionsSpec (see GET /ace-installer/schema.json for the field set)"
  }
  ```

- **Response `200`:** [`InstallerMetadata`](#installermetadata) for the generated installer.
- **Errors:** `401` unauthorized, `403` missing `create_installers`, `422` invalid body,
  `500` server error.

> Not verified live (POST — mutating call not issued against the platform).

### POST /ace-installer/import

Imports an existing installer described by the supplied `AceOptionsSpec` options and
returns the resulting installer metadata.

- **Auth:** token; org context; requires `import_installers`.
- **Query parameters:** `org` (string, required).
- **Request body:** a free-form `AceOptionsSpec` object (same shape as `generate`).
- **Response `200`:** [`InstallerMetadata`](#installermetadata).
- **Errors:** `401`, `403` missing `import_installers`, `422` invalid body, `500`.

> Not verified live (POST — mutating call not issued against the platform).

---

## Installer metadata and latest version

### GET /ace-installer/installer-meta

Returns the installer metadata associated with the access token used to authenticate the
request.

- **Auth:** token; org context; requires `view_installers`.
- **Query parameters:** `org` (string, required).
- **Response `200`:** [`InstallerMetadata`](#installermetadata).

> **Verified:** returned `404` against `appscode` on the self-hosted platform on
> 2026-07-14 (AppsCode-hosted only; route not registered).

### GET /ace-installer/latest-version

Returns the latest available installer chart version.

- **Auth:** token; org context; requires `view_installers`.
- **Query parameters:** `org` (string, required).
- **Response `200`:**

  ```json
  { "version": "v2025.7.14" }
  ```

  | Field | Type | Description |
  |-------|------|-------------|
  | `version` | string | Latest installer chart version. |

> **Verified:** returned `404` against `appscode` on the self-hosted platform on
> 2026-07-14 (AppsCode-hosted only; route not registered).

---

## Installers CRUD

### GET /ace-installer/installers/

Lists the installers for the owner organization, grouped by installer name (one metadata
entry per group).

- **Auth:** token; org context; requires `view_installers`.
- **Query parameters:** `org` (string, required).
- **Response `200`:** an array of [`InstallerMetadata`](#installermetadata).

> **Verified:** returned `404` against `appscode` on the self-hosted platform on
> 2026-07-14 (AppsCode-hosted only; route not registered).

### GET /ace-installer/installers/{name}

Lists all generated installers matching the given installer name for the owner
organization.

- **Auth:** token; org context; requires `view_installers`.
- **Path parameters:**

  | Name | Type | Description |
  |------|------|-------------|
  | `name` | string | Installer name. |

- **Query parameters:** `org` (string, required).
- **Response `200`:** an array of [`InstallerMetadata`](#installermetadata).
- **Errors:** `401`, `403` missing `view_installers`, `404` not found, `500`.

> Not verified live (requires a real installer name; not present on this self-hosted
> platform — parent list route returns `404`).

### GET /ace-installer/installers/{name}/{id}

Returns detailed metadata for a single generated installer, including readme content and
archive download URLs.

- **Auth:** token; org context; requires `view_installers`.
- **Path parameters:**

  | Name | Type | Description |
  |------|------|-------------|
  | `name` | string | Installer name. |
  | `id` | string | Installer ID. |

- **Query parameters:** `org` (string, required).
- **Response `200`:** [`InstallerDetails`](#installerdetails).
- **Errors:** `401`, `403`, `404` installer not found, `428` Precondition Required
  (a marketplace installer that is not yet in a bound phase returns a redirect to the
  marketplace URL), `500`.

> Not verified live (requires a real installer name/ID; ace-installer routes not present
> on this self-hosted platform).

### DELETE /ace-installer/installers/{name}/{id}

Deletes a generated installer by ID. Installers owned by a marketplace organization
cannot be deleted.

- **Auth:** token; org context; requires `delete_installers`.
- **Path parameters:** `name` (string), `id` (string).
- **Query parameters:** `org` (string, required).
- **Response `200`:** installer deleted (empty body).
- **Errors:** `401`, `403` missing `delete_installers` or the installer belongs to a
  marketplace organization, `500`.

> Not verified live (DELETE — mutating call not issued against the platform).

---

## Reconfigure and upgrade

### POST /ace-installer/installers/{name}/{id}/reconfigure

Reconfigures an existing installer using the supplied `AceOptionsSpec` options.

- **Auth:** token; org context; requires `reconfigure_installers`.
- **Path parameters:** `name` (string), `id` (string).
- **Query parameters:**

  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `org` | string | yes | Organization slug. |
  | `installerOps` | string | yes | Operation to perform — `reconfigure` or `promote-to-prod`. |

- **Request body:** a free-form `AceOptionsSpec` object (same shape as `generate`).
- **Response `200`:** [`InstallerMetadata`](#installermetadata).
- **Errors:** `400` invalid `installerOps` or installer mismatch, `401`,
  `403` missing `reconfigure_installers`, `422` invalid body, `500`.

> Not verified live (POST — mutating call not issued against the platform).

### POST /ace-installer/installers/{name}/{id}/upgrade

Upgrades an existing installer to the latest installer version and returns the updated
installer metadata.

- **Auth:** token; org context; requires `upgrade_installers`.
- **Path parameters:** `name` (string), `id` (string).
- **Query parameters:** `org` (string, required).
- **Response `200`:** [`InstallerMetadata`](#installermetadata).
- **Errors:** `400` installer not found, `401`, `403` missing `upgrade_installers`, `500`.

> Not verified live (POST — mutating call not issued against the platform).

---

## Versions and archives

### GET /ace-installer/installers/{name}/{id}/versions

Lists the available versions (archives) for a generated installer.

- **Auth:** token; org context; requires `view_installers`.
- **Path parameters:** `name` (string), `id` (string).
- **Query parameters:** `org` (string, required).
- **Response `200`:** an array of [`InstallerVersion`](#installerversion).
- **Errors:** `400` installer not found, `401`, `403` missing `view_installers`, `500`.

> Not verified live (requires a real installer name/ID; ace-installer routes not present
> on this self-hosted platform).

### GET /ace-installer/installers/{name}/{id}/archives/{archiveName}

Extracts and returns installer details (readme, archive URL) from the specified tar
archive of a generated installer.

- **Auth:** token; org context; requires `download_installers`.
- **Path parameters:**

  | Name | Type | Description |
  |------|------|-------------|
  | `name` | string | Installer name. |
  | `id` | string | Installer ID. |
  | `archiveName` | string | Archive file name. |

- **Query parameters:** `org` (string, required).
- **Response `200`:** [`InstallerDetails`](#installerdetails).
- **Errors:** `400` installer not found, `401`, `403` missing `download_installers`, `500`.

> Not verified live (requires a real installer name/ID/archive; ace-installer routes not
> present on this self-hosted platform).

### GET /ace-installer/installers/{name}/{id}/model.json

Returns the stored `AceOptionsSpec` options for a generated installer.

- **Auth:** token; org context; requires `create_installers`.
- **Path parameters:** `name` (string), `id` (string).
- **Query parameters:**

  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `org` | string | yes | Organization slug. |
  | `configureProductionOptions` | boolean | no | When `true`, adjust options for a self-hosted production deployment. |

- **Response `200`:** an arbitrary Kubernetes-style options JSON object (`AceOptionsSpec`).
- **Errors:** `401`, `403` missing `create_installers`, `500`.

> Not verified live (requires a real installer name/ID; ace-installer routes not present
> on this self-hosted platform).

---

## Marketplace installer status

### GET /ace-installer/deployment/marketplace/installers/{installerID}/status

Returns the marketplace subscription status (`Pending` or `Bound`) for a marketplace-type
installer, along with its metadata, download link, and expiry state. This route does not
carry an additional installer-specific authorization check beyond the base org token/authz.

- **Auth:** token; org context.
- **Path parameters:**

  | Name | Type | Description |
  |------|------|-------------|
  | `installerID` | string | Installer ID. |

- **Query parameters:**

  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `org` | string | yes | Organization slug. |
  | `redirect` | boolean | no | When `true` and the installer is bound, redirect to the self-host URL. |

- **Response `200`:** [`MarketplaceInstallerStatus`](#marketplaceinstallerstatus).
- **Errors:** `400` installer not found or not a marketplace deployment type, `401`,
  `403`, `428` Precondition Required (when bound and `redirect=true`, a redirect to the
  self-host URL is returned), `500`.

> Not verified live (requires a real marketplace installer ID; ace-installer routes not
> present on this self-hosted platform).
