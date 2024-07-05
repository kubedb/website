---
title: Postgres Initialization from WAL
menu:
  docs_v2020.09.04-beta.0:
    identifier: pg-wal-initialization-overview
    name: Overview
    parent: pg-wal-initialization
    weight: 10
menu_name: docs_v2020.09.04-beta.0
section_menu_id: guides
info:
  version: v2020.09.04-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.09.04-beta.0/concepts/README).
> Don't know how to take continuous backup?  Check this [tutorial](/docs/v2020.09.04-beta.0/guides/postgres/snapshot/wal/continuous_archiving) on Continuous Archiving.

# PostgreSQL Initialization from WAL files

KubeDB supports PostgreSQL database initialization. When you create a new Postgres object, you can provide existing WAL files to restore from by "replaying" the log entries. Users can now restore from any one of `s3`, `gcs`, `azure`, or `swift` as cloud backup provider.

**What is Continuous Archiving**

PostgreSQL maintains a write ahead log (WAL) in the `pg_xlog/` subdirectory of the cluster's data directory.  The existence of the log makes it possible to restore from the backed-up WAL files to bring the system back to a last known state.

To know more about continuous archiving, please refer to the [ofiicial postgres document](https://www.postgresql.org/docs/10/continuous-archiving.html) on this topic.

**List of supported Cloud Providers for PostgresVersion CRDs**

|   Name   | Version |  S3   | MinIO |  GCS  | Azure | Swift | Local |
| :------: | :-----: | :---: | :---: | :---: | :---: | :---: | :---: |
|  9.6-v2  |   9.6   |   ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
| 9.6.7-v2 |  9.6.7  |   ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
| 10.2-v2  |  10.2   |   ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
|   10.6   |  10.6   |   ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
|   11.1   |  11.1   |   ✓   |   ✗   |   ✓   |   ✗   |   ✗   |   ✗   |
|  9.6-v3  |   9.6   |   ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 9.6.7-v3 |  9.6.7  |   ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 10.2-v3  |  10.2   |   ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 10.6-v1  |  10.6   |   ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
| 11.1-v1  |  11.1   |   ✓   |   ✗   |   ✓   |   ✓   |   ✓   |   ✗   |
|  9.6-v4  |   9.6   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 9.6.7-v4 |  9.6.7  |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 10.2-v4  |  10.2   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 10.6-v2  |  10.6   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 11.1-v2  |  11.1   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
|   11.2   |  11.2   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
|  9.6-v5  |   9.6   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 9.6.7-v5 |  9.6.7  |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 10.2-v5  |  10.2   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 10.6-v3  |  10.6   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 11.1-v3  |  11.1   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |
| 11.2-v1  |  11.2   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |   ✓   |

## Next Steps

- Learn about restoring from [Amazon S3](/docs/v2020.09.04-beta.0/guides/postgres/initialization/wal/replay_from_s3).
- Learn about restoring from [S3 MinIO](/docs/v2020.09.04-beta.0/guides/postgres/initialization/wal/replay_from_minio).
- Learn about restoring from [Google Cloud Storage](/docs/v2020.09.04-beta.0/guides/postgres/initialization/wal/replay_from_gcs).
- Learn about restoring from [Azure Storage](/docs/v2020.09.04-beta.0/guides/postgres/initialization/wal/replay_from_azure).
- Learn about restoring from [OpenStack Object Storage (Swift)](/docs/v2020.09.04-beta.0/guides/postgres/initialization/wal/replay_from_swift).
- Learn about restoring from [Local Storage](/docs/v2020.09.04-beta.0/guides/postgres/initialization/wal/replay_from_local).
- Learn about initializing [PostgreSQL with Script](/docs/v2020.09.04-beta.0/guides/postgres/initialization/script_source).
- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/v2020.09.04-beta.0/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [CoreOS Prometheus Operator](/docs/v2020.09.04-beta.0/guides/postgres/monitoring/using-coreos-prometheus-operator).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.09.04-beta.0/CONTRIBUTING).
