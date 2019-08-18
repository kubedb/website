---
title: Initialize Postgres from WAL
menu:
  docs_0.12.0:
    identifier: pg-wal-source-initialization
    name: From WAL
    parent: pg-initialization-postgres
    weight: 25
menu_name: docs_0.12.0
section_menu_id: guides
---

> New to KubeDB? Please start [here](/docs/0.12.0/concepts/README).
> Don't know how to take continuous backup?  Check this [tutorial](/docs/0.12.0/guides/postgres/snapshot/continuous_archiving) on Continuous Archiving.

# PostgreSQL Initialization from WAL files

KubeDB supports PostgreSQL database initialization. When you create a new Postgres object, you can provide existing WAL files to restore from by "replaying" the log entries. Users can now restore from any one of `s3`, `gcs`, `azure`, or `swift` as cloud backup provider.

**What is Continuous Archiving**

PostgreSQL maintains a write ahead log (WAL) in the `pg_xlog/` subdirectory of the cluster's data directory.  The existence of the log makes it possible to restore from the backed-up WAL files to bring the system back to a last known state.

To know more about continuous archiving, please refer to the [ofiicial postgres document](https://www.postgresql.org/docs/10/continuous-archiving.html) on this topic.

**List of supported Cloud Providers for PostgresVersion CRDs**

|   Name   | Version |  S3  | MinIO |  GCS  | Azure | Swift | Local |
| :------: | :-----: | :--: | :---: | :---: | :---: | :---: | :---: |
|  9.6-v2  |   9.6   |  ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
| 9.6.7-v2 |  9.6.7  |  ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
| 10.2-v2  |  10.2   |  ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
|   10.6   |  10.6   |  ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
|   11.1   |  11.1   |  ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
|  9.6-v3  |   9.6   |  ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 9.6.7-v3 |  9.6.7  |  ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 10.2-v3  |  10.2   |  ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 10.6-v1  |  10.6   |  ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 11.1-v1  |  11.1   |  ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
|  9.6-v4  |   9.6   |  ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 9.6.7-v4 |  9.6.7  |  ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 10.2-v4  |  10.2   |  ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 10.6-v2  |  10.6   |  ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 11.1-v2  |  11.1   |  ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
|   11.2   |  11.2   |  ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |

## Next Steps

- Learn about restoring from [Amazon S3](/docs/0.12.0/guides/postgres/initialization/replay_from_s3).
- Learn about restoring from [S3 MinIO](/docs/0.12.0/guides/postgres/initialization/replay_from_minio).
- Learn about restoring from [Google Cloud Storage](/docs/0.12.0/guides/postgres/initialization/replay_from_gcs).
- Learn about restoring from [Azure Storage](/docs/0.12.0/guides/postgres/initialization/replay_from_azure).
- Learn about restoring from [OpenStack Object Storage (Swift)](/docs/0.12.0/guides/postgres/initialization/replay_from_swift).
- Learn about restoring from [Local Storage](/docs/0.12.0/guides/postgres/initialization/replay_from_local).
- Learn about initializing [PostgreSQL with Script](/docs/0.12.0/guides/postgres/initialization/script_source).
- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/0.12.0/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [CoreOS Prometheus Operator](/docs/0.12.0/guides/postgres/monitoring/using-coreos-prometheus-operator).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.12.0/CONTRIBUTING).
