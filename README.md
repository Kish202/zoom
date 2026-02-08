# Zoom - Live Fitness Classes

Live fitness class viewer and join page. Browse upcoming classes, see live countdowns, and join when a class goes live.

## Features

- Live class detection with real-time countdown timers
- Join modal with pre-class checklist (equipment, audio, camera)
- Featured class view with class details (duration, intensity, level, equipment)
- Similar classes sidebar for browsing other sessions
- Responsive design (mobile + desktop)
- Fetches class data from Supabase API


## Tech Stack

- Next.js 16, React 19, Tailwind CSS 4

## Setup

```bash
npm install
```

Create a `.env.local` file:

```
SUPABASE_API_URL=your_api_url
SUPABASE_BEARER_TOKEN=your_token
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
