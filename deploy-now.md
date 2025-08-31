# 🚀 DEPLOY NOW - FREE HOSTING

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New Repository"
3. Name it: `rma-system`
4. Make it Public
5. Click "Create Repository"

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd "/Users/sanksinha/Downloads/project 2"
git remote add origin https://github.com/YOUR_USERNAME/rma-system.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend (Render.com - FREE)

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `rma-system` repository
5. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Deploy Web Service"
7. **COPY THE URL** (e.g., `https://rma-system-abc123.onrender.com`)

## Step 4: Deploy Frontend (GitHub Pages - FREE)

1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Source: "GitHub Actions"
4. The site will auto-deploy to: `https://YOUR_USERNAME.github.io/rma-system`

## Step 5: Update API URL

1. Edit `.env.production` file:
   ```
   VITE_API_BASE_URL=https://YOUR_RENDER_URL.onrender.com/api
   ```
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update API URL"
   git push
   ```

## 🎉 FINAL LINKS

- **Frontend**: `https://YOUR_USERNAME.github.io/rma-system`
- **Backend**: `https://YOUR_RENDER_URL.onrender.com`

Share the frontend link with your team - everyone will see the same data!

## ⚠️ Important Notes

- First backend request may take 30 seconds (free tier cold start)
- Data persists forever in the database
- Multiple users can access simultaneously
- 100% FREE hosting