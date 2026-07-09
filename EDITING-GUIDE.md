# How to Edit Your Website — The Easy Way

Your website now has a built-in **Settings panel**. You no longer need to edit
code files or rebuild Docker to change content or photos.

---

## 1. Open the Settings panel

In your browser, go to:

- On the clinic network: `http://192.168.1.137:3009/admin`
- From the internet: `https://carediagnostics.in/admin`

Log in with the admin password.

> **First time:** the temporary password is `sugandha2026`.
> Change it soon — see section 4 below.

## 2. What you can change (everything!)

The panel has six tabs:

| Tab | What's inside |
|---|---|
| **Doctor & About** | Name, qualifications, title, tagline, intro, about paragraphs, degrees, **doctor's photo** |
| **Contact & Hours** | Phone, emergency number, email, WhatsApp, OPD timings |
| **Hospital & Map** | Hospital name, address, Google Maps links |
| **Services & Expertise** | The 6 service cards, investigation tags, "why choose us" highlights |
| **Photos & Facilities** | The facility photo cards — upload new photos, edit titles |
| **Stats & Social** | The numbers (years, cases), social media links |

Edit anything, then press **Save changes** at the bottom.
Refresh the website — your changes appear **immediately, no rebuild needed**.

## 3. Changing photos

1. Go to **Doctor & About** (for the doctor's photo) or **Photos & Facilities** (for facility photos).
2. Click **Change photo** and pick an image from your computer or phone.
3. Press **Save changes**.

Photos are stored inside the Docker data volume (`/app/data/uploads`), so they
survive container rebuilds and updates.

## 4. Changing the admin password (do this once)

On the Synology:

```bash
cd /volume1/docker/website-sugandha
vi docker-compose.yml
```

Find the line:

```
- ADMIN_PASSWORD=sugandha2026
```

Change it to your own secret password, save (`Esc` then `:wq`), then:

```bash
docker compose up -d
```

(No rebuild needed — restarting applies the new password.)

## 5. Made a mess? Reset

In the panel, go to **Stats & Social → Danger zone → Reset website to
original content**. All edits are removed and the original built-in content
returns. Uploaded photos stay saved but are no longer shown.

---

## For reference: the old way still works

The file `src/config/site.config.ts` still holds the **default** content —
what the website shows before any edits are made in the panel.
Anything you save in the panel **overrides** those defaults.

If you ever edit the config file directly, note that panel edits win. Use
"Reset" in the panel first if you want the config file's content to show.
