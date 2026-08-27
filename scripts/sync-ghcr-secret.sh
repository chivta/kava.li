#!/usr/bin/env bash
# Copies the ghcr pull secret out of the ruscan repo into this one, re-namespaced
# to kavali and re-encrypted to the same age recipient. Run from the repo root
# after the ruscan checkout is available at ../ruscan.
set -euo pipefail

RUSCAN="${RUSCAN:-../ruscan}"

sops -d "$RUSCAN/k8s/secrets.enc.yaml" \
  | python3 scripts/extract-ghcr-secret.py \
  > k8s/secrets.yaml

sops -e k8s/secrets.yaml > k8s/secrets.enc.yaml
rm -f k8s/secrets.yaml

# Register the secret with kustomize on first run.
if ! grep -q '^- secrets.enc.yaml$' k8s/kustomization.yaml; then
  sed -i 's|^- ingress.yaml$|- ingress.yaml\n- secrets.enc.yaml|' k8s/kustomization.yaml
fi

echo "wrote k8s/secrets.enc.yaml and registered it in k8s/kustomization.yaml"
