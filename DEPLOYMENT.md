
# Deployment Guide

This guide describes how to deploy your Portfolio Dashboard.

Since your backend uses in-memory caching and scraping, it requires a **persistent** server. Serverless platforms like Vercel/Netlify functions are not ideal for the backend because they restart frequently, clearing your cache and potentially triggering rate limits.

**Recommended Setup:**
- **Frontend**: Vercel (Free, fast, excellent React support)
- **Backend**: Render (Free tier, supports persistent Node.js services)

---

## Part 1: Deploy Backend to Render

1.  Push your code to a GitHub repository.
2.  Go to [dashboard.render.com](https://dashboard.render.com/) and create a new **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Root Directory**: `backend`
    - **Runtime**: Node
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  Click **Deploy Web Service**.
6.  Once live, copy your backend URL (e.g., `https://portfolio-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel

1.  Go to [vercel.com](https://vercel.com/) and add a **New Project**.
2.  Import the same GitHub repository.
3.  Configure the project:
    - **Framework Preset**: Vite
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4.  **Environment Variables**:
    - Add a new variable named `VITE_API_BASE_URL`.
    - Set the value to your Render Backend URL + `/api` (e.g., `https://portfolio-backend.onrender.com/api`).
5.  Click **Deploy**.

---

## Verification
- Open your Vercel URL.
- The dashboard should load.
- It might take 30-60 seconds for the backend to wake up on the free tier of Render (cold start).
