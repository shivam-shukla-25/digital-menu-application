# Quick Start - Digital Menu Management System

## ⚡ 5-Minute Setup

### Step 1: Create .env.local File
At project root, create `.env.local`:

\`\`\`env
DATABASE_URL=postgresql://neondb_owner:npg_d0JKFQEyzrT5@ep-fancy-wildflower-ahunjlvm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
RESEND_API_KEY=re_S9VHrrJx_GW6MfvNPd8tnapgFehKVWpGs
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Step 2: Install & Initialize
\`\`\`bash
# Install dependencies
npm install

# Create database tables
npx prisma migrate deploy
\`\`\`

### Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Open: http://localhost:3000

---

## 🧪 Test the System

### 1. Register New Account
- Go to http://localhost:3000/auth/register
- Fill in:
  - Full Name: `Test User`
  - Country: `India`
  - Email: `devendrakkumar.dev@gmail.com`
- Click "Create Account"
- Check your email inbox for 6-digit verification code
- Enter code on verify page
- ✅ You're logged in!

### 2. Create Restaurant
- Click "New Restaurant" on dashboard
- Enter restaurant name & location
- Save
- ✅ Restaurant created!

### 3. Add Menu Categories
- Select your restaurant
- Click "Add Category"
- Enter: `Appetizers`, `Main Course`, `Desserts`, `Drinks`
- Save each one
- ✅ Categories added!

### 4. Add Dishes
- Click "Add Dish"
- Fill in:
  - Name: `Butter Chicken`
  - Description: `Creamy tomato-based curry with tender chicken`
  - Price: `₹250`
  - Spice Level: `2`
  - Upload image (drag & drop)
  - Select category: `Main Course`
- Save
- ✅ Dish added!

### 5. Generate QR Code
- Go to your restaurant page
- Click "Generate QR Code" tab
- Download QR code image
- ✅ QR code ready!

### 6. Share Menu
- Copy the shareable link from QR page
- Open in new tab (simulate customer)
- ✅ Customer sees beautiful menu!

---

## 🔧 Commands Reference

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm run lint

# Reset database (delete all data)
npx prisma migrate reset

# View database in UI
npx prisma studio

# Check Prisma schema
npx prisma validate

# Generate Prisma client
npx prisma generate
\`\`\`

---

## 📧 Email Verification Status

### Current Setup
- ✅ **API Key**: Active (re_S9VHrrJx_GW6MfvNPd8tnapgFehKVWpGs)
- ✅ **Sender Email**: onboarding@resend.dev (development)
- ✅ **Service**: Resend (live)

### Before Going to Production

1. **Verify Your Email** in Resend:
   - Go to https://resend.com/emails
   - Add: `devendrakkumar.dev@gmail.com`
   - Confirm verification email
   - Update FROM_EMAIL in `lib/email.ts`

2. **Set Up Custom Domain** (recommended):
   - Add your domain in Resend
   - Use: `noreply@yourdomain.com` as sender

---

## 🚀 Deploy to Vercel

\`\`\`bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Select your GitHub repo
# 4. Add environment variables:
#    - DATABASE_URL
#    - RESEND_API_KEY
#    - NEXT_PUBLIC_APP_URL
# 5. Click Deploy!
\`\`\`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find .env.local" | Create it in project root (same level as package.json) |
| Email not received | Check spam folder, verify sender email in Resend |
| Database connection error | Check DATABASE_URL matches your Neon connection string |
| RESEND_API_KEY undefined | Restart dev server after adding .env.local |
| Verification code expired | Generate new code (10-minute expiry) |
| Page not loading | Clear browser cache, restart dev server |

---

## 📱 Account Credentials

**Test Account:**
- Email: `devendrakkumar.dev@gmail.com`
- Password: N/A (email verification only)
- Type: Restaurant Owner

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. ✅ Test full registration & menu flow
3. ✅ Create sample restaurant with menu items
4. ✅ Generate QR code and test customer view
5. 🚀 Deploy to Vercel when ready

---

## 📚 Full Documentation

For detailed setup, see `README.md` and `SETUP_GUIDE.md`

For API documentation, see `API_DOCS.md`

---

**Last Updated**: November 2024
