# kava.li

Static "under construction" page for kava.li.

## Layout

- `frontend/` — Vite + React + TypeScript SPA. The gif lives at `frontend/public/under-construction.gif`.
- `k8s/` — manifests Flux reconciles into the cluster: deployment, service and Traefik ingress.

## Local development

```
docker compose up
```

Serves on http://localhost:5173 with hot reload. Or `cd frontend && npm install && npm run dev`.

## Build the production image

```
docker build --target production -t ghcr.io/chivta/kava.li/frontend:$(git rev-parse HEAD) frontend
```

nginx serves the bundle on port 8080 as a non-root user with a read-only root filesystem.
`GET /health` returns 204, `GET /metrics` returns nginx stub_status; both are excluded from the access log.

## Pipelines

CI (`.github/workflows/ci.yml`) lints, typechecks and builds the frontend on every push and PR.
CD (`.github/workflows/cd.yml`) runs only after CI passes on `main`: it builds the image when
`frontend/` changed, pushes it to `ghcr.io/chivta/kava.li/frontend` tagged with the full commit SHA,
then writes that tag into `k8s/kustomization.yaml` as a `deploy:` commit.

## Deploy

Flux reconciles `k8s/` straight from this repo — the wiring lives in
[chivta/homelab](https://github.com/chivta/homelab) under `clusters/main/apps/kavali/`. Nothing is
applied imperatively; the `deploy:` commit is what triggers a rollout.

The image is pulled with the `ghcr-secret` credentials shared with ruscan. Copy them into this
repo once, encrypted to the same age recipient:

```
./scripts/sync-ghcr-secret.sh
```

That writes `k8s/secrets.enc.yaml` and registers it in `k8s/kustomization.yaml`. The plaintext
`k8s/secrets.yaml` is gitignored and deleted by the script.

The cluster serves this behind Traefik, which requests the `kava.li` certificate from its
`letsencrypt` resolver over the Cloudflare DNS-01 challenge. Point the `kava.li` and `www.kava.li`
records at the Traefik load balancer.
