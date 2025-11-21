# Digital Menu Management System - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Environment Configuration

Create a `.env.local` file in the project root with these variables:

\`\`\`env
DATABASE_URL=postgresql://neondb_owner:npg_d0JKFQEyzrT5@ep-fancy-wildflower-ahunjlvm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
RESEND_API_KEY=re_S9VHrrJx_GW6MfvNPd8tnapgFehKVWpGs
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Initialize Database

\`\`\`bash
npx prisma migrate deploy
\`\`\`

This creates all the necessary tables in your Neon PostgreSQL database.

### 4. Verify Resend Setup

**IMPORTANT**: Before testing, you need to verify your sender email in Resend:

1. Go to https://resend.com/emails
2. Look for "Domain" or "Sender Emails"
3. Add your email: `devendrakkumar.dev@gmail.com`
4. Resend will send you a verification email
5. Click the link in that email to verify
6. Once verified, update `FROM_EMAIL` in `lib/email.ts` to your email

**For Development (No verification needed)**:
- Resend provides a test email: `onboarding@resend.dev`
- Currently configured to use this for testing
- Emails sent from this address only go to verified recipients

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:3000

## Testing the Email Verification Flow

### Test Registration with Email:

1. Go to http://localhost:3000/auth/register
2. Fill in:
   - Full Name: `Test User`
   - Country: `India`
   - Email: `devendrakkumar.dev@gmail.com` (your verified email)
3. Click "Create Account"
4. Check your email inbox for verification code
5. Enter the 6-digit code
6. You'll be logged in to dashboard

### Test Login with Email:

1. Go to http://localhost:3000/auth/login
2. Enter your email: `devendrakkumar.dev@gmail.com`
3. Click "Send Verification Code"
4. Check email for code
5. Enter code and click "Sign In"

## Resend Email Configuration Details

### Current Setup:
- **API Key**: `re_S9VHrrJx_GW6MfvNPd8tnapgFehKVWpGs`
- **From Email**: `onboarding@resend.dev` (test mode)
- **Sender Name**: DigiMenu
- **Email Type**: Transactional (verification codes)

### Moving to Production:

1. **Verify Your Domain** (if you have your own domain):
   - Go to Resend Dashboard → Domains
   - Add your domain (e.g., digimenu.com)
   - Follow DNS verification steps

2. **Update Sender Email**:
   - Once domain is verified, update in `lib/email.ts`:
   \`\`\`typescript
   const FROM_EMAIL = "noreply@yourdomain.com"
   \`\`\`

3. **Set Up DKIM** for better deliverability:
   - Resend provides DKIM records
   - Add them to your DNS provider

## Troubleshooting

### Issue: "Cannot find module 'resend'"
**Solution**: Run `npm install resend`

### Issue: "Email not received"
**Solution**: 
- Check spam/promotions folder
- Verify the email address in Resend dashboard
- Check Resend logs at https://resend.com/emails

### Issue: "RESEND_API_KEY is undefined"
**Solution**: 
- Verify `.env.local` is in project root
- Restart dev server after adding `.env.local`
- Check that env variable name is exactly `RESEND_API_KEY`

### Issue: "Invalid API Key"
**Solution**: 
- Copy API key from https://resend.com/api-keys
- Make sure there are no spaces before/after
- Regenerate key if needed

### Issue: "Email service temporarily unavailable"
**Solution**:
- Check Resend status at https://status.resend.com
- Verify internet connection
- Check Resend logs for detailed error

## File Structure

\`\`\`
project-root/
├── .env.local (YOUR CREDENTIALS - DO NOT COMMIT)
├── .env.example (template for reference)
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── register/route.ts (uses sendVerificationEmail)
│   │       ├── request-code/route.ts (uses sendVerificationEmail)
│   │       ├── verify/route.ts
│   │       └── login/route.ts
│   ├── auth/
│   │   ├── register/page.tsx
│   │   ├── verify/page.tsx
│   │   └── login/page.tsx
│   └── dashboard/
├── lib/
│   ├── email.ts (Resend integration)
│   ├── auth.ts (session management)
│   └── db.ts (Prisma client)
├── prisma/
│   └── schema.prisma (database schema)
└── package.json

\`\`\`

## How Email Verification Works

\`\`\`
User Registration
    ↓
POST /api/auth/register
    ├─ Create user in DB
    ├─ Generate 6-digit code
    ├─ Call sendVerificationEmail()
    │   └─ Resend API sends email
    └─ Redirect to verify page
    
User clicks verification link in email
    ↓
POST /api/auth/verify
    ├─ Validate code
    ├─ Mark user as verified
    └─ Create session + redirect to dashboard
\`\`\`

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `RESEND_API_KEY` | Resend API authentication | `re_xxxxx` |
| `NEXT_PUBLIC_APP_URL` | Public app URL (visible in browser) | `http://localhost:3000` |

## Next Steps

1. ✅ Create `.env.local` with your credentials
2. ✅ Run `npm install`
3. ✅ Run `npx prisma migrate deploy`
4. ✅ Run `npm run dev`
5. ⭐ Test registration/login with email verification
6. 🚀 Deploy to Vercel (see deployment guide below)

## Deployment to Vercel

### Step 1: Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
\`\`\`

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"

### Step 3: Add Environment Variables in Vercel
In the "Environment Variables" section, add:
\`\`\`
DATABASE_URL = your_neon_connection_string
RESEND_API_KEY = re_S9VHrrJx_GW6MfvNPd8tnapgFehKVWpGs
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
\`\`\`

### Step 4: Deploy
Click "Deploy" - Vercel will automatically run migrations and start your app!

## Support

For issues, check:
- Neon Dashboard: https://console.neon.tech
- Resend Dashboard: https://resend.com/emails
- Server logs in Vercel: https://vercel.com/dashboard
