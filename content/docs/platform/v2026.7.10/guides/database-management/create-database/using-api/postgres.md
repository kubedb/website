---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: database-management-create-api-postgres
    name: PostgreSQL
    parent: database-management-create-api
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Creating a PostgreSQL Database via API

This page walks through the API calls needed to provision a PostgreSQL database,
equivalent to using the **Create Database** wizard in the UI at
`/db/<org>/<cluster>/kubedb.com/v1/postgreses/create`. See
[Using the API](../_index.md) for the general 3-call flow and
[PostgreSQL](../../postgres.md) for the Database Mode options this flow configures.

**Example values used throughout**: namespace `demo`, database name `pgc`, PostgreSQL
version `18.3-bookworm`, `Cluster` mode, 3 replicas, `500m` CPU / `1Gi` memory per node,
`2Gi` storage on `local-path` storage class. Swap these for your own.

---

## 1. Get Default Form Values

```bash
curl -sk "$BASE_URL/helm/packageview/values" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" \
  --get \
  --data-urlencode "name=kubedbcom-postgres-editor-options" \
  --data-urlencode "sourceApiGroup=source.toolkit.fluxcd.io" \
  --data-urlencode "sourceKind=HelmRepository" \
  --data-urlencode "sourceNamespace=kubeops" \
  --data-urlencode "sourceName=appscode-wizards-oci" \
  --data-urlencode "version=v0.35.0" \
  --data-urlencode "group=kubedb.com" \
  --data-urlencode "kind=Postgres" \
  --data-urlencode "variant=default" \
  --data-urlencode "namespace=demo" \
  --data-urlencode "format=json"
```

> The `version` query param (`v0.35.0` above) is the wizard chart version — it gets bumped
> by 1 with each kubedb-platform release.

**Full response body:**

```json
{
    "form": {
        "alert": {
            "additionalRuleLabels": {},
            "annotations": {},
            "enabled": "critical",
            "groups": {
                "database": {
                    "enabled": "warning",
                    "rules": {
                        "PostgresReplicationSlotLagCritical": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 1288490188
                        },
                        "PostgresReplicationSlotLagHigh": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 838860800
                        },
                        "diskAlmostFull": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 95
                        },
                        "diskUsageHigh": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 80
                        },
                        "postgresExporterError": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "postgresHighRollbackRate": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 0.02
                        },
                        "postgresInstanceDown": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "postgresNotEnoughConnections": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 5
                        },
                        "postgresReplicationLag": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical",
                            "val": "30s"
                        },
                        "postgresRestarted": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 60
                        },
                        "postgresSlowQueries": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "postgresSplitBrain": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "postgresTooManyConnections": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 80
                        },
                        "postgresTooManyLocksAcquired": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 0.2
                        }
                    }
                },
                "kubeStash": {
                    "enabled": "warning",
                    "rules": {
                        "backupSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "backupSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        },
                        "noBackupSessionForTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 18000
                        },
                        "repositoryCorrupted": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "repositoryStorageRunningLow": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 10737418240
                        },
                        "restoreSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "restoreSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        }
                    }
                },
                "opsManager": {
                    "enabled": "warning",
                    "rules": {
                        "opsRequestFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "opsRequestOnProgress": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "info"
                        },
                        "opsRequestStatusProgressingToLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "critical"
                        }
                    }
                },
                "provisioner": {
                    "enabled": "warning",
                    "rules": {
                        "appPhaseCritical": {
                            "duration": "15m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "appPhaseNotReady": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "critical"
                        }
                    }
                },
                "schemaManager": {
                    "enabled": "warning",
                    "rules": {
                        "schemaExpired": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaInProgressForTooLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaPendingForTooLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaTerminatingForTooLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "warning"
                        }
                    }
                },
                "stash": {
                    "enabled": "warning",
                    "rules": {
                        "backupSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "backupSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        },
                        "noBackupSessionForTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 18000
                        },
                        "repositoryCorrupted": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "repositoryStorageRunningLow": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 10737418240
                        },
                        "restoreSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "restoreSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        }
                    }
                }
            },
            "labels": {
                "release": "kube-prometheus-stack"
            }
        }
    },
    "metadata": {
        "release": {
            "name": "",
            "namespace": "demo"
        },
        "resource": {
            "group": "kubedb.com",
            "kind": "Postgres",
            "name": "postgreses",
            "scope": "Namespaced",
            "version": "v1alpha2"
        }
    },
    "spec": {
        "admin": {
            "alert": {
                "toggle": true
            },
            "archiver": {
                "enable": {
                    "default": false,
                    "toggle": true
                },
                "via": "Restic"
            },
            "authCredential": {
                "customize": true,
                "referExisting": true
            },
            "backup": {
                "by": "BackupConfiguration",
                "enable": {
                    "default": true,
                    "toggle": true
                },
                "via": "Restic"
            },
            "clusterIssuers": {
                "available": [],
                "default": "",
                "toggle": true
            },
            "clusterTier": {
                "default": "GeneralPurpose",
                "nodeTopology": {
                    "available": [],
                    "default": "",
                    "toggle": true
                },
                "placement": {
                    "available": [],
                    "default": "",
                    "toggle": true
                },
                "toggle": true
            },
            "customConfiguration": true,
            "databases": {
                "Aerospike": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Standalone",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Cassandra": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "ClickHouse": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "DB2": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Standalone",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "DocumentDB": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Druid": {
                    "mode": {
                        "available": [
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Elasticsearch": {
                    "mode": {
                        "available": [
                            "Combined",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "HanaDB": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "SystemReplication"
                        ],
                        "default": "SystemReplication",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Hazelcast": {
                    "mode": {
                        "available": [
                            "Combined",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Ignite": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Kafka": {
                    "mode": {
                        "available": [
                            "Combined",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "MSSQLServer": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "MariaDB": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Memcached": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Milvus": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Distributed"
                        ],
                        "default": "Distributed",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "MongoDB": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset",
                            "Sharded"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "MySQL": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "GroupReplication",
                            "InnoDBCluster",
                            "RemoteReplica",
                            "SemiSync"
                        ],
                        "default": "GroupReplication",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Oracle": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "DataGuard"
                        ],
                        "default": "DataGuard",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "PerconaXtraDB": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "PgBouncer": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Pgpool": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Postgres": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Cluster",
                            "RemoteReplica"
                        ],
                        "default": "Cluster",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "ProxySQL": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Qdrant": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Distributed"
                        ],
                        "default": "Distributed",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "RabbitMQ": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Redis": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Cluster",
                            "Sentinel"
                        ],
                        "default": "Cluster",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Singlestore": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Topology"
                        ],
                        "default": "Topology",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Solr": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset",
                            "Topology"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "Weaviate": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                },
                "ZooKeeper": {
                    "mode": {
                        "available": [
                            "Standalone",
                            "Replicaset"
                        ],
                        "default": "Replicaset",
                        "toggle": true
                    },
                    "versions": {
                        "available": [],
                        "default": "",
                        "toggle": true
                    }
                }
            },
            "deletionPolicy": {
                "default": "WipeOut",
                "toggle": true
            },
            "deployment": {
                "default": "Shared",
                "toggle": true
            },
            "expose": {
                "default": false,
                "enable": {
                    "default": false,
                    "toggle": true
                },
                "toggle": true,
                "uiExposure": {
                    "disableCostEfficiency": false,
                    "disableUI": false
                }
            },
            "gitOps": {
                "enable": {
                    "default": false,
                    "toggle": true
                }
            },
            "leftPanel": {
                "showBackup": true,
                "showBackupLegacy": false,
                "showInsights": true,
                "showOperations": true,
                "showSecurity": false,
                "showVaultInfo": true
            },
            "machineProfiles": {
                "available": [],
                "default": "",
                "machines": []
            },
            "monitoring": {
                "agent": "prometheus.io/operator",
                "exporter": {
                    "resources": {
                        "limits": {
                            "memory": "256Mi"
                        },
                        "requests": {
                            "cpu": "100m",
                            "memory": "128Mi"
                        }
                    }
                },
                "toggle": true
            },
            "nodeSelector": {},
            "pointInTimeRecovery": {
                "default": false,
                "toggle": true
            },
            "showPreview": false,
            "storageClasses": {
                "available": [],
                "default": "",
                "toggle": true
            },
            "tls": {
                "default": false,
                "toggle": true
            },
            "tolerations": []
        },
        "annotations": {},
        "archiverName": "",
        "authSecret": {
            "name": "",
            "password": ""
        },
        "backup": {
            "kubestash": {
                "encryptionSecret": {
                    "name": "default-encryption-secret",
                    "namespace": "stash"
                },
                "retentionPolicy": {
                    "name": "keep-1mo",
                    "namespace": "stash"
                },
                "schedule": "0 */2 * * *",
                "storageRef": {
                    "name": "default",
                    "namespace": "stash"
                },
                "storageSecret": {
                    "create": true
                }
            },
            "toggle": true,
            "tool": "KubeStash"
        },
        "configuration": "",
        "deletionPolicy": "WipeOut",
        "init": {
            "archiver": {
                "encryptionSecret": {
                    "name": "",
                    "namespace": ""
                },
                "fullDBRepository": {
                    "name": "",
                    "namespace": ""
                },
                "manifestRepository": {
                    "name": "",
                    "namespace": ""
                },
                "recoveryTimestamp": null
            }
        },
        "labels": {},
        "mode": "Cluster",
        "monitoring": {
            "agent": "prometheus.io/operator",
            "serviceMonitor": {
                "labels": {
                    "release": "kube-prometheus-stack"
                }
            }
        },
        "openshift": {
            "securityContext": {
                "runAsUser": null
            }
        },
        "persistence": {
            "size": "2Gi"
        },
        "podResources": {
            "machine": "",
            "resources": {
                "requests": {
                    "cpu": "500m",
                    "memory": "1Gi"
                }
            }
        },
        "remoteReplica": {
            "sourceRef": {
                "name": "",
                "namespace": ""
            }
        },
        "replicas": 3,
        "standbyMode": "Hot",
        "streamingMode": "Asynchronous"
    }
}
```

Fields like `spec.admin.databases.Postgres.versions.default` and `spec.storageClasses`
come back empty/null — the defaults don't pick a version or storage class for you. Set your
preferred values in these fields (version, storage class, mode, replicas, resources,
storage size) before passing the config to call 2.

### Key fields to customize

The `form` mixes two kinds of fields — get them straight before editing:

- **`spec.admin.*`** — catalogs and per-feature toggles. They don't configure the database
  directly; they gate which of the plain `spec.*` fields below are honored and what values
  are valid for them.
- **`spec.*` (outside `admin`) and `metadata.release.*`** — the actual values applied to
  the database.

**Feature toggles (`spec.admin`)**

| Field | Purpose | Default in this doc |
|---|---|---|
| `spec.admin.databases.Postgres.versions.default` | PostgreSQL version catalog | `""` — must set, e.g. `18.3-bookworm` |
| `spec.admin.storageClasses.default` | Storage class catalog, feeds `storageClassName` on every PVC | `""` — must set, e.g. `local-path` |
| `spec.admin.backup.enable.default` | Turn scheduled KubeStash backups on/off | `true` |
| `spec.admin.archiver.enable.default` | Turn continuous archiving / point-in-time recovery on/off | `false` |
| `spec.admin.clusterIssuers.default` | cert-manager `ClusterIssuer` to use for TLS certs (only matters if TLS is on) | `""` — pick one from `.available` if enabling TLS |
| `spec.admin.tls.default` | Enable TLS on client/server connections | `false` |
| `spec.admin.expose.enable.default` | Expose the database endpoint via the UI binding (`uiExposure`) | `false` |

**Resource-defining fields**

| Field | Purpose |
|---|---|
| `metadata.release.name` | Database name (`pgc` in this example) |
| `metadata.release.namespace` | Namespace (`demo`) |
| `spec.mode` | `Standalone`, `Cluster`, or `RemoteReplica` |
| `spec.replicas` | Replica count — used when `spec.mode: Cluster` |
| `spec.remoteReplica.sourceRef` | Name/namespace of the source Postgres to replicate from — used when `spec.mode: RemoteReplica`, instead of `spec.replicas` |
| `spec.standbyMode` / `spec.streamingMode` | Standby (`Hot`/`Warm`) and streaming replication mode (`Synchronous`/`Asynchronous`) for `Cluster` mode |
| `spec.podResources.resources.requests` / `.limits` | CPU/memory per node |
| `spec.persistence.size` | Storage size per PVC (combines with `spec.admin.storageClasses.default` for the actual storage class) |
| `spec.backup.kubestash.{schedule,storageRef,retentionPolicy,encryptionSecret}` | Backup schedule/storage/retention — only applied when `spec.admin.backup.enable.default: true`; becomes the `BackupConfiguration` manifest (`resources.coreKubestashComBackupConfiguration`) in calls 2/3 |
| `spec.archiverName` | Name of an `Archiver` object to reference for continuous archiving — only used when `spec.admin.archiver.enable.default: true` |

---

## 2. Render the Values Model (Dry-Run)

Take the `form` object from call 1, fill in your choices, and submit it here. No database
is created yet — this only validates and renders the config.

```bash
curl -sk -X PUT "$BASE_URL/helm/options/model" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" -H "content-type: application/json" \
  --data-binary @request-model.json
```

**Full request body** (`request-model.json` — same `form` as call 1's response, with
`metadata.release.name`, `spec.mode`, `spec.replicas`, `spec.podResources`,
`spec.persistence`, and `spec.admin.databases.Postgres.versions.default` filled in):

```json
{
  "form": {
    "alert": {
      "additionalRuleLabels": {},
      "annotations": {},
      "enabled": "critical",
      "groups": {
        "database": {
          "enabled": "warning",
          "rules": {
            "PostgresReplicationSlotLagCritical": {
              "duration": "1m",
              "enabled": true,
              "severity": "critical",
              "val": 1288490188
            },
            "PostgresReplicationSlotLagHigh": {
              "duration": "1m",
              "enabled": true,
              "severity": "warning",
              "val": 838860800
            },
            "diskAlmostFull": {
              "duration": "1m",
              "enabled": true,
              "severity": "critical",
              "val": 95
            },
            "diskUsageHigh": {
              "duration": "1m",
              "enabled": true,
              "severity": "warning",
              "val": 80
            },
            "postgresExporterError": {
              "duration": "5m",
              "enabled": true,
              "severity": "warning"
            },
            "postgresHighRollbackRate": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 0.02
            },
            "postgresInstanceDown": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "postgresNotEnoughConnections": {
              "duration": "2m",
              "enabled": true,
              "severity": "warning",
              "val": 5
            },
            "postgresReplicationLag": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical",
              "val": "30s"
            },
            "postgresRestarted": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical",
              "val": 60
            },
            "postgresSlowQueries": {
              "duration": "2m",
              "enabled": true,
              "severity": "warning"
            },
            "postgresSplitBrain": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "postgresTooManyConnections": {
              "duration": "2m",
              "enabled": true,
              "severity": "warning",
              "val": 80
            },
            "postgresTooManyLocksAcquired": {
              "duration": "2m",
              "enabled": true,
              "severity": "critical",
              "val": 0.2
            }
          }
        },
        "kubeStash": {
          "enabled": "warning",
          "rules": {
            "backupSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "backupSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            },
            "noBackupSessionForTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 18000
            },
            "repositoryCorrupted": {
              "duration": "5m",
              "enabled": true,
              "severity": "critical"
            },
            "repositoryStorageRunningLow": {
              "duration": "5m",
              "enabled": true,
              "severity": "warning",
              "val": 10737418240
            },
            "restoreSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "restoreSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            }
          }
        },
        "opsManager": {
          "enabled": "warning",
          "rules": {
            "opsRequestFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "opsRequestOnProgress": {
              "duration": "0m",
              "enabled": true,
              "severity": "info"
            },
            "opsRequestStatusProgressingToLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "critical"
            }
          }
        },
        "provisioner": {
          "enabled": "warning",
          "rules": {
            "appPhaseCritical": {
              "duration": "15m",
              "enabled": true,
              "severity": "warning"
            },
            "appPhaseNotReady": {
              "duration": "1m",
              "enabled": true,
              "severity": "critical"
            }
          }
        },
        "schemaManager": {
          "enabled": "warning",
          "rules": {
            "schemaExpired": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaInProgressForTooLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaPendingForTooLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaTerminatingForTooLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "warning"
            }
          }
        },
        "stash": {
          "enabled": "warning",
          "rules": {
            "backupSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "backupSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            },
            "noBackupSessionForTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 18000
            },
            "repositoryCorrupted": {
              "duration": "5m",
              "enabled": true,
              "severity": "critical"
            },
            "repositoryStorageRunningLow": {
              "duration": "5m",
              "enabled": true,
              "severity": "warning",
              "val": 10737418240
            },
            "restoreSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "restoreSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            }
          }
        }
      },
      "labels": {
        "release": "kube-prometheus-stack"
      }
    }
  },
  "metadata": {
    "release": {
      "name": "pgc",
      "namespace": "demo"
    },
    "resource": {
      "group": "kubedb.com",
      "kind": "Postgres",
      "name": "postgreses",
      "scope": "Namespaced",
      "version": "v1alpha2"
    }
  },
  "spec": {
    "admin": {
      "alert": {
        "toggle": true
      },
      "archiver": {
        "enable": {
          "default": true,
          "toggle": true
        },
        "via": "Restic"
      },
      "authCredential": {
        "customize": true,
        "referExisting": true
      },
      "backup": {
        "by": "BackupConfiguration",
        "enable": {
          "default": true,
          "toggle": true
        },
        "via": "Restic"
      },
      "clusterIssuers": {
        "available": [],
        "default": "",
        "toggle": true
      },
      "clusterTier": {
        "default": "GeneralPurpose",
        "nodeTopology": {
          "available": [],
          "default": "",
          "toggle": true
        },
        "placement": {
          "available": [],
          "default": "",
          "toggle": true
        },
        "toggle": true
      },
      "customConfiguration": true,
      "databases": {
        "Aerospike": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Standalone",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Cassandra": {
          "mode": {
            "available": [
              "Standalone",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "ClickHouse": {
          "mode": {
            "available": [
              "Standalone",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "DB2": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Standalone",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "DocumentDB": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Druid": {
          "mode": {
            "available": [
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Elasticsearch": {
          "mode": {
            "available": [
              "Combined",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "HanaDB": {
          "mode": {
            "available": [
              "Standalone",
              "SystemReplication"
            ],
            "default": "SystemReplication",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Hazelcast": {
          "mode": {
            "available": [
              "Combined",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Ignite": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Kafka": {
          "mode": {
            "available": [
              "Combined",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "MSSQLServer": {
          "mode": {
            "available": [
              "Standalone",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "MariaDB": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Memcached": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Milvus": {
          "mode": {
            "available": [
              "Standalone",
              "Distributed"
            ],
            "default": "Distributed",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "MongoDB": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset",
              "Sharded"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "MySQL": {
          "mode": {
            "available": [
              "Standalone",
              "GroupReplication",
              "InnoDBCluster",
              "RemoteReplica",
              "SemiSync"
            ],
            "default": "GroupReplication",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Oracle": {
          "mode": {
            "available": [
              "Standalone",
              "DataGuard"
            ],
            "default": "DataGuard",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "PerconaXtraDB": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "PgBouncer": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Pgpool": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Postgres": {
          "mode": {
            "available": [
              "Standalone",
              "Cluster",
              "RemoteReplica"
            ],
            "default": "Cluster",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "18.3-bookworm",
            "toggle": true
          }
        },
        "ProxySQL": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Qdrant": {
          "mode": {
            "available": [
              "Standalone",
              "Distributed"
            ],
            "default": "Distributed",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "RabbitMQ": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Redis": {
          "mode": {
            "available": [
              "Standalone",
              "Cluster",
              "Sentinel"
            ],
            "default": "Cluster",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Singlestore": {
          "mode": {
            "available": [
              "Standalone",
              "Topology"
            ],
            "default": "Topology",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Solr": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset",
              "Topology"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "Weaviate": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        },
        "ZooKeeper": {
          "mode": {
            "available": [
              "Standalone",
              "Replicaset"
            ],
            "default": "Replicaset",
            "toggle": true
          },
          "versions": {
            "available": [],
            "default": "",
            "toggle": true
          }
        }
      },
      "deletionPolicy": {
        "default": "WipeOut",
        "toggle": true
      },
      "deployment": {
        "default": "Shared",
        "toggle": true
      },
      "expose": {
        "default": false,
        "enable": {
          "default": true,
          "toggle": true
        },
        "toggle": true,
        "uiExposure": {
          "disableCostEfficiency": false,
          "disableUI": false
        }
      },
      "gitOps": {
        "enable": {
          "default": false,
          "toggle": true
        }
      },
      "leftPanel": {
        "showBackup": true,
        "showBackupLegacy": false,
        "showInsights": true,
        "showOperations": true,
        "showSecurity": false,
        "showVaultInfo": true
      },
      "machineProfiles": {
        "available": [],
        "default": "",
        "machines": []
      },
      "monitoring": {
        "agent": "prometheus.io/operator",
        "exporter": {
          "resources": {
            "limits": {
              "memory": "256Mi"
            },
            "requests": {
              "cpu": "100m",
              "memory": "128Mi"
            }
          }
        },
        "toggle": true
      },
      "nodeSelector": {},
      "pointInTimeRecovery": {
        "default": false,
        "toggle": true
      },
      "showPreview": false,
      "storageClasses": {
        "available": [],
        "default": "local-path",
        "toggle": true
      },
      "tls": {
        "default": false,
        "toggle": true
      },
      "tolerations": []
    },
    "annotations": {},
    "archiverName": "postgres",
    "authSecret": {
      "name": "",
      "password": ""
    },
    "backup": {
      "kubestash": {
        "encryptionSecret": {
          "name": "default-encryption-secret",
          "namespace": "stash"
        },
        "retentionPolicy": {
          "name": "keep-1mo",
          "namespace": "stash"
        },
        "schedule": "0 */2 * * *",
        "storageRef": {
          "name": "default",
          "namespace": "stash"
        },
        "storageSecret": {
          "create": true
        }
      },
      "toggle": true,
      "tool": ""
    },
    "configuration": "",
    "deletionPolicy": "WipeOut",
    "init": {
      "archiver": {
        "encryptionSecret": {
          "name": "",
          "namespace": ""
        },
        "fullDBRepository": {
          "name": "",
          "namespace": ""
        },
        "manifestRepository": {
          "name": "",
          "namespace": ""
        },
        "recoveryTimestamp": null
      }
    },
    "labels": {},
    "mode": "Cluster",
    "monitoring": {
      "agent": "prometheus.io/operator",
      "serviceMonitor": {
        "labels": {
          "release": "kube-prometheus-stack"
        }
      }
    },
    "openshift": {
      "securityContext": {
        "runAsUser": null
      }
    },
    "persistence": {
      "size": "2Gi"
    },
    "podResources": {
      "machine": "custom",
      "resources": {
        "requests": {
          "cpu": "500m",
          "memory": "1Gi"
        },
        "limits": {
          "cpu": "500m",
          "memory": "1Gi"
        }
      }
    },
    "remoteReplica": {
      "sourceRef": {
        "name": "",
        "namespace": ""
      }
    },
    "replicas": 3,
    "standbyMode": "Hot",
    "streamingMode": "Asynchronous"
  }
}
```

**Full response body:**

```json
{
  "form": {
    "alert": {
      "additionalRuleLabels": {},
      "annotations": {},
      "enabled": "critical",
      "groups": {
        "database": {
          "enabled": "warning",
          "rules": {
            "PostgresReplicationSlotLagCritical": {
              "duration": "1m",
              "enabled": true,
              "severity": "critical",
              "val": 1288490188
            },
            "PostgresReplicationSlotLagHigh": {
              "duration": "1m",
              "enabled": true,
              "severity": "warning",
              "val": 838860800
            },
            "diskAlmostFull": {
              "duration": "1m",
              "enabled": true,
              "severity": "critical",
              "val": 95
            },
            "diskUsageHigh": {
              "duration": "1m",
              "enabled": true,
              "severity": "warning",
              "val": 80
            },
            "postgresExporterError": {
              "duration": "5m",
              "enabled": true,
              "severity": "warning"
            },
            "postgresHighRollbackRate": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 0.02
            },
            "postgresInstanceDown": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "postgresNotEnoughConnections": {
              "duration": "2m",
              "enabled": true,
              "severity": "warning",
              "val": 5
            },
            "postgresReplicationLag": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical",
              "val": "30s"
            },
            "postgresRestarted": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical",
              "val": 60
            },
            "postgresSlowQueries": {
              "duration": "2m",
              "enabled": true,
              "severity": "warning"
            },
            "postgresSplitBrain": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "postgresTooManyConnections": {
              "duration": "2m",
              "enabled": true,
              "severity": "warning",
              "val": 80
            },
            "postgresTooManyLocksAcquired": {
              "duration": "2m",
              "enabled": true,
              "severity": "critical",
              "val": 0.2
            }
          }
        },
        "kubeStash": {
          "enabled": "warning",
          "rules": {
            "backupSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "backupSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            },
            "noBackupSessionForTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 18000
            },
            "repositoryCorrupted": {
              "duration": "5m",
              "enabled": true,
              "severity": "critical"
            },
            "repositoryStorageRunningLow": {
              "duration": "5m",
              "enabled": true,
              "severity": "warning",
              "val": 10737418240
            },
            "restoreSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "restoreSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            }
          }
        },
        "opsManager": {
          "enabled": "warning",
          "rules": {
            "opsRequestFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "opsRequestOnProgress": {
              "duration": "0m",
              "enabled": true,
              "severity": "info"
            },
            "opsRequestStatusProgressingToLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "critical"
            }
          }
        },
        "provisioner": {
          "enabled": "warning",
          "rules": {
            "appPhaseCritical": {
              "duration": "15m",
              "enabled": true,
              "severity": "warning"
            },
            "appPhaseNotReady": {
              "duration": "1m",
              "enabled": true,
              "severity": "critical"
            }
          }
        },
        "schemaManager": {
          "enabled": "warning",
          "rules": {
            "schemaExpired": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaInProgressForTooLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaPendingForTooLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "warning"
            },
            "schemaTerminatingForTooLong": {
              "duration": "30m",
              "enabled": true,
              "severity": "warning"
            }
          }
        },
        "stash": {
          "enabled": "warning",
          "rules": {
            "backupSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "backupSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            },
            "noBackupSessionForTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 18000
            },
            "repositoryCorrupted": {
              "duration": "5m",
              "enabled": true,
              "severity": "critical"
            },
            "repositoryStorageRunningLow": {
              "duration": "5m",
              "enabled": true,
              "severity": "warning",
              "val": 10737418240
            },
            "restoreSessionFailed": {
              "duration": "0m",
              "enabled": true,
              "severity": "critical"
            },
            "restoreSessionPeriodTooLong": {
              "duration": "0m",
              "enabled": true,
              "severity": "warning",
              "val": 1800
            }
          }
        }
      },
      "labels": {
        "release": "kube-prometheus-stack"
      }
    }
  },
  "metadata": {
    "release": {
      "name": "pgc",
      "namespace": "demo"
    },
    "resource": {
      "group": "kubedb.com",
      "kind": "Postgres",
      "name": "postgreses",
      "scope": "Namespaced",
      "version": "v1alpha2"
    }
  },
  "resources": {
    "autoscalingKubedbComPostgresAutoscaler": {
      "apiVersion": "autoscaling.kubedb.com/v1alpha1",
      "kind": "PostgresAutoscaler",
      "metadata": {
        "labels": {
          "app.kubernetes.io/instance": "pgc",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "postgreses.kubedb.com"
        },
        "name": "pgc",
        "namespace": "demo"
      },
      "spec": {
        "compute": {
          "postgres": {
            "maxAllowed": {
              "cpu": "1",
              "memory": "2Gi"
            },
            "minAllowed": {
              "cpu": "400m",
              "memory": "400Mi"
            },
            "podLifeTimeThreshold": "10m",
            "resourceDiffPercentage": 20,
            "trigger": "Off"
          }
        },
        "databaseRef": {
          "name": "pgc"
        },
        "opsRequestOptions": {
          "apply": "IfReady",
          "timeout": "10m"
        }
      }
    },
    "catalogAppscodeComPostgresBinding": {
      "apiVersion": "catalog.appscode.com/v1alpha1",
      "kind": "PostgresBinding",
      "metadata": {
        "labels": {
          "app.kubernetes.io/instance": "pgc",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "postgreses.kubedb.com"
        },
        "name": "pgc",
        "namespace": "demo"
      },
      "spec": {
        "sourceRef": {
          "name": "pgc",
          "namespace": "demo"
        },
        "uiExposure": {
          "disableCostEfficiency": false,
          "disableUI": false
        }
      }
    },
    "kubedbComPostgres": {
      "apiVersion": "kubedb.com/v1",
      "kind": "Postgres",
      "metadata": {
        "annotations": {
          "app.kubernetes.io/cluster-tier": "GeneralPurpose",
          "kubernetes.io/instance-type": ""
        },
        "labels": {
          "app.kubernetes.io/instance": "pgc",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "postgreses.kubedb.com",
          "kubedb.com/archiver": "true"
        },
        "name": "pgc",
        "namespace": "demo"
      },
      "spec": {
        "archiver": {
          "ref": {
            "name": "postgres",
            "namespace": "kubedb"
          }
        },
        "deletionPolicy": "WipeOut",
        "mode": "Cluster",
        "monitor": {
          "agent": "prometheus.io/operator",
          "prometheus": {
            "exporter": {
              "resources": {
                "limits": {
                  "memory": "256Mi"
                },
                "requests": {
                  "cpu": "100m",
                  "memory": "128Mi"
                }
              },
              "securityContext": {
                "allowPrivilegeEscalation": false,
                "capabilities": {
                  "drop": [
                    "ALL"
                  ]
                },
                "runAsGroup": 0,
                "runAsNonRoot": true,
                "runAsUser": 999,
                "seccompProfile": {
                  "type": "RuntimeDefault"
                }
              }
            },
            "serviceMonitor": {
              "interval": "30s",
              "labels": {
                "release": "kube-prometheus-stack"
              }
            }
          }
        },
        "podTemplate": {
          "spec": {
            "containers": [
              {
                "name": "postgres",
                "resources": {
                  "limits": {
                    "cpu": "500m",
                    "memory": "1Gi"
                  },
                  "requests": {
                    "cpu": "500m",
                    "memory": "1Gi"
                  }
                },
                "securityContext": {
                  "allowPrivilegeEscalation": false,
                  "capabilities": {
                    "drop": [
                      "ALL"
                    ]
                  },
                  "runAsGroup": 0,
                  "runAsNonRoot": true,
                  "runAsUser": 999,
                  "seccompProfile": {
                    "type": "RuntimeDefault"
                  }
                }
              },
              {
                "name": "pg-coordinator",
                "resources": {
                  "limits": {
                    "memory": "256Mi"
                  },
                  "requests": {
                    "cpu": "200m",
                    "memory": "256Mi"
                  }
                },
                "securityContext": {
                  "allowPrivilegeEscalation": false,
                  "capabilities": {
                    "drop": [
                      "ALL"
                    ]
                  },
                  "runAsGroup": 0,
                  "runAsNonRoot": true,
                  "runAsUser": 999,
                  "seccompProfile": {
                    "type": "RuntimeDefault"
                  }
                }
              }
            ],
            "initContainers": [
              {
                "name": "postgres-init-container",
                "resources": {
                  "limits": {
                    "memory": "512Mi"
                  },
                  "requests": {
                    "cpu": "200m",
                    "memory": "256Mi"
                  }
                },
                "securityContext": {
                  "allowPrivilegeEscalation": false,
                  "capabilities": {
                    "drop": [
                      "ALL"
                    ]
                  },
                  "runAsGroup": 0,
                  "runAsNonRoot": true,
                  "runAsUser": 999,
                  "seccompProfile": {
                    "type": "RuntimeDefault"
                  }
                }
              }
            ],
            "nodeSelector": {
              "kubernetes.io/os": "linux"
            },
            "securityContext": {
              "fsGroup": 999
            }
          }
        },
        "replicas": 3,
        "standbyMode": "Hot",
        "storage": {
          "accessModes": [
            "ReadWriteOnce"
          ],
          "resources": {
            "requests": {
              "storage": "2Gi"
            }
          },
          "storageClassName": "local-path"
        },
        "storageType": "Durable",
        "streamingMode": "Asynchronous",
        "version": "18.3-bookworm"
      }
    }
  }
}
```

This is the key thing to check before submitting: `resources.kubedbComPostgres` is exactly
what call 3 will apply.

> Unlike the MongoDB flow, this response has no `coreKubestashComBackupConfiguration` entry
> under `resources` unless you enable backup in the form (see
> [Additional Options](../../common-steps/#6-additional-options)) — enable it if you want a
> `BackupConfiguration` created alongside the database.

---

## 3. Submit — Creates the Database

```bash
RESPONSE_ID=$(uuidgen)
curl -sk -X PUT "$BASE_URL/helm/editor?response-id=$RESPONSE_ID" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" -H "content-type: application/json" \
  --data-binary @request-editor.json
```

`response-id` is any UUID you generate client-side — the server doesn't validate it against
earlier calls, it's only used to correlate this request with a response/progress stream.

**Full request body** (same `form`/`metadata` as call 2, plus the `resources` map from
call 2's response — the fully rendered manifests that get applied via Helm):

```json
{
    "form": {
        "alert": {
            "additionalRuleLabels": {},
            "annotations": {},
            "enabled": "critical",
            "groups": {
                "database": {
                    "enabled": "warning",
                    "rules": {
                        "PostgresReplicationSlotLagCritical": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 1288490188
                        },
                        "PostgresReplicationSlotLagHigh": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 838860800
                        },
                        "diskAlmostFull": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 95
                        },
                        "diskUsageHigh": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 80
                        },
                        "postgresExporterError": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "postgresHighRollbackRate": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 0.02
                        },
                        "postgresInstanceDown": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "postgresNotEnoughConnections": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 5
                        },
                        "postgresReplicationLag": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical",
                            "val": "30s"
                        },
                        "postgresRestarted": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 60
                        },
                        "postgresSlowQueries": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "postgresSplitBrain": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "postgresTooManyConnections": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 80
                        },
                        "postgresTooManyLocksAcquired": {
                            "duration": "2m",
                            "enabled": true,
                            "severity": "critical",
                            "val": 0.2
                        }
                    }
                },
                "kubeStash": {
                    "enabled": "warning",
                    "rules": {
                        "backupSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "backupSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        },
                        "noBackupSessionForTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 18000
                        },
                        "repositoryCorrupted": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "repositoryStorageRunningLow": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 10737418240
                        },
                        "restoreSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "restoreSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        }
                    }
                },
                "opsManager": {
                    "enabled": "warning",
                    "rules": {
                        "opsRequestFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "opsRequestOnProgress": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "info"
                        },
                        "opsRequestStatusProgressingToLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "critical"
                        }
                    }
                },
                "provisioner": {
                    "enabled": "warning",
                    "rules": {
                        "appPhaseCritical": {
                            "duration": "15m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "appPhaseNotReady": {
                            "duration": "1m",
                            "enabled": true,
                            "severity": "critical"
                        }
                    }
                },
                "schemaManager": {
                    "enabled": "warning",
                    "rules": {
                        "schemaExpired": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaInProgressForTooLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaPendingForTooLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "warning"
                        },
                        "schemaTerminatingForTooLong": {
                            "duration": "30m",
                            "enabled": true,
                            "severity": "warning"
                        }
                    }
                },
                "stash": {
                    "enabled": "warning",
                    "rules": {
                        "backupSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "backupSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        },
                        "noBackupSessionForTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 18000
                        },
                        "repositoryCorrupted": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "repositoryStorageRunningLow": {
                            "duration": "5m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 10737418240
                        },
                        "restoreSessionFailed": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "critical"
                        },
                        "restoreSessionPeriodTooLong": {
                            "duration": "0m",
                            "enabled": true,
                            "severity": "warning",
                            "val": 1800
                        }
                    }
                }
            },
            "labels": {
                "release": "kube-prometheus-stack"
            }
        }
    },
    "metadata": {
        "release": {
            "name": "pgc",
            "namespace": "demo"
        },
        "resource": {
            "group": "kubedb.com",
            "kind": "Postgres",
            "name": "postgreses",
            "scope": "Namespaced",
            "version": "v1alpha2"
        }
    },
    "resources": {
        "autoscalingKubedbComPostgresAutoscaler": {
            "apiVersion": "autoscaling.kubedb.com/v1alpha1",
            "kind": "PostgresAutoscaler",
            "metadata": {
                "labels": {
                    "app.kubernetes.io/instance": "pgc",
                    "app.kubernetes.io/managed-by": "Helm",
                    "app.kubernetes.io/name": "postgreses.kubedb.com"
                },
                "name": "pgc",
                "namespace": "demo"
            },
            "spec": {
                "compute": {
                    "postgres": {
                        "maxAllowed": {
                            "cpu": "1",
                            "memory": "2Gi"
                        },
                        "minAllowed": {
                            "cpu": "400m",
                            "memory": "400Mi"
                        },
                        "podLifeTimeThreshold": "10m",
                        "resourceDiffPercentage": 20,
                        "trigger": "Off"
                    }
                },
                "databaseRef": {
                    "name": "pgc"
                },
                "opsRequestOptions": {
                    "apply": "IfReady",
                    "timeout": "10m"
                }
            }
        },
        "catalogAppscodeComPostgresBinding": {
            "apiVersion": "catalog.appscode.com/v1alpha1",
            "kind": "PostgresBinding",
            "metadata": {
                "labels": {
                    "app.kubernetes.io/instance": "pgc",
                    "app.kubernetes.io/managed-by": "Helm",
                    "app.kubernetes.io/name": "postgreses.kubedb.com"
                },
                "name": "pgc",
                "namespace": "demo"
            },
            "spec": {
                "sourceRef": {
                    "name": "pgc",
                    "namespace": "demo"
                },
                "uiExposure": {
                    "disableCostEfficiency": false,
                    "disableUI": false
                }
            }
        },
        "kubedbComPostgres": {
            "apiVersion": "kubedb.com/v1",
            "kind": "Postgres",
            "metadata": {
                "annotations": {
                    "app.kubernetes.io/cluster-tier": "GeneralPurpose",
                    "kubernetes.io/instance-type": ""
                },
                "labels": {
                    "app.kubernetes.io/instance": "pgc",
                    "app.kubernetes.io/managed-by": "Helm",
                    "app.kubernetes.io/name": "postgreses.kubedb.com",
                    "kubedb.com/archiver": "true"
                },
                "name": "pgc",
                "namespace": "demo"
            },
            "spec": {
                "archiver": {
                    "ref": {
                        "name": "postgres",
                        "namespace": "kubedb"
                    }
                },
                "deletionPolicy": "WipeOut",
                "mode": "Cluster",
                "monitor": {
                    "agent": "prometheus.io/operator",
                    "prometheus": {
                        "exporter": {
                            "resources": {
                                "limits": {
                                    "memory": "256Mi"
                                },
                                "requests": {
                                    "cpu": "100m",
                                    "memory": "128Mi"
                                }
                            },
                            "securityContext": {
                                "allowPrivilegeEscalation": false,
                                "capabilities": {
                                    "drop": [
                                        "ALL"
                                    ]
                                },
                                "runAsGroup": 0,
                                "runAsNonRoot": true,
                                "runAsUser": 999,
                                "seccompProfile": {
                                    "type": "RuntimeDefault"
                                }
                            }
                        },
                        "serviceMonitor": {
                            "interval": "30s",
                            "labels": {
                                "release": "kube-prometheus-stack"
                            }
                        }
                    }
                },
                "podTemplate": {
                    "spec": {
                        "containers": [
                            {
                                "name": "postgres",
                                "resources": {
                                    "limits": {
                                        "cpu": "500m",
                                        "memory": "1Gi"
                                    },
                                    "requests": {
                                        "cpu": "500m",
                                        "memory": "1Gi"
                                    }
                                },
                                "securityContext": {
                                    "allowPrivilegeEscalation": false,
                                    "capabilities": {
                                        "drop": [
                                            "ALL"
                                        ]
                                    },
                                    "runAsGroup": 0,
                                    "runAsNonRoot": true,
                                    "runAsUser": 999,
                                    "seccompProfile": {
                                        "type": "RuntimeDefault"
                                    }
                                }
                            },
                            {
                                "name": "pg-coordinator",
                                "resources": {
                                    "limits": {
                                        "memory": "256Mi"
                                    },
                                    "requests": {
                                        "cpu": "200m",
                                        "memory": "256Mi"
                                    }
                                },
                                "securityContext": {
                                    "allowPrivilegeEscalation": false,
                                    "capabilities": {
                                        "drop": [
                                            "ALL"
                                        ]
                                    },
                                    "runAsGroup": 0,
                                    "runAsNonRoot": true,
                                    "runAsUser": 999,
                                    "seccompProfile": {
                                        "type": "RuntimeDefault"
                                    }
                                }
                            }
                        ],
                        "initContainers": [
                            {
                                "name": "postgres-init-container",
                                "resources": {
                                    "limits": {
                                        "memory": "512Mi"
                                    },
                                    "requests": {
                                        "cpu": "200m",
                                        "memory": "256Mi"
                                    }
                                },
                                "securityContext": {
                                    "allowPrivilegeEscalation": false,
                                    "capabilities": {
                                        "drop": [
                                            "ALL"
                                        ]
                                    },
                                    "runAsGroup": 0,
                                    "runAsNonRoot": true,
                                    "runAsUser": 999,
                                    "seccompProfile": {
                                        "type": "RuntimeDefault"
                                    }
                                }
                            }
                        ],
                        "nodeSelector": {
                            "kubernetes.io/os": "linux"
                        },
                        "securityContext": {
                            "fsGroup": 999
                        }
                    }
                },
                "replicas": 3,
                "standbyMode": "Hot",
                "storage": {
                    "accessModes": [
                        "ReadWriteOnce"
                    ],
                    "resources": {
                        "requests": {
                            "storage": "2Gi"
                        }
                    },
                    "storageClassName": "local-path"
                },
                "storageType": "Durable",
                "streamingMode": "Asynchronous",
                "version": "18.3-bookworm"
            }
        }
    }
}
```

The applied manifests:

- `kubedbComPostgres` — the Postgres custom resource itself
- `autoscalingKubedbComPostgresAutoscaler` — autoscaler config
- `catalogAppscodeComPostgresBinding` — service binding for the UI

A `200` response means the database (and its autoscaler/binding config) has been created.
Confirm with:

```bash
curl -sk "$BASE_URL/proxy/kubedb.com/v1alpha2/namespaces/demo/postgreses/pgc" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF"
```
