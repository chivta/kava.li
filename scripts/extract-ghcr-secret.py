# Extracts the ghcr-secret from ruscan's decrypted secrets and rewrites its
# namespace to kavali. Reads plaintext on stdin, writes the single Secret out.
import sys, yaml

docs = [d for d in yaml.safe_load_all(sys.stdin) if d]
for d in docs:
    if d.get("kind") == "Secret" and d.get("metadata", {}).get("name") == "ghcr-secret":
        d["metadata"] = {"name": "ghcr-secret", "namespace": "kavali"}
        d.pop("sops", None)
        yaml.safe_dump(d, sys.stdout, default_flow_style=False)
        sys.exit(0)
sys.exit("ghcr-secret not found")
