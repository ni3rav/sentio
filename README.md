# Sentio Deployment

This document describes the complete production setup used to deploy the Sentio application on a GCP VM using Bun, Caddy, systemd, and GitHub Actions CI/CD.

---

## 1. VM and SSH Setup

### Steps

* Created a Debian VM on Google Cloud Platform.
* Generated a local SSH key (`id_ed25519_gcp`).
* Added the public key to the VM's SSH metadata.
* Connected to the VM using:

  * Browser SSH (to set sudo password for first time).
  * Local SSH via:

    ```
    ssh -i ~/.ssh/id_ed25519_gcp deploy@<IP>
    ```
* Created a `deploy` user:

  * Added to `sudo` group.
  * Configured `~deploy/.ssh/authorized_keys`.
  * Set correct permissions on `.ssh` folder.

---

## 2. Environment Setup on the VM

Installed required tools:

* Bun
* Git
* curl
* unzip

Verified installations:

```
bun -v
caddy version
```

---

## 3. Directory Layout

Created project structure under `/var/www/sentio`:

```
/var/www/sentio
    index.ts
    package.json
    bun.lock
    client/
        dist/
    deploy/
        deploy.sh
```

Ownership given to `deploy` user.

---

## 4. Systemd Service Configuration

Created service file at:

```
/etc/systemd/system/sentio.service
```

Configured to:

* Run Bun backend via `bun run start`
* Use working directory `/var/www/sentio`
* Restart automatically
* Load environment variables from systemd or `.env` (optional)

Added `deploy` user sudo permissions (passwordless) for restarting the service:

```
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart sentio
```

Enabled the service:

```
sudo systemctl enable sentio
```

---

## 5. Caddy Reverse Proxy Setup

Installed Caddy via official repo.

Configured Caddyfile (`/etc/caddy/Caddyfile`) to reverse proxy to Bun:

```
sentio.ni3rav.me {
    reverse_proxy localhost:3000
}
```

Reloaded Caddy:

```
sudo systemctl reload caddy
```

Caddy automatically handled:

* HTTP to HTTPS redirects
* TLS certificate issuance
* Renewal via Let's Encrypt

---

## 6. Static IP Configuration

Reserved a static IP in GCP:

```
35.208.182.104
```

Replaced any old ephemeral IP references with the static IP.

---

## 7. Firewall Rules

Added inbound firewall rules for:

* TCP 80 (HTTP)
* TCP 443 (HTTPS)

Configured to allow from `0.0.0.0/0`.

---

## 8. Domain and DNS Setup

Configured DNS in Namecheap:

| Type | Host   | Value          | TTL       |
| ---- | ------ | -------------- | --------- |
| A    | sentio | 35.208.182.104 | Automatic |

Allowed the subdomain to propagate.

Caddy then served the application at:

```
https://sentio.ni3rav.me
```

---

## 9. GitHub Actions CI/CD Pipeline

Pipeline did the following:

1. Checked out repo
2. Installed Bun
3. Installed backend dependencies
4. Installed frontend dependencies
5. Built React frontend
6. Bundled the app into `app.tar.gz`
7. Securely uploaded bundle to VM (`scp`)
8. Executed deploy script via SSH
9. Restarted systemd service

Fixed issues throughout:

* Credential scope errors
* bun.lock file mismatches
* SCP directory-vs-file conflicts
* Non-interactive sudo prompts
* Service restarts and working directory corrections

---

## 10. Deploy Script

Located at:

```
/var/www/sentio/deploy/deploy.sh
```

Responsibilities:

* Clean old build (except deploy directory)
* Extract updated `app.tar.gz`
* Restart backend service

---

## 11. Final Verification

Validated:

* Bun server responds on `localhost:3000`
* Caddy proxies correctly
* TLS is valid
* Systemd service stable
* CI/CD workflow deploys successfully
* Application reachable at:

  ```
  https://sentio.ni3rav.me
  ```

---

## Summary

The Sentio application now has:

* Fully automated CI/CD pipeline
* Stable static IP
* Proper firewall configuration
* Secure deploy user with limited sudo
* Bun backend served through systemd
* Caddy reverse proxy with automatic HTTPS
* One-command deployments from GitHub
