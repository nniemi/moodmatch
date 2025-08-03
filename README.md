# MoodMatch Dashboard

A modern Next.js application that analyzes your mood through AI and provides personalized Spotify music recommendations with dynamic theming. Built with security best practices: all authentication is handled server-side, and sensitive tokens are never exposed to the client.

## 🎵 Demo

![Demonstration of functionality.](https://imgur.com/a/hXDARyF)


## 🚀 Features

- **AI-Powered Mood Detection** - Describe your mood and get instant analysis
- **Dynamic Theme System** - Visual themes that adapt to your mood
- **Spotify OAuth Login** (secure, server-side)
- **Personalized Music Recommendations** based on your current mood
- **Interactive UI** with smooth animations and transitions
- **Redux Toolkit** for state management
- **Material UI** for a clean, modern look
- **Secure Token Handling**: Access tokens are stored in HttpOnly cookies and never exposed to the frontend

## 🎨 Mood-Based Theming

The app features a dynamic theme system that changes colors based on your detected mood:

When you describe your mood, the app sends your input to an API route that uses OpenAI to generate a matching color scheme. The backend asks OpenAI for a primary and secondary color (in hex format) that best represent your mood, and then applies these colors to the interface. If OpenAI can't provide a suitable response, the app falls back to a set of default color themes for common moods.


The entire interface adapts in real-time when you describe your mood!

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI**: Material UI with custom theming
- **State Management**: Redux Toolkit
- **AI**: OpenAI GPT-3.5 for mood analysis
- **Music**: Spotify Web API
- **Styling**: Emotion (CSS-in-JS)

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
# Spotify Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=redirect_uri
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# OpenAI Configuration (for mood analysis)
OPENAI_API_KEY=your_openai_api_key
```

For **Vercel deployment**, set these in your Vercel project settings:

- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` (Spotify Client ID)
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` (e.g. `https://your-vercel-app.vercel.app/api/callback`)
- `SPOTIFY_CLIENT_SECRET` (Spotify Client Secret)
- `OPENAI_API_KEY` (OpenAI API Key)

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
- **OpenAI API calls** are handled server-side to protect your API key.
- **Logout** is handled securely via a POST request to `/api/logout`.

## 🧪 Debugging & Health

- `/api/health` — Shows environment variable status
- `/api/auth-status` — Checks if the user is authenticated (validates token with Spotify)
- `/api/debug-cookies` — Shows cookies received by the server (for debugging only)

## 📂 Project Structure

```
components/         # React components
  LandingPage.tsx  # Landing page with mood features
  MoodChatbot.tsx  # AI mood analysis interface
  SpotifyWidget.tsx # Music recommendations widget
features/           # Redux slices
pages/              # Next.js pages and API routes
  api/              # Backend API endpoints
    mood.ts         # AI mood analysis
    theme-utils.ts  # Dynamic theme generation
    spotify-token.ts # Secure token handling
auth/               # Spotify auth helpers
utils/              # Utility functions
  ThemeContext.tsx  # Global theme management
  themeUtils.ts     # Theme API client wrapper
app/                # Redux store
```

## 🎯 How It Works

1. **User describes their mood** in the interactive chatbot
2. **AI analyzes the mood** using OpenAI's GPT-3.5
3. **Dynamic theme is generated** based on the detected mood
4. **Spotify recommendations** are fetched for the specific mood
5. **Entire interface adapts** with new colors and music suggestions

## 🙏 Credits

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [OpenAI API](https://openai.com/api/) for mood analysis
- [Next.js](https://nextjs.org/)
- [Material UI](https://mui.com/)

---

**Enjoy MoodMatch!** 🎧✨

