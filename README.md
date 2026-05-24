# WeLoveMovies — Full Stack Project

REST API backend (Express + Knex + PostgreSQL) with a React frontend for browsing movies, theaters, and reviews.

**GitHub:** [ChrisGrantMKE/Final-Backend-Project](https://github.com/ChrisGrantMKE/Final-Backend-Project)

---

## Project structure

```
Final-Backend-Project/
├── src/              # Express API (movies, theaters, reviews)
├── client/           # React + Vite frontend
├── src/db/migrations # Database migrations
├── src/db/seeds      # Seed data
└── test/             # Jest API tests
```

---

## Local development

### Prerequisites

- Node.js 18+
- PostgreSQL locally **or** a [Neon](https://neon.tech) database URL

### Setup

```bash
git clone https://github.com/ChrisGrantMKE/Final-Backend-Project.git
cd Final-Backend-Project

npm install
npm install --prefix client

cp .env.sample .env
# Edit .env with your DATABASE_URL and PORT
```

### Run locally (two terminals)

**Terminal 1 — API (port 5001):**
```bash
npm start
```

**Terminal 2 — Frontend (port 5173):**
```bash
npm run client
# or: cd client && npm start
```

Open **http://localhost:5173**

### Database commands

```bash
npm run migrate    # Run migrations
npm run seed       # Load seed data
npm run reset      # Rollback + migrate + seed
npm test           # Run test suite
```

---

## Deploy to Oracle Cloud (production)

This guide assumes you have:

- An **Oracle Linux** VM with a **public IP**
- **Ingress rules** open for ports **22**, **3000**, and **5001**
- A **Neon PostgreSQL** production database URL
- SSH access as user `opc`

Replace placeholders:

| Placeholder | Example |
|-------------|---------|
| `YOUR_PUBLIC_IP` | `123.45.67.89` |
| `YOUR_NEON_DATABASE_URL` | `postgresql://user:pass@host/neondb?sslmode=require` |

---

### Step 1 — SSH into your Oracle Linux instance

From your local machine:

```bash
ssh -i /path/to/your-private-key opc@YOUR_PUBLIC_IP
```

---

### Step 2 — Install Node.js and Git (first time only)

```bash
sudo dnf update -y
sudo dnf install -y git

curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

node -v
npm -v
```

---

### Step 3 — Open firewall ports on the VM (first time only)

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5001/tcp
sudo firewall-cmd --reload
```

Also confirm OCI **Security List ingress rules** allow TCP **3000** and **5001** from `0.0.0.0/0`.

---

### Step 4 — Clone the repository

```bash
cd ~
git clone https://github.com/ChrisGrantMKE/Final-Backend-Project.git
cd Final-Backend-Project
```

---

### Step 5 — Install dependencies

```bash
npm install
npm install --prefix client
```

---

### Step 6 — Configure environment variables

Create the backend `.env` file (never commit this):

```bash
nano .env
```

Paste and edit:

```env
NODE_ENV=production
PORT=5001
DATABASE_URL="YOUR_NEON_DATABASE_URL"
FRONTEND_URL=http://YOUR_PUBLIC_IP:3000
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

Create the frontend production build config:

```bash
echo "VITE_API_URL=http://YOUR_PUBLIC_IP:5001" > client/.env.production
```

Replace `YOUR_PUBLIC_IP` with your VM's public IP in both files.

---

### Step 7 — Build the frontend

```bash
npm run client:build
```

This creates `client/dist/` — the static site served on port 3000.

---

### Step 8 — Set up the database

Run migrations and seed against your Neon production database:

```bash
npm run migrate
npm run seed
```

---

### Step 9 — Install PM2 (process manager, first time only)

PM2 keeps the API and frontend running after you disconnect from SSH.

```bash
sudo npm install -g pm2
```

---

### Step 10 — Start the backend and frontend

```bash
# Start Express API on port 5001
pm2 start src/server.js --name welovemovies-api

# Serve React build on port 3000
pm2 start "npx serve -s client/dist -l 3000" --name welovemovies-web

# Save process list and enable restart on reboot
pm2 save
pm2 startup
```

Run the command that `pm2 startup` prints (it starts with `sudo`), then:

```bash
pm2 save
```

---

### Step 11 — Verify deployment

**On the server:**
```bash
curl http://localhost:5001/movies
curl http://localhost:3000
pm2 status
```

**In your browser:**
- Frontend: **http://YOUR_PUBLIC_IP:3000**
- API: **http://YOUR_PUBLIC_IP:5001/movies**

You should see the movie grid in the browser and JSON from the API endpoint.

---

## Updating after a git push

When you push changes and want to redeploy on Oracle Cloud:

```bash
cd ~/Final-Backend-Project
git pull

npm install
npm install --prefix client

# Rebuild frontend (uses existing client/.env.production)
npm run client:build

# Run any new migrations
npm run migrate

# Restart services
pm2 restart welovemovies-api
pm2 restart welovemovies-web
```

---

## Useful PM2 commands

```bash
pm2 status              # List running processes
pm2 logs                  # View live logs
pm2 logs welovemovies-api # API logs only
pm2 restart all           # Restart everything
pm2 stop all              # Stop everything
```

---

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/movies` | List all movies |
| GET | `/movies?is_showing=true` | Movies currently showing |
| GET | `/movies/:movieId` | Single movie |
| GET | `/movies/:movieId/theaters` | Theaters for a movie |
| GET | `/movies/:movieId/reviews` | Reviews with critic info |
| GET | `/theaters` | All theaters with movies |
| PUT | `/reviews/:reviewId` | Update a review |
| DELETE | `/reviews/:reviewId` | Delete a review |

All successful responses use a `{ data: ... }` key.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Connection refused` in browser | Check OCI ingress rules and VM firewall for ports 3000/5001 |
| Frontend loads, no data | Rebuild with correct `client/.env.production` (`VITE_API_URL`) |
| CORS errors | Set `FRONTEND_URL=http://YOUR_PUBLIC_IP:3000` in `.env`, restart API |
| Database connection fails | Verify Neon URL includes `?sslmode=require`; check IP allowlist in Neon |
| `npm run migrate` fails | Confirm `.env` `DATABASE_URL` points at production Neon DB |
| Broken movie posters | Run `npm run seed` after URL fixes; frontend shows fallback placeholders |

---

## Tech stack

- **Backend:** Node.js, Express, Knex, PostgreSQL (Neon)
- **Frontend:** React, Vite, React Router
- **Deploy:** Oracle Cloud (Oracle Linux), PM2, `serve`
