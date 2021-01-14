---
title: Continuous Archiving of PostgreSQL
menu:
  docs_v2021.01.14:
    identifier: pg-wal-overview
    name: Overview
    parent: pg-wal
    weight: 10
menu_name: docs_v2021.01.14
section_menu_id: guides
info:
  autocaler: v0.1.0
  cli: v0.16.0
  community: v0.16.0
  enterprise: v0.3.0
  installer: v0.16.0
  version: v2021.01.14
---

> New to KubeDB? Please start [here](/docs/v2021.01.14/README).

# Continuous Archiving with WAL-G

KubeDB supports continuous archiving of PostgreSQL WAL files using [WAL-G ](https://github.com/wal-g/wal-g). You can use `s3`, `gcs`, `azure`, `swift`,  `MinIO`, or  `local` storage to store the WAL files.

**What is Continuous Archiving**

PostgreSQL maintains a write ahead log (WAL) in the `pg_xlog/` subdirectory of the cluster's data directory.  The existence of the log makes it possible to use a third strategy for backing up databases and if recovery is needed, restore from the backed-up WAL files to bring the system back to last known state.

To know more about continuous archiving, please refer to the [ofiicial postgres document](https://www.postgresql.org/docs/10/continuous-archiving.html) on this topic.

**Continuous Archiving Setup**

Following additional parameters are set in `postgresql.conf` for *primary* server

```bash
archive_command = 'wal-g wal-push %p'
archive_timeout = 60
```

**List of supported Cloud Destination for PostgresVersion CRDs**

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

- Learn about archiving to [Amazon S3](/docs/v2021.01.14/guides/postgres/backup/wal/archiving_to_s3).
- Learn about archiving to [S3 MinIO](/docs/v2021.01.14/guides/postgres/backup/wal/archiving_to_minio).
- Learn about archiving to [Google Cloud Storage](/docs/v2021.01.14/guides/postgres/backup/wal/archiving_to_gcs).
- Learn about archiving to [Azure Storage](/docs/v2021.01.14/guides/postgres/backup/wal/archiving_to_azure).
- Learn about archiving to [OpenStack Object Storage (Swift)](/docs/v2021.01.14/guides/postgres/backup/wal/archiving_to_swift).
- Learn about archiving to [Local Storage](/docs/v2021.01.14/guides/postgres/backup/wal/archiving_to_local).
