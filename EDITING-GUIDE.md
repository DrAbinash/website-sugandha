# How to Edit Your Website

Everything on this website is controlled by **one file**. You don't need to know coding — just open the file, find the text you want to change, and edit it.

---

## The One File: `src/config/site.config.ts`

This file contains ALL the content — your name, qualifications, phone, services, timings, photos, everything. Change a value here, rebuild, and the website updates.

### Where is it?
```
src/config/site.config.ts
```

### How to edit it on your Synology

```bash
cd /volume1/docker/website-sugandha
vi src/config/site.config.ts
```

Press `i` to edit, `Esc` + `:wq` to save. Then rebuild:
```bash
docker compose up -d --build
```

---

## What You Can Change (and where)

| What you want to change | Look for in the file |
|------------------------|---------------------|
| Doctor name | `name: "Dr. Sugandha Priyadarshini"` |
| Qualifications | `qualifications: ["MBBS", "MD (Radiology)"]` |
| Title | `title: "Consultant Radiologist"` |
| Phone number | `phone:` and `phoneHref:` (digits only, no spaces) |
| Emergency number | `emergency:` and `emergencyHref:` |
| Email | `email:` |
| WhatsApp | `whatsapp:` (digits only) |
| Hospital name | `hospital.name` |
| Hospital address | `hospital.address` |
| OPD timings | `timings` array |
| Services/specializations | `specializations` array |
| Conditions treated | `conditions` array |
| Stats (years, cases) | `stats` array |
| Social media links | `social` object |

---

## How to Change Photos

### Doctor's photo
1. Put your photo in the `public/` folder (name it `doctor.jpg`)
2. In `site.config.ts`, change:
   ```
   photo: "/doctor-placeholder.svg"
   ```
   to:
   ```
   photo: "/doctor.jpg"
   ```
3. Rebuild: `docker compose up -d --build`

### Facility/gallery images
The 4 gallery images are in `public/`:
- `gallery-ot.jpg` → Operation Theatre / MRI Suite
- `gallery-icu.jpg` → CT Scan / ICU
- `gallery-consult.jpg` → Consultation room
- `gallery-hospital.jpg` → Hospital building

Replace these files with your own photos (keep the same filenames), then rebuild.

### Hero image (the big image at the top)
- File: `public/hero-radiology.png`
- Replace it with your own image (keep the same filename), then rebuild.

### Logo / Favicon
- File: `public/favicon.svg`
- Replace it with your own logo, then rebuild.

---

## How to Change Colors

The theme color is teal (#0d9488). To change it, edit `src/app/globals.css` and look for the `--primary` line:
```
--primary: oklch(0.55 0.13 180);
```
Change the numbers to get a different color. Then rebuild.

---

## Deploy on Synology (first time)

```bash
cd /volume1/docker
git clone https://github.com/DrAbinash/website-sugandha.git website-sugandha
cd website-sugandha

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="file:/app/data/hospital.db"
NEXT_PUBLIC_SITE_URL="https://carediagnostics.in"
EOF

# Build and start
docker compose up -d --build
```

Open: `http://<nas-ip>:3009`

---

## Update after editing

```bash
cd /volume1/docker/website-sugandha
git pull                          # if you edited on GitHub
docker compose up -d --build      # rebuild with changes
```

---

## Quick reference: common edits

### Change phone number
In `site.config.ts`:
```
phone: "+91 98765 43210",
phoneHref: "+919876543210",
emergency: "+91 98765 43210",
emergencyHref: "+919876543210",
```

### Add a new service
In the `specializations` array, add:
```
{
  icon: "Stethoscope",        // any Lucide icon name
  title: "New Service Name",
  description: "Description of the service.",
},
```

### Change OPD timing
In the `timings` array:
```
{ day: "Monday", hours: "10:00 AM – 6:00 PM" },
```
