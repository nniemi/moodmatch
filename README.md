# MoodMatch Dashboard

A modern Next.js dashboard that lets users log in with Spotify, view their recent tracks, and get music recommendations based on their mood. Built with security best practices: all authentication is handled server-side, and sensitive tokens are never exposed to the client.

## 🚀 Features

- **Spotify OAuth Login** (secure, server-side)
- **Personalized Dashboard** with recent tracks and mood-based recommendations
- **Redux Toolkit** for state management
- **Material UI** for a clean, modern look
- **Secure Token Handling**: Access tokens are stored in HttpOnly cookies and never exposed to the frontend

## 🛠️ Tech Stack

- Next.js
- React
- Redux Toolkit
- Material UI
- Spotify Web API
- TypeScript

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/moodmatch-dashboard.git
cd moodmatch-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Register Your App with Spotify

- Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Create a new app
- Add your callback URL to the app settings:
  - For production: `https://your-vercel-app.vercel.app/api/callback`

### 4. Set Environment Variables

Create a `.env` file for local development:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/callback
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

For **Vercel deployment**, set these in your Vercel project settings:

- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` (Spotify Client ID)
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` (e.g. `https://your-vercel-app.vercel.app/api/callback`)
- `SPOTIFY_CLIENT_SECRET` (Spotify Client Secret)

### 5. Run the app locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)
**NOTE: Spotify doesn't allow localhost as a Redirect URI, hence deployment is needed**

## 🏗️ Deployment

Deploy to [Vercel](https://vercel.com/) for best results. The app is optimized for Vercel's serverless environment.

## 🔒 Security Notes

- **Access tokens are stored in HttpOnly cookies** and are never accessible to client-side JavaScript.
- **All authentication checks and token validation** are performed server-side via API routes.
- **Logout** is handled securely via a POST request to `/api/logout`.

## 🧪 Debugging & Health

- `/api/health` — Shows environment variable status
- `/api/auth-status` — Checks if the user is authenticated (validates token with Spotify)
- `/api/debug-cookies` — Shows cookies received by the server (for debugging only)

## 📂 Project Structure

```
components/         # React components (LandingPage, SpotifyWidget, etc.)
features/           # Redux slices
pages/              # Next.js pages and API routes
  api/              # All backend API endpoints (auth, callback, health, etc.)
auth/               # Spotify auth helpers
app/                # Redux store
```

## 🙏 Credits

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Next.js](https://nextjs.org/)
- [Material UI](https://mui.com/)

---

**Enjoy MoodMatch!** 🎧

