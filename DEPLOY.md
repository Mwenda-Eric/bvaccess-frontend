# BVAccess Frontend - Vercel Deployment

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel to access your GitHub

---

## Step 2: Import Project

1. Click **Add New...** → **Project**
2. Select your **bvaccess-frontend** repository
3. Click **Import**

---

## Step 3: Configure Environment Variables

Before clicking Deploy, add these environment variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.azurewebsites.net/api/v1` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |
| `NEXTAUTH_SECRET` | Generate at [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) |

---

## Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (~1-2 minutes)
3. Click the generated URL to view your site

---

## Automatic Deployments

- Every push to `master` deploys to production
- Every push to other branches creates a preview deployment

---

## Update Environment Variables Later

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add or edit variables
4. Redeploy for changes to take effect

---

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Enter your domain name
3. Add the DNS records shown to your domain registrar

---

## Pricing

| Plan | Cost | Includes |
|------|------|----------|
| Hobby | Free | Personal projects, 100GB bandwidth |
| Pro | $20/month | Team features, 1TB bandwidth |

---

## Quick Start

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Import your repo
3. Add environment variables
4. Click Deploy

Vercel auto-detects Next.js and handles everything.
