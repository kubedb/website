---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create
    name: Creating a Database
    parent: database-management
    weight: 10
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a Database

Creating a database is a multi-step wizard: select a database engine, set a name and
namespace, configure topology and resources, and enable optional features like
monitoring, TLS, and backups.

The overall flow is the same for every engine and is documented once in
[**Common Steps**](../common-steps.md). Where it differs is the **Database Mode** (topology)
and a handful of engine-specific settings — pick your engine below for a guide tailored to
it, then follow the common steps for everything else.

---

## Supported Engines

### Relational
- [IBM Db2](../db2.md)
- [MariaDB](../mariadb.md)
- [Microsoft SQL Server](../mssqlserver.md)
- [MySQL](../mysql.md)
- [Oracle](../oracle.md)
- [Percona XtraDB](../perconaxtradb.md)
- [PostgreSQL](../postgres.md)
- [SAP HANA](../hanadb.md)
- [SingleStore](../singlestore.md)

### Document & Search
- [DocumentDB](../documentdb.md)
- [Elasticsearch](../elasticsearch.md)
- [MongoDB](../mongodb.md)
- [Solr](../solr.md)

### Key-Value & Cache
- [Hazelcast](../hazelcast.md)
- [Ignite](../ignite.md)
- [Memcached](../memcached.md)
- [Redis](../redis.md)

### Vector
- [Milvus](../milvus.md)
- [Qdrant](../qdrant.md)
- [Weaviate](../weaviate.md)

### Wide-column & Time-series
- [Cassandra](../cassandra.md)
- [ClickHouse](../clickhouse.md)
- [Druid](../druid.md)

### Streaming & Messaging
- [Kafka](../kafka.md)
- [RabbitMQ](../rabbitmq.md)

### Graph
- [Neo4j](../neo4j.md)

### Coordination
- [ZooKeeper](../zookeeper.md)

### Connection Poolers & Proxies
- [PgBouncer](../pgbouncer.md)
- [Pgpool](../pgpool.md)
- [ProxySQL](../proxysql.md)
