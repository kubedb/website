---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: cluster-management-telemetry-data-check
    name: Verifying Telemetry Data
    parent: cluster-management
    weight: 100
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Verifying Telemetry Data (Logs & Metrics)

This guide shows how to confirm your logs and metrics are actually being stored — not just
collected — in the monitoring stack: **ClickHouse** for logs, **Thanos + S3** for metrics.
See [OpenTelemetry Monitoring](otel-monitoring.md) for how the stack is set up.

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
(`appscode-otel-stack`). See the [Troubleshooting](#troubleshooting-metrics-stale-but-logs-healthy)
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

## Summary

| Pipeline | Where to look | Healthy signal |
|---|---|---|
| Logs | ClickHouse `<tenant-db>.otel_logs` | `max(Timestamp)` ≈ now, non-zero rows in last 5 min |
| Metrics | Thanos Query `/api/v1/stores`, receive ingester `/metrics` | `maxTime`/head timestamp advancing, close to now |
| S3 | `<bucket>/logs/` and `<bucket>/metrics/` prefixes | Recent objects under both prefixes |

---

## Troubleshooting: metrics stale but logs healthy

There is no Prometheus doing remote-write in this setup. Telemetry is shipped from each
connected cluster by the **`appscode-otel-stack`** chart (built on `opentelemetry-kube-stack`),
which runs two OpenTelemetry collectors in the `monitoring` namespace of the *connected*
cluster:

- **Daemonset (agent) collector**: runs on every node. Its `prometheus` receiver scrapes
  targets assigned by the **Target Allocator** (which discovers `ServiceMonitor`/`PodMonitor`
  CRs), and its `filelog` receiver collects container logs. Everything is forwarded over
  OTLP to the gateway collector.
- **Gateway collector** (deployment): receives OTLP and exports to the monitoring cluster
  through `prom-label-proxy`:
  - **Metrics** → `prometheusremotewrite` exporter → `https://<ingest-endpoint>:10001/api/v1/receive`
    → Thanos receive. The `THANOS-TENANT` header is injected per batch by the
    `headers_setter` extension.
  - **Logs** → `clickhouse` exporter → the same `prom-label-proxy` endpoint → ClickHouse
    (`otel_logs` table).

The `<ingest-endpoint>` depends on how the platform is deployed:

- **DNS mode**: the exporters point at the monitoring cluster's domain name.
- **IP mode**: the exporters use the fixed hostname `prom-label-proxy.monitoring.svc.cluster.local`,
  which is mapped to the monitoring cluster's IP via a `hostAliases` entry on the gateway
  collector pod (required for TLS certificate verification against a bare IP).

Confirm the endpoint actually in use from the gateway collector's config:

```bash
kubectl get opentelemetrycollectors -n monitoring -o yaml | grep -B2 -A2 'endpoint:'
```

Logs and metrics share the daemon → gateway OTLP hop and the mTLS client cert
(`otel-client-cert`), but split into different exporters at the gateway. So if logs are
healthy and metrics are stale, connectivity and certs are fine; the problem is specific
to the metrics path: either **scraping** (daemon collector / Target Allocator) or the
**remote-write export** (gateway → Thanos). Run these checks **on the connected cluster**:

### a. Collector pods are running

```bash
kubectl get pods -n monitoring -l otel-collector-type=daemonset
kubectl get pods -n monitoring -l otel-collector-type=deployment
```

The daemonset collector must have one Running pod per node; a node without an agent pod
silently drops that node's scrape targets (allocation is per-node).

### b. Gateway is exporting metrics without errors

Check the gateway collector's own telemetry for sent vs. failed metric points. The
collector image is minimal (no shell or `wget` inside), so `kubectl exec` will not work;
port-forward its internal telemetry port (8888) and query it from your machine instead:

```bash
kubectl port-forward -n monitoring <gateway-collector-pod> 8888:8888 &
sleep 2   # give the port-forward a moment to establish
curl -s http://localhost:8888/metrics \
  | grep -E 'otelcol_exporter_(sent|send_failed|enqueue_failed).*metric_points'
```

These counters are cumulative since the pod started, so a single reading proves nothing:
a large `send_failed` value may just be leftover from a past incident (for example a
monitoring-cluster restart) while everything is healthy now. Run the `curl` again after
30 seconds or so and compare the two readings; only the counters that are still
*advancing* matter. There are three possible outcomes:

1. **`sent_metric_points{exporter="prometheusremotewrite"}` is increasing and
   `send_failed`/`enqueue_failed` stay flat.** The gateway is exporting successfully, so
   this cluster's pipeline is healthy. The problem is downstream (prom-label-proxy or
   Thanos receive on the monitoring cluster) or a tenant mismatch; continue with step (d).
2. **`send_failed_metric_points` is climbing.** Exports are failing. Read the gateway logs
   for the actual `prometheusremotewrite` error (HTTP status codes, TLS failures) against
   the `prom-label-proxy` endpoint:

   ```bash
   kubectl logs -n monitoring <gateway-collector-pod> --tail=100 | grep -iE "error|prometheusremotewrite"
   ```

   TLS or certificate errors point at the `otel-client-cert` secret (check it exists and
   is not expired). Connection refused or timeout points at a wrong or unreachable ingest
   endpoint. HTTP 4xx/5xx responses point at the prom-label-proxy / Thanos receive side
   on the monitoring cluster.
3. **All counters are flat or zero.** The gateway has nothing to export, which means the
   daemon collectors are not scraping anything. Continue with step (c).

A growing `enqueue_failed_metric_points` means the exporter's sending queue is
overflowing because sends are too slow or failing, and those points are dropped; treat
it the same as outcome 2.

Note the exporter retries for a bounded time (`max_elapsed_time: 120s`) and then drops the
batch, so persistent export errors mean permanent data loss, not delayed delivery.

When finished, stop the background port-forward with `kill %1`.

### c. Scrape targets exist and are being allocated

If the gateway shows nothing to export (`sent` flat, no errors), the daemon collectors
aren't scraping anything. Check that the Target Allocator is running and that
`ServiceMonitor`/`PodMonitor` resources exist for your workloads:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/component=opentelemetry-targetallocator
kubectl get servicemonitors,podmonitors -A
```

The Target Allocator watches these CRs and distributes their scrape targets across the
daemonset collectors. No matching monitors (or an unhealthy allocator) means the
`prometheus` receiver has nothing to scrape: no data flows and no errors are logged
anywhere, which is exactly the "silently stale" symptom.

### d. Data flowing under the wrong tenant

Metrics may be arriving in Thanos but under a different tenant than the one you're
querying. The gateway derives the tenant from resource attributes: it defaults to
`default`, and is set to the source namespace name only for namespaces labeled
`ace.appscode.com/client-org: "true"`; batches with no tenant attribute fall back to
`anonymous`. Re-run the store/query checks from section 2 with `THANOS-TENANT: default`
(and `anonymous`) before concluding data is missing.

After fixing whichever stage was broken, re-run the `prometheus_tsdb_head_max_time` check
from section 2 over a couple of minutes to confirm the timestamp starts advancing.
