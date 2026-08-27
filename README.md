# kava.li

Static "under construction" page for kava.li.

## Layout

- `frontend/` — Vite + React + TypeScript SPA. The gif lives at `frontend/public/under-construction.gif`.
- `k8s/` — deployment manifests, Traefik ingress with cert-manager TLS.

## Local development

```
docker compose up
```

Serves on http://localhost:5173 with hot reload. Or `cd frontend && npm install && npm run dev`.

## Build the production image

```
docker build -t ghcr.io/chivta/kavali-frontend:$(git rev-parse HEAD) frontend
```

nginx serves the bundle on port 8080 as a non-root user with a read-only root filesystem.
`GET /health` returns 204, `GET /metrics` returns nginx stub_status; both are excluded from the access log.

## Deploy

```
kubectl apply -k k8s
```

Assumes a Traefik ingress controller and a cert-manager `ClusterIssuer` named `letsencrypt-prod`.
Point the `kava.li` and `www.kava.li` A records at the Traefik load balancer.

## Pipelines

CI (`.github/workflows/ci.yml`) lints, typechecks and builds the frontend on every push and PR.
CD (`.github/workflows/cd.yml`) runs only after CI passes on `main`: it builds the image when
`frontend/` changed, pushes it to `ghcr.io` tagged with the full commit SHA, then commits the new
tag into `k8s/deployment.yaml` as `deploy: frontend <sha>`. The manifest is the ground truth for
what runs in the cluster — nothing is applied imperatively by the pipeline.
