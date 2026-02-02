# Deploy MySQL to Aiven — TODO & Step-by-step

This file documents the end-to-end steps to deploy your MySQL database to Aiven and connect the `IMSBackend` app to it.

## Overview
- Create an Aiven MySQL service
- Create or retrieve DB credentials
- Download CA cert and encode into an env var
- Import the repository SQL data to Aiven
- Configure environment variables in deployment (Vercel/local)
- Test connection and run app
- Configure backups and monitoring

## Prerequisites
- An Aiven account and project
- `mysql` client locally (or use Aiven's web console)
- Optionally: Aiven CLI (`aiven`), Vercel account/CLI (if deploying there)

## Steps

1) Create an Aiven MySQL service

- Web console (recommended for first time):
  - Open Aiven console → Select project → Create service → choose `mysql` → pick cloud/region and plan → Create.
- Or using Aiven CLI (example):
  ```bash
  aiven service create --project my-project --service-name my-mysql --service-type mysql \
    --cloud aws-eu-west-1 --plan hobbyist-1
  ```

2) Create database and user (or use the auto-generated credentials)

- In Aiven Console: open the created service → Credentials tab → Create credentials or copy generated credential. You will have Host, Port, User, Password, and Database name.

3) Download CA certificate (for TLS) and prepare env var

- Download the CA PEM from the Aiven service page (TLS/SSL → CA certificate).
- Convert to base64 so it can be stored as an env var.

- Linux / macOS:
  ```bash
  base64 -w0 ca.pem > ca.base64
  cat ca.base64
  ```
- Windows PowerShell:
  ```powershell
  $b = [Convert]::ToBase64String([IO.File]::ReadAllBytes('ca.pem')); Write-Output $b
  ```
- Copy the base64 string and save to env var `DB_SSL_CA`.

4) Add environment variables to your deployment

- Required variables:
  - `DB_HOST` = Aiven host (do NOT use 127.0.0.1)
  - `DB_PORT` = Aiven port (e.g. 25060)
  - `DB_USER` = username
  - `DB_PASSWORD` = password
  - `DB_NAME` = database name
  - `DB_SSL` = true
  - `DB_SSL_CA` = (base64 PEM)
  - `DB_SSL_REJECT_UNAUTHORIZED` = true (recommended)

- Examples:
  - Vercel Dashboard: Project → Settings → Environment Variables → Add the variables for Production/Preview/Development.
  - Vercel CLI: `vercel env add` (see Vercel docs).
  - Local `.env` (for local dev only): create `.env.local` with:
    ```text
    DB_HOST=your-aiven-host.aivencloud.com
    DB_PORT=25060
    DB_USER=youruser
    DB_PASSWORD=yourpass
    DB_NAME=Fin
    DB_SSL=true
    DB_SSL_CA=<base64-encoded-ca>
    DB_SSL_REJECT_UNAUTHORIZED=true
    ```

5) Import your SQL files into Aiven

- From the repository root there are several SQL files (examples in this repo):
  - `dummy_itineraries.sql`
  - `insert_all_packages_itineraries.sql`
  - `insert_bookings_reviews_payments.sql`
  - `insert_package_82.sql`
  - `insert_package_dates.sql`
  - `insert_reviews_payments.sql`
  - `insert_wardha_data.sql`

- Import command using `mysql` client:
  ```bash
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME < insert_all_packages_itineraries.sql
  ```

- If your CA/cert needs to be specified explicitly (client verifies server):
  ```bash
  mysql --ssl-ca=ca.pem -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME < filename.sql
  ```

6) Update `utils/db.js` to use host/port/SSL

- Already updated in this repo to read `DB_HOST`, `DB_PORT`, `DB_SSL`, and `DB_SSL_CA`. Confirm the file: `utils/db.js`.

7) Test connection from your app (local)

- Export env vars (or use `.env.local`) and run:
  ```bash
  node Server.js
  ```
- Check server logs for successful connection. If connection refused:
  - Ensure the `DB_HOST` is the public Aiven host (not `127.0.0.1`).
  - Ensure `DB_PORT` matches Aiven's port.
  - Confirm VPC/firewall restrictions — Aiven may restrict access; check allowed networks or use Aiven's `PGBouncer`/allowed IPs.

8) Run app migrations (if any) and verify data

- Use the app endpoints or direct SQL queries to ensure tables/rows are present after import.

9) Configure backups & monitoring

- In Aiven Console: enable automated backups and set retention. Configure alerts for disk, connections, CPU, etc.

10) Security notes

- Do NOT commit `DB_PASSWORD` or `DB_SSL_CA` into the repo. Use environment variables.
- Keep `DB_SSL_REJECT_UNAUTHORIZED=true` to verify the server certificate.

## Useful Commands Summary

- Encode CA (PowerShell):
  ```powershell
  $b = [Convert]::ToBase64String([IO.File]::ReadAllBytes('ca.pem')); Write-Output $b
  ```
- Import SQL:
  ```bash
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME < insert_all_packages_itineraries.sql
  ```
- Run server (local):
  ```bash
  DB_HOST=... DB_PORT=... DB_USER=... DB_PASSWORD=... DB_NAME=... node Server.js
  ```

## Next actions I can take for you
- Create `.env.example` with placeholders
- Add a small migration/import script that uses `DB_SSL_CA` env var and writes `ca.pem` temporarily to import
- Run the SQL import from this workspace (if you want me to execute commands locally)

---
Created for the IMSBackend project.
