# Castleford Community Food Pantry

A welcoming, accessible WordPress Full Site Editing (FSE) block theme for the
Castleford Community Food Pantry — a local surplus-food community pantry
operating from centers provided by GLOW.

> Together we can reduce waste, feed people, build community.

## Project layout

This repository is both the Git repo root and the local WordPress install root.
Only the project theme is tracked in Git; WordPress core, uploads, and local
secrets are git-ignored.

```
castleford-food-pantry/                     (repo root / WP install root)
├─ wp-content/
│  └─ themes/
│     └─ castleford-food-pantry/            (the block theme — tracked in Git)
├─ tools/                                   (dev tooling: tests, asset conversion)
├─ robots.txt
├─ .gitignore
└─ README.md
```

## Local environment

| Setting            | Value                                      |
| ------------------ | ------------------------------------------ |
| Local site URL     | `https://castleford-food-pantry.test/`     |
| Database name      | `castleford-food-pantry`                   |
| Database host/port | `localhost:3306`                           |
| Database user      | `root`                                     |

The vhost for `castleford-food-pantry.test` is managed locally (web server /
hosts entry). WordPress reads its database credentials from `wp-config.php`,
which is **not** committed (see `.gitignore`).

## Prerequisites

- PHP 8.x
- MySQL 8.x running on `localhost:3306`
- [WP-CLI](https://wp-cli.org/)
- Node.js 18+ and npm (for the test and asset-tooling layer under `tools/`)
- A local web server serving the repo root at `https://castleford-food-pantry.test/`

## Setup

1. **Clone the repository**

   ```sh
   git clone git@github.com:ShaneMuir/castleford-food-pantry.git
   cd castleford-food-pantry
   ```

2. **Create the database** (if it does not already exist)

   ```sh
   mysql -h 127.0.0.1 -P 3306 -u root -p \
     -e "CREATE DATABASE IF NOT EXISTS \`castleford-food-pantry\`;"
   ```

3. **Download WordPress core** (core is git-ignored, so a fresh clone needs it)

   ```sh
   wp core download
   ```

4. **Create `wp-config.php`** (git-ignored — generated per environment)

   ```sh
   wp config create \
     --dbname='castleford-food-pantry' \
     --dbuser=root \
     --dbpass=root \
     --dbhost=127.0.0.1:3306
   ```

5. **Install WordPress**

   ```sh
   wp core install \
     --url='https://castleford-food-pantry.test' \
     --title='Castleford Community Food Pantry' \
     --admin_user=admin \
     --admin_password='<your-strong-password>' \
     --admin_email='castlefordcommunityfoodpantry@gmail.com'
   ```

6. **Activate the theme**

   ```sh
   wp theme activate castleford-food-pantry
   ```

7. **Verify**

   ```sh
   wp core is-installed && echo "WordPress is installed"
   wp db check
   ```

   Then open `https://castleford-food-pantry.test/` in a browser.

## Version control

- Remote: `git@github.com:ShaneMuir/castleford-food-pantry.git`
- Default branch: `main`
- Tracked: the theme at `wp-content/themes/castleford-food-pantry/`, repo-root
  tooling, and config (`.gitignore`, `README.md`, `robots.txt`, `package.json`).
- Ignored: WordPress core, `wp-content/uploads/`, plugins, non-project themes,
  and local secrets (`wp-config.php`, `.env`).

## Development tooling

Developer tooling (tests and asset conversion) lives under `tools/` with a root
`package.json`. The theme itself runs with **no build step** — the `tools/`
scripts (WebP conversion, poster extraction, SVGO, tests) are conveniences only.
