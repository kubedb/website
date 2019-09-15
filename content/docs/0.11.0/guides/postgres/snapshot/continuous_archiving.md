---
title: Continuous Archiving of PostgreSQL
menu:
  docs_0.11.0:
    identifier: pg-continuous-archiving-snapshot
    name: WAL Archiving
    parent: pg-snapshot-postgres
    weight: 20
menu_name: docs_0.11.0
section_menu_id: guides
info:
  version: 0.11.0
---

> New to KubeDB? Please start [here](/docs/0.11.0/concepts/README).

# Continuous Archiving with WAL-G

KubeDB supports continuous archiving of PostgreSQL WAL files using [WAL-G ](https://github.com/wal-g/wal-g). You can use `s3`, `gcs`, `azure`, or `swift` to store the WAL files.

**What is Continuous Archiving**

PostgreSQL maintains a write ahead log (WAL) in the `pg_xlog/` subdirectory of the cluster's data directory.  The existence of the log makes it possible to use a third strategy for backing up databases and if recovery is needed, restore from the backed-up WAL files to bring the system back to last known state.

To know more about continuous archiving, please refer to the [ofiicial postgres document](https://www.postgresql.org/docs/10/continuous-archiving.html) on this topic.

**Continuous Archiving Setup**

Following additional parameters are set in `postgresql.conf` for *primary* server

```console
archive_command = 'wal-g wal-push %p'
archive_timeout = 60
```

**List of supported Cloud Destination for PostgresVersion CRDs**

|   Name   | Version |  S3  | GCS  | Azure | Swift |
| :------: | :-----: | :--: | :--: | :---: | :---: |
|  9.6-v2  |   9.6   |  ✓   |  ✓   |   ✗   |   ✗   |
| 9.6.7-v2 |  9.6.7  |  ✓   |  ✓   |   ✗   |   ✗   |
| 10.2-v2  |  10.2   |  ✓   |  ✓   |   ✗   |   ✗   |
|   10.6   |  10.6   |  ✓   |  ✓   |   ✗   |   ✗   |
|   11.1   |  11.1   |  ✓   |  ✓   |   ✗   |   ✗   |
|  9.6-v3  |   9.6   |  ✓   |  ✓   |   ✓   |   ✓   |
| 9.6.7-v3 |  9.6.7  |  ✓   |  ✓   |   ✓   |   ✓   |
| 10.2-v3  |  10.2   |  ✓   |  ✓   |   ✓   |   ✓   |
| 10.6-v1  |  10.6   |  ✓   |  ✓   |   ✓   |   ✓   |
| 11.1-v1  |  11.1   |  ✓   |  ✓   |   ✓   |   ✓   |

## Next Steps

- Learn about archiving to [Amazon S3](/docs/0.11.0/guides/postgres/snapshot/archiving_to_s3).
- Learn about archiving to [Google Cloud Storage](/docs/0.11.0/guides/postgres/snapshot/archiving_to_gcs).
- Learn about archiving to [Azure Storage](/docs/0.11.0/guides/postgres/snapshot/archiving_to_azure).
- Learn about archiving to [OpenStack Object Storage (Swift)](/docs/0.11.0/guides/postgres/snapshot/archiving_to_swift).
