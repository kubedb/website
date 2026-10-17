---
layout: docs
menu:
  docsplatform_v2026.10.30:
    identifier: cluster-management-telemetry-data-check
    name: Verifying Telemetry Data
    parent: cluster-management
    weight: 100
menu_name: docsplatform_v2026.10.30
section_menu_id: guides
info:
  kubedb-installer: v2026.10.30
  kubeops-installer: v2026.10.30
  product: kubedbplatform
  version: v2026.10.30
---

# Verifying Telemetry Data (Logs & Metrics)

This guide shows how to confirm your logs and metrics are actually being stored — not just
collected — in the monitoring stack. The stack stores logs in **ClickHouse** or
**VictoriaLogs**, and metrics in **Thanos + S3** or **VictoriaMetrics**. See
[OpenTelemetry Monitoring](otel-monitoring.md) for how the stack is set up.

Sections 1 to 3 cover Thanos, ClickHouse, and S3. If your stack uses
VictoriaMetrics and VictoriaLogs, go to
[section 4](#4-check-victoriametrics-and-victorialogs). To see which backends
your stack uses:

```bash
kubectl get telemetrystack -n monitoring -o jsonpath='{.items[0].spec.metrics.backend}{"\n"}{.items[0].spec.logs.backend}{"\n"}'
```

## Basics

- Logs and metrics are stored in the **same S3 bucket**, under different prefixes:
  - Logs → `<bucket>/logs/`
  - Metrics → `<bucket>/metrics/`
- Bucket, endpoint, and prefixes are defined in your `TelemetryStack` resource:
  ```bash
  kubectl get telemetrystack -n monitoring -o yaml
  ```
  Look under `spec.logs.clickhouse.s3` and `spec.metrics.thanos.s3`.
- ClickHouse database name is your tenant ID, not a fixed name like `otel` or `default`.
  Find it with `SHOW DATABASES` (see below) — the table inside is `otel_logs`.
- All checks below run from inside the cluster via `kubectl exec`, so no port-forwarding
  or extra credentials are required except for the optional S3 listing step.

---

## 1. Check logs are landing in ClickHouse

Find the ClickHouse pod:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=clickhouse
```

List databases and confirm the `otel_logs` table exists:

```bash
kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query "SHOW DATABASES"
kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query "SHOW TABLES FROM <your-tenant-db>"
```

Check row count and freshness:

```bash
kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query \
  "SELECT count(), min(Timestamp), max(Timestamp), now() FROM <your-tenant-db>.otel_logs"

kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query \
  "SELECT count() FROM <your-tenant-db>.otel_logs WHERE Timestamp > now() - INTERVAL 5 MINUTE"
```

**Healthy result:** `max(Timestamp)` is close to `now()`, and the 5-minute count is greater
than zero. If both queries return recent data, logs are flowing end-to-end.

---

## 2. Check metrics are landing in Thanos / S3

Find the Thanos query pod:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=thanos-query
```

Ask it which StoreAPIs it's talking to and what time range each one covers:

```bash
kubectl exec -n monitoring <thanos-query-pod> -- \
  wget -qO- --header="THANOS-TENANT: <your-tenant>" "http://localhost:9090/api/v1/stores"
```

Look at the `minTime`/`maxTime` fields (Unix epoch **milliseconds**) for each store:

```bash
date -u -d @<maxTime-in-seconds>   # drop the last 3 digits first to convert ms -> s
```

**Healthy result:** `maxTime` should be within the last few minutes for the live/receive
store, and within your compaction interval for the long-term S3-backed store.

For a second confirmation, check the ingester's own TSDB head timestamp:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=thanos-receive-ingester
kubectl exec -n monitoring <thanos-receive-ingester-pod> -- wget -qO- http://localhost:10902/metrics \
  | grep prometheus_tsdb_head_max_time
```

If this timestamp is stale (not advancing over successive checks), metrics are not being
ingested. Metrics are shipped from each connected cluster by the OpenTelemetry stack
(`appscode-otel-stack`). See the [Troubleshooting](#troubleshooting-data-is-missing)
section below for how to trace that pipeline.

---

## 3. Check the S3 bucket directly (optional)

Read the bucket, endpoint, and credentials from the `TelemetryStack` spec first — the same
values back both the ClickHouse and Thanos configs:

```bash
kubectl get telemetrystack -n monitoring -o jsonpath='{.spec.metrics.thanos.s3}'
```

Which client you use depends on where the bucket actually lives. The backend is
S3-compatible in every case, so pick the matching variant below.

### a. MinIO (in-cluster or S3-compatible with a custom endpoint)

Use the MinIO client (`mc`) with the endpoint and access credentials from the spec.
The `--insecure` flag is only needed when the endpoint serves a self-signed certificate:

```bash
kubectl run mc-check -n monitoring --rm -it --restart=Never --image=minio/mc:latest -- sh
mc alias set myminio <endpoint> <accessKey> <secretKey> --insecure
mc ls myminio/<bucket>/logs/    --insecure --recursive | tail
mc ls myminio/<bucket>/metrics/ --insecure --recursive | tail
```

### b. Real AWS S3

When the bucket is a genuine AWS S3 bucket, there is no custom endpoint — just pass the
AWS access key, secret, and region. Drop `--endpoint-url` entirely so the CLI talks to
the regional AWS endpoint:

```bash
kubectl run aws-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/logs/    --recursive | tail
# repeat for the metrics prefix
kubectl run aws-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/metrics/ --recursive | tail
```

### c. s3grid (S3-compatible service with a custom endpoint)

s3grid is S3-compatible but reached through its own endpoint, so use the AWS CLI with
`--endpoint-url` pointing at the s3grid endpoint from the spec:

```bash
kubectl run s3grid-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/logs/ --endpoint-url <s3grid-endpoint> --recursive | tail
# repeat for the metrics prefix
kubectl run s3grid-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/metrics/ --endpoint-url <s3grid-endpoint> --recursive | tail
```

> The same `mc`-based flow from (a) works against s3grid too — `mc alias set` accepts any
> S3-compatible endpoint. Use whichever client you already have handy.

**Healthy result (any variant):** recent objects under both prefixes, with timestamps
matching your retention/compaction schedule.

---

## 4. Check VictoriaMetrics and VictoriaLogs

These checks apply when the stack uses the `VictoriaMetrics` and `VictoriaLogs`
backends. Nothing is stored in S3, so section 3 does not apply. All commands run
from your machine with `kubectl port-forward` against the monitoring cluster. To
look at the data in a browser instead of with `curl`, jump to
[step e](#e-browse-the-data-in-the-built-in-web-uis).

### a. Find the tenant's account and instances

Each tenant is stored under an **account ID**, on the instances that match its
retention. List them:

```bash
kubectl get tenants -o custom-columns=NAME:.metadata.name,ACCOUNT:.status.accountID,METRICS:.status.metrics.instance,LOGS:.status.logs.instance
kubectl get vmsingle,vlsingle -n monitoring
```

**Healthy result:** every tenant has an `ACCOUNT`, a `METRICS` instance, and a `LOGS`
instance, and each instance shows `operational` (a `VLSingle` can show an empty
status and still work). In Cluster mode the instances are `vmcluster` and `vlcluster`
instead, and the services have different names.

### b. Check metrics in VictoriaMetrics

Port-forward the metrics instance for your tenant (use the name from step a):

```bash
kubectl port-forward -n monitoring svc/vmsingle-<metrics-instance> 8428:8428 &
sleep 3
```

Count the series for each tenant and cluster, then check how fresh the newest
sample is:

```bash
curl -s -G localhost:8428/api/v1/query \
  --data-urlencode 'query=count by (vm_account_id, cluster) ({__name__=~".+"})'
curl -s -G localhost:8428/api/v1/query \
  --data-urlencode 'query=time() - max by (vm_account_id) (timestamp({__name__=~".+"}))'
```

**Healthy result:** your tenant's account appears as `vm_account_id` with the
expected `cluster`. The second command prints one value for each tenant: the age in
seconds of that tenant's newest sample. It should be small, for example under 30.

### c. Check logs in VictoriaLogs

Port-forward the logs instance for your tenant:

```bash
kubectl port-forward -n monitoring svc/vlsingle-<logs-instance> 9428:9428 &
sleep 3
```

Query the last 30 minutes for the tenant's account. The `AccountID` header selects
the tenant, so always send it:

```bash
curl -s -H 'AccountID: <account>' -H 'ProjectID: 0' localhost:9428/select/logsql/query \
  --data-urlencode 'query=_time:30m | stats by (cluster, k8s.namespace.name) count() n, max(_time) last'
```

**Healthy result:** the tenant's namespaces are listed and `last` is recent. A quiet
workload can have few lines. That is normal.

### d. Check tenants are kept apart

Ask for an account that should have no data on this instance. Data with no tenant
goes to account `0`, which must stay empty:

```bash
curl -s -H 'AccountID: 0' -H 'ProjectID: 0' localhost:9428/select/logsql/query \
  --data-urlencode 'query=_time:30m | stats count() n'
```

**Healthy result:** no output. Repeat with another tenant's account on this instance
and expect no output too.

When finished, stop the port-forwards with `kill %1 %2`.

### e. Browse the data in the built-in web UIs

This is the easiest way to look at the data. VictoriaMetrics and VictoriaLogs each have
a web UI built in, so there is nothing to install.

1. Find the tenant's account number and instances with the command in step a.
2. Open a port-forward for each, in two separate terminals (use your instance names):

   ```bash
   kubectl port-forward -n monitoring svc/vmsingle-<metrics-instance> 8428:8428
   kubectl port-forward -n monitoring svc/vlsingle-<logs-instance> 9428:9428
   ```

3. Open the UIs in your browser:

   | Data | URL |
   |---|---|
   | Metrics | `http://localhost:8428/vmui/` |
   | Logs | `http://localhost:9428/select/vmui/?#/?accountID=<account>&projectID=0&g0.range_input=6h&g0.relative_time=last_6_hours&query=*` |

A port-forward skips the proxy, so you see everything stored on that instance, not what
a client organization sees in its dashboards.

**Metrics UI.** One metrics instance holds several tenants. Add `vm_account_id="<account>"`
to a query to look at one tenant. Type a query and click **Execute query**:

| What you want to see | Query |
|---|---|
| Which jobs the tenant has | `count by (job) ({vm_account_id="<account>"})` |
| Targets the tenant scrapes | `up{vm_account_id="<account>"}` |
| A Redis database is ready | `kubedb_com_redis_status_phase{vm_account_id="<account>", namespace="<org>"} == 1` |
| CPU of each pod | `sum by (pod) (irate(container_cpu_usage_seconds_total{vm_account_id="<account>", namespace="<org>", container!=""}[5m]))` |

**Logs UI.** The logs instance holds one retention, and its tenants are separated by
account. The UI uses the `accountID` in the URL, and it is `0` when the URL has none.
Account `0` has no data, so a page without `accountID` is empty. You can also change it
with the tenant selector at the top right of the page, which shows `0:0` by default.
Type a query and click **Execute Query**:

| What you want to see | Query |
|---|---|
| The latest lines | `_time:1h \| limit 20` |
| Lines of one namespace | `_time:1h k8s.namespace.name:"<org>"` |
| Lines that contain a word | `_time:6h error` |
| How many lines each namespace has | `_time:6h \| stats by (k8s.namespace.name) count() n` |

If a page is empty, check these in order:

1. **The account.** The metrics query must have the right `vm_account_id`, and the logs
   URL the right `accountID`. Use the account from step a.
2. **The instance.** Tenants with different retentions are on different instances. The
   logs UI only shows the tenants of the instance you forwarded.
3. **The time range.** A quiet workload may have no data in the last 5 minutes. Try 1 or 6
   hours.
4. **New tenant.** Data takes a minute or two to arrive after a client organization or
   cluster is created.

Press `Ctrl+C` in each terminal to stop the port-forwards.

### Where the tenant's data lands

A client organization's own workloads and `kubelet` metrics are stored under the
organization's account. Cluster-level exporters such as `kube-state-metrics` and
`panopticon` are stored under the owner's account, and the proxy also writes a copy
of the series that belong to the organization's namespace into the organization's
account. So the organization's dashboards can read them, and it sees only its own
namespace. The owner keeps the full data.

This copy happens when data is written, so it applies only to new data. If a
dashboard panel for a client organization is empty, check that the organization's
account has the series:

```bash
curl -s -G localhost:8428/api/v1/query \
  --data-urlencode 'query=count by (vm_account_id, job) ({vm_account_id="<account>"})'
```

You should see `kube-state-metrics` and `panopticon` next to the organization's own
jobs. Panels that use Prometheus recording rules (metric names containing `:`, such as
`node_namespace_pod_container:...`) stay empty, because recording rules are not sent
to the monitoring cluster.

---

## Summary

| Pipeline | Where to look | Healthy signal |
|---|---|---|
| Logs (ClickHouse) | ClickHouse `<tenant-db>.otel_logs` | `max(Timestamp)` ≈ now, non-zero rows in last 5 min |
| Metrics (Thanos) | Thanos Query `/api/v1/stores`, receive ingester `/metrics` | `maxTime`/head timestamp advancing, close to now |
| Logs (VictoriaLogs) | VictoriaLogs `/select/logsql/query` with the tenant's `AccountID` | Tenant's namespaces listed, `last` is recent |
| Metrics (VictoriaMetrics) | VictoriaMetrics `/api/v1/query`, `count by (vm_account_id, cluster)` | Tenant's account present, newest sample a few seconds old |
| S3 | `<bucket>/logs/` and `<bucket>/metrics/` prefixes | Recent objects under both prefixes |

---

## Troubleshooting: data is missing

Telemetry takes this path:

```
spoke cluster: agent collector -> gateway collector
      |
      v
monitoring cluster: NATS (buffer) -> otel-forwarder -> prom-label-proxy -> storage
```

- **Agent collector** (daemonset, spoke): scrapes metrics and reads container logs, then
  sends them to the gateway over OTLP.
- **Gateway collector** (deployment, spoke): adds the cluster name and the tenant, then
  publishes to NATS on the monitoring cluster. The subject is `ingest.<cluster>.otel`.
- **NATS** (`otel-nats`, 3 pods): buffers the data in the `OTEL_METRICS` and `OTEL_LOGS`
  streams. Messages that are permanently rejected go to `OTEL_DLQ`.
- **otel-forwarder** (3 pods): reads from NATS and writes through `prom-label-proxy`.
- **prom-label-proxy**: picks the tenant and writes to Thanos, ClickHouse, VictoriaMetrics,
  or VictoriaLogs.

Check each hop in order. The first hop that looks wrong is the problem.

### a. Spoke: collectors are running and exporting

On the **spoke** cluster:

```bash
kubectl get pods -n monitoring | grep -E 'agent-collector|gateway-collector|targetallocator'
```

Port-forward the gateway's own metrics and look at what it sends to NATS:

```bash
kubectl port-forward -n monitoring deploy/appscode-otel-stack-gateway-collector 8888:8888 &
sleep 2
curl -s http://localhost:8888/metrics | grep -E 'otelcol_exporter_(sent|send_failed|enqueue_failed)_(metric_points|log_records)'
kill %1
```

These counters only grow, so read them twice, 30 seconds apart:

- `sent_...{exporter="nats"}` is growing and there are no `send_failed` lines: the spoke is
  healthy. Go to step b.
- `send_failed_...` is growing: read the gateway log for the error.
  ```bash
  kubectl logs -n monitoring deploy/appscode-otel-stack-gateway-collector --tail=100 | grep -iE 'error|nats'
  ```
  A TLS error points at the `otel-client-cert` secret. A connection error points at the
  monitoring cluster address (the `hostAliases` entry on the gateway pod, or DNS).
- Everything is flat: nothing is being scraped. Check the target allocator and that
  `ServiceMonitor` or `PodMonitor` objects exist (`kubectl get servicemonitors,podmonitors -A`).

### b. Monitoring cluster: NATS is receiving

On the **monitoring** cluster, read the streams from each NATS pod. Only the leader of a
stream prints, so run all three:

```bash
for p in otel-nats-0 otel-nats-1 otel-nats-2; do
  kubectl exec -n monitoring $p -c nats -- wget -qO- '127.0.0.1:8222/jsz?streams=true&consumers=true' | python3 -c '
import json,sys; d=json.load(sys.stdin); me=sys.argv[1]
for a in d.get("account_details",[]):
  for s in a.get("stream_detail",[]):
    if s.get("cluster",{}).get("leader")==me:
      st=s["state"]; print(me, s["name"], "msgs",st["messages"], "last",st.get("last_ts","")[:19])
    for c in s.get("consumer_detail") or []:
      if c.get("cluster",{}).get("leader")==me:
        print("   ", c["name"], "pending",c["num_pending"], "redelivered",c["num_redelivered"])' $p
done; date -u
```

- `last` of `OTEL_METRICS` and `OTEL_LOGS` is close to now: the spoke is publishing.
- `pending` of `fwd-metrics` and `fwd-logs` is 0: the forwarders keep up.
- `OTEL_DLQ` has 0 messages: nothing was rejected.

If `last` is old, go back to step a. If `pending` keeps growing, go to step c.

### c. Forwarders and the proxy

```bash
for p in $(kubectl get pods -n monitoring -o name | grep otel-forwarder); do
  kubectl logs -n monitoring $p --since=15m
done | grep -P '\terror\t|routing to DLQ' | tail
kubectl logs -n monitoring deploy/prom-label-proxy --since=15m | tail
```

No output is healthy. Common errors:

- `503` or `no backend account assigned yet`: the tenant has no storage instance yet. The
  message stays in NATS and is retried. Check `kubectl get tenants`.
- `400`: the tenant or the data was rejected. The message goes to `OTEL_DLQ`.
- `AlreadyExists ... out of order sample` (Thanos): a few samples of one series arrived out
  of order. Only those samples are lost. A small, steady rate is not a problem.
- `Access Denied` from storage: check the S3 credentials of the TelemetryStack.

### d. Data under the wrong tenant

The gateway sets the tenant to `default` (the cluster owner), or to the namespace name for
namespaces labeled `ace.appscode.com/client-org: "true"`. If data is stored but you cannot
find it, look under the owner as well as under the client organization:

```bash
kubectl get tenants -o custom-columns=NAME:.metadata.name,ACCOUNT:.status.accountID
```

Then repeat the checks in sections 1 to 4 for each tenant.
