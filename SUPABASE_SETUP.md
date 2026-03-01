# PulseMate Supabase Setup Guide

## 📋 Overview
This guide will help you set up the Supabase database backend for PulseMate.

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your existing account
3. Click **"New Project"**
4. Fill in:
   - Project Name: `pulsemate`
   - Database Password: (Generate strong password and save it)
   - Region: Choose closest to your users
5. Click **"Create new project"** and wait 2-3 minutes

## 🗄️ Step 2: Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** button
6. You should see: "Success. No rows returned"

## 🔑 Step 3: Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (starts with: eyJhbG...)
   - **service_role** key (starts with: eyJhbG... - keep this SECRET!)

## 📝 Step 4: Update Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
```

## 📧 Step 5: Setup Resend Email

1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Click **"API Keys"** in sidebar
4. Click **"Create API Key"**
5. Name it: `pulsemate-production`
6. Copy the key and add to `.env.local`
7. Go to **"Domains"** and add your domain (or use test domain for now)

## ⚙️ Step 6: Configure Supabase Auth

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Go to **Authentication** → **URL Configuration**
4. Add your site URL: `http://localhost:3000` (for dev) or your production URL

## 🔒 Step 7: Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. You should see policies for all tables (users, chat_messages, etc.)
3. Each table should have green "RLS enabled" badge
4. If not, re-run the migration SQL

## 🧪 Step 8: Test Database Connection

Run this command in your terminal:

```bash
cd pulsemate
npm run dev
```

Then visit: `http://localhost:3000/dashboard`

Sign in with Clerk, and check browser console for any Supabase errors.

## 📊 Step 9: Enable Daily Backups

1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll to **Backup Settings**
3. Enable **Point-in-time Recovery (PITR)** (paid feature) OR
4. Use free daily backups (available on free tier)
5. Set retention period to 7 days minimum

## 🔄 Step 10: Migration from localStorage

The app will automatically:
1. Continue working with localStorage (backwards compatible)
2. Start syncing new data to Supabase
3. Gradually migrate existing localStorage data

You can monitor migration in browser DevTools console.

## 📈 Monitoring & Maintenance

### Check Database Health
- Supabase Dashboard → **Database** → **Tables**
- View row counts and recent activity

### View Logs
- Supabase Dashboard → **Logs** → **Database Logs**
- Check for errors or slow queries

### API Usage
- Supabase Dashboard → **Settings** → **Usage**
- Monitor API calls and storage

## 🆘 Troubleshooting

### "Invalid API key" Error
- Double-check `.env.local` has correct keys
- Restart dev server: `npm run dev`

### "Row Level Security" Error
- Verify RLS policies are created
- Re-run migration SQL if needed

### Email Not Sending
- Check Resend dashboard for logs
- Verify domain is configured
- Check RESEND_API_KEY in `.env.local`

### Connection Timeout
- Check Supabase project is not paused
- Verify project URL is correct
- Check internet connection

## 📞 Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Check browser console for errors
3. Verify all environment variables are set
4. Restart dev server

## 🎯 Next Steps

Once setup is complete:
1. ✅ Test contact form submission
2. ✅ Test issue report submission
3. ✅ Create a test user and verify data sync
4. ✅ Export user data to verify GDPR compliance
5. ✅ Monitor database for first few days

Your database is now ready for production! 🚀
