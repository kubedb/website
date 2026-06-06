---
title: Neo4jVersion CRD
menu:
  docs_v2026.6.5-rc.1:
    identifier: neo4j-catalog-concepts
    name: Neo4jVersion
    parent: neo4j-concepts
    weight: 30
menu_name: docs_v2026.6.5-rc.1
section_menu_id: guides
info:
  autoscaler: v0.50.0-rc.1
  cli: v0.65.0-rc.1
  dashboard: v0.41.0-rc.1
  installer: v2026.6.5-rc.1
  ops-manager: v0.52.0-rc.1
  product: kubedb
  provisioner: v0.65.0-rc.1
  schema-manager: v0.41.0-rc.1
  ui-server: v0.41.0-rc.1
  version: v2026.6.5-rc.1
  webhook-server: v0.41.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2026.6.5-rc.1/README).

# Neo4jVersion

## What is Neo4jVersion

`Neo4jVersion` is the catalog CRD that provides image and version metadata for KubeDB-managed Neo4j.

The value of `Neo4j.spec.version` must correspond to a valid `Neo4jVersion` resource.

> **Enterprise Edition:** All KubeDB-managed Neo4j versions use the Neo4j Enterprise image. Verify your Neo4j license requirements before deploying in production.

## Neo4jVersion Specification

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: Neo4jVersion
metadata:
  name: 2025.11.2
spec:
  db:
    image: docker.io/library/neo4j:2025.11.2-enterprise
  securityContext:
    runAsUser: 7474
  version: 2025.11.2-enterprise
```

## Key fields

- `metadata.name` is the value you use in `Neo4j.spec.version`.
- `spec.version` is the full Neo4j version string (including edition suffix).
- `spec.db.image` is the container image used for Neo4j pods.
- `spec.securityContext.runAsUser: 7474` — Neo4j runs as UID `7474` (the `neo4j` system user inside the official image).
- `spec.deprecated: true` marks a version that should no longer be used. KubeDB will warn you if you reference a deprecated version.

## List available versions and check for deprecated ones

```bash
$ kubectl get neo4jversions
NAME        VERSION                DB_IMAGE                                       DEPRECATED   AGE
2025.10.1   2025.10.1-enterprise   docker.io/library/neo4j:2025.10.1-enterprise                12d
2025.11.2   2025.11.2-enterprise   docker.io/library/neo4j:2025.11.2-enterprise                12d
2025.12.1   2025.12.1-enterprise   docker.io/library/neo4j:2025.12.1-enterprise                12d
```

If the `DEPRECATED` column shows `true` for a version you are currently using, upgrade to a supported version via [UpdateVersion](/docs/v2026.6.5-rc.1/guides/neo4j/update-version/versionupgrading/).

## Next Steps

- Read the [Neo4j CRD concept](/docs/v2026.6.5-rc.1/guides/neo4j/concepts/neo4j).
- Run the [Neo4j quickstart](/docs/v2026.6.5-rc.1/guides/neo4j/quickstart/quickstart).