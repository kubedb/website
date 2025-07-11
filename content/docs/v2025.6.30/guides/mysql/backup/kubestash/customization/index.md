---
title: MySQL Backup Customization | KubeStash
description: Customizing MySQL Backup and Restore process with KubeStash
menu:
  docs_v2025.6.30:
    identifier: guides-mysql-backup-customization-stashv2
    name: Customizing Backup & Restore Process
    parent: guides-mysql-backup-stashv2
    weight: 50
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

# Customizing Backup and Restore Process

KubeStash provides rich customization supports for the backup and restore process to meet the requirements of various cluster configurations. This guide will show you some examples of these customizations.

## Customizing Backup Process

In this section, we are going to show you how to customize the backup process. Here, we are going to show some examples of providing arguments to the backup process, running the backup process as a specific user, etc.

### Passing targeted databases to the backup process

KubeStash MySQL addon uses the [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) for backup. Addon has implemented a `databases` params which indicates your targeted backup databases. 

The below example shows how you can pass the `--databases` option during backup. 

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: sample-mysql-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: sample-mysql
  backends:
    - name: gcs-backend
      storageRef:
        namespace: demo
        name: gcs-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
  sessions:
    - name: frequent-backup
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: gcs-mysql-repo
          backend: gcs-backend
          directory: /mysql
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
      addon:
        name: mysql-addon
        tasks:
          - name: logical-backup
            params:
              databases: db1,db2,db3
```

> **WARNING**: Make sure that your provides databases has been created before taking backup.

Here,
- `addon.tasks[*].databases` options indicates targeted databases. By default `myaql-addon` add `--alll-databases` options during backup. If you want to backup all databases keep the `databases` params empty.  

### Passing arguments to the backup process

KubeStash MySQL addon uses [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) for backup. You can pass arguments to the `mysqldump` supported options through `args` param under `addon.tasks[*].params` section.   

The below example shows how you can pass the `--set-gtid-purged=OFF` options during backup.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: sample-mysql-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: sample-mysql
  backends:
    - name: gcs-backend
      storageRef:
        namespace: demo
        name: gcs-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
  sessions:
    - name: frequent-backup
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: gcs-mysql-repo
          backend: gcs-backend
          directory: /mysql
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
      addon:
        name: mysql-addon
        tasks:
          - name: logical-backup
            params:
              args: --set-gtid-purged=OFF
```


### Using multiple backends

You can configure multiple backends within a single `backupConfiguration`. To back up the same data to different backends, such as S3 and GCS, declare each backend in the `.spe.backends` section. Then, reference these backends in the `.spec.sessions[*].repositories` section.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: sample-mysql-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: sample-mysql
  backends:
    - name: gcs-backend
      storageRef:
        namespace: demo
        name: gcs-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
    - name: s3-backend
      storageRef:
        namespace: demo
        name: s3-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
  sessions:
    - name: frequent-backup
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: gcs-mysql-repo
          backend: gcs-backend
          directory: /mysql
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
        - name: s3-mysql-repo
          backend: s3-backend
          directory: /mysql-copy
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
      addon:
        name: mysql-addon
        tasks:
          - name: logical-backup
```

### Running backup job as a specific user

If your cluster requires running the backup job as a specific user, you can provide `securityContext` under `addon.jobTemplate.spec.securityContext` section. The below example shows how you can run the backup job as the `root` user.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: sample-mysql-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: sample-mysql
  backends:
    - name: gcs-backend
      storageRef:
        namespace: demo
        name: gcs-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
  sessions:
    - name: frequent-backup
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: gcs-mysql-repo
          backend: gcs-backend
          directory: /mysql
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
      addon:
        name: mysql-addon
        jobTemplate:
          spec:
            securityContext:
              runAsUser: 0
              runAsGroup: 0
        tasks:
          - name: logical-backup
```

### Specifying Memory/CPU limit/request for the backup job

If you want to specify the Memory/CPU limit/request for your backup job, you can specify `resources` field under `addon.jobTemplate.spec` section.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: sample-mysql-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: sample-mysql
  backends:
    - name: gcs-backend
      storageRef:
        namespace: demo
        name: gcs-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
  sessions:
    - name: frequent-backup
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: gcs-mysql-repo
          backend: gcs-backend
          directory: /mysql
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
      addon:
        name: mysql-addon
        jobTemplate:
          spec:
            resources:
              requests:
                cpu: "200m"
                memory: "1Gi"
              limits:
                cpu: "200m"
                memory: "1Gi"
        tasks:
          - name: logical-backup
```

> You can configure additional runtime settings for backup jobs within the `addon.jobTemplate.spec` sections. For further details, please refer to the [reference](https://kubestash.com/docs/latest/concepts/crds/backupconfiguration/#podtemplate-spec).

## Customizing Restore Process

KubeStash also uses `mysql` during the restore process. In this section, we are going to show how you can pass arguments to the restore process, restore a specific snapshot, run restore job as a specific user, etc.


### Passing arguments to the restore process

Similar to the backup process, you can pass arguments to the restore process through the `args` params under `addon.tasks[*].params` section. 

This example will restore data from database `testdb` only.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: sample-mysql-backup
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: sample-mysql
  backends:
    - name: gcs-backend
      storageRef:
        namespace: demo
        name: gcs-storage
      retentionPolicy:
        name: demo-retention
        namespace: demo
  sessions:
    - name: frequent-backup
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: gcs-mysql-repo
          backend: gcs-backend
          directory: /mysql
          encryptionSecret:
            name: encrypt-secret
            namespace: demo
      addon:
        name: mysql-addon
        tasks:
          - name: logical-backup
            params:
              args: --one-database=testdb
```

### Restore specific snapshot

You can also restore a specific snapshot. At first, list the available snapshot as bellow,

```bash
➤ kubectl get snapshots.storage.kubestash.com -n demo -l=kubestash.com/repo-name=gcs-mysql-repo
NAME                                                            REPOSITORY       SESSION           SNAPSHOT-TIME          DELETION-POLICY   PHASE       AGE
gcs-mysql-repo-sample-mysql-backup-frequent-backup-1725257849   gcs-mysql-repo   frequent-backup   2024-09-02T06:18:01Z   Delete            Succeeded   15m
gcs-mysql-repo-sample-mysql-backup-frequent-backup-1725258000   gcs-mysql-repo   frequent-backup   2024-09-02T06:20:00Z   Delete            Succeeded   13m
gcs-mysql-repo-sample-mysql-backup-frequent-backup-1725258300   gcs-mysql-repo   frequent-backup   2024-09-02T06:25:00Z   Delete            Succeeded   8m34s
gcs-mysql-repo-sample-mysql-backup-frequent-backup-1725258600   gcs-mysql-repo   frequent-backup   2024-09-02T06:30:00Z   Delete            Succeeded   3m34s
```

The below example shows how you can pass a specific snapshot name in `.dataSource` section.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: restore-sample-mysql
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: restored-mysql
  dataSource:
    repository: gcs-mysql-repo
    snapshot: gcs-mysql-repo-sample-mysql-backup-frequent-backup-1725257849
    encryptionSecret:
      name: encrypt-secret
      namespace: demo
  addon:
    name: mysql-addon
    tasks:
      - name: logical-backup-restore
        params:
          args: --one-database=testdb
```


### Running restore job as a specific user

Similar to the backup process under the `addon.jobTemplate.spec.` you can provide `securityContext` to run the restore job as a specific user.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: restore-sample-mysql
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: restored-mysql
  dataSource:
    repository: gcs-mysql-repo
    snapshot: latest
    encryptionSecret:
      name: encrypt-secret
      namespace: demo
  addon:
    name: mysql-addon
    jobTemplate:
      spec:
        securityContext:
          runAsUser: 0
          runAsGroup: 0
    tasks:
      - name: logical-backup-restore
```

### Specifying Memory/CPU limit/request for the restore job

Similar to the backup process, you can also provide `resources` field under the `addon.jobTemplate.spec.resources` section to limit the Memory/CPU for your restore job.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: restore-sample-mysql
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MySQL
    namespace: demo
    name: restored-mysql
  dataSource:
    repository: gcs-mysql-repo
    snapshot: latest
    encryptionSecret:
      name: encrypt-secret
      namespace: demo
  addon:
    name: mysql-addon
    jobTemplate:
      spec:
        resources:
          requests:
            cpu: "200m"
            memory: "1Gi"
          limits:
            cpu: "200m"
            memory: "1Gi"
    tasks:
      - name: logical-backup-restore
```

> You can configure additional runtime settings for restore jobs within the `addon.jobTemplate.spec` sections. For further details, please refer to the [reference](https://kubestash.com/docs/latest/concepts/crds/restoresession/#podtemplate-spec).