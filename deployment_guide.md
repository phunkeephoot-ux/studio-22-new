# Deploying Phaste to Render.com

Since you have the `phaste_app_deploy.zip` and Render.com open, follow these steps to make your app live!

## Phase 1: Get Your Code on GitHub
Render needs your code to be in a Git repository to build and deploy it.

1.  **Unzip** the `phaste_app_deploy.zip` file on your desktop.
2.  Log in to **[GitHub.com](https://github.com)**.
3.  Click the **+** icon (top right) -> **New repository**.
4.  Name it `phaste-app` and click **Create repository**.
5.  On the next screen, click the link "uploading an existing file".
6.  Drag and drop all the files from your unzipped `phaste_app_deploy` folder into the GitHub upload box.
    *   *Note: Ensure you include the hidden `.env` file if possible, or we will set secrets manually in Render (safer).*
7.  Click **Commit changes**.

## Phase 2: Create Web Service on Render
1.  Log in to **[Render.com](https://dashboard.render.com)**.
2.  Click **New +** -> **Web Service**.
3.  Select **Build and deploy from a Git repository**.
4.  Connect your GitHub account if needed, then select the `phaste-app` repository you just created.
5.  **Configure the details**:
    *   **Name**: `phaste-app`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npx prisma generate`
        *   *(This installs dependencies and sets up the database client)*
    *   **Start Command**: `npm start`
6.  **Environment Variables** (Scroll down to "Advanced" or "Environment"):
    *   Click **Add Environment Variable**:
        *   Key: `JWT_SECRET`
        *   Value: `super-secure-secret-key-change-me` (or any random string)
        *   Key: `DATABASE_URL`
        *   Value: `file:./dev.db`
7.  **Instance Type**: Select "Free".

## Phase 3: Deploy!
1.  Click **Create Web Service**.
2.  Render will start building your app. You can watch the logs.
3.  Once the build finishes (about 2-3 minutes), you will see a green "Live" badge.
4.  Click the URL at the top (e.g., `https://phaste-app.onrender.com`) to see your live app!

> **⚠️ Important Note on Database**:
> This setup uses a local SQLite database (`dev.db`). On Render's Free Tier, this file is **ephemeral**, meaning if your app restarts or redeploys, **user data will be reset**. For a permanent production app, you would typically connect a PostgreSQL database, but this setup works perfectly for a live demo!
