# DigiMenu - Digital Restaurant Menu Management System

A comprehensive web application for restaurants to manage their menus digitally and share them with customers via QR codes or shared links.

## Live Deployment

- **Vercel URL**: https://digital-menu-application.vercel.app/
- **Repository**: https://github.com/shivam-shukla-25/digital-menu-application

## Project Overview

DigiMenu is a full-stack restaurant menu management system that solves the problem of digital menu distribution. Restaurant owners can:
- Create and manage multiple restaurants
- Organize dishes into categories
- Add images, descriptions, prices, and spice levels to dishes
- Generate QR codes for easy customer access
- Share menus via direct links

Customers can:
- View restaurant menus with high-quality images and descriptions
- Navigate smoothly between categories
- Access menus from any device without installation

## Approach to Solving the Problem

### Architecture Decision
- **Frontend-First Design**: Built responsive customer menu interface first to match UI requirements
- **Role-Based Separation**: Clear admin dashboard for restaurant management, public menu viewer for customers
- **Email-Based Auth**: Implemented verification code system with Resend for real email delivery

### Key Implementation Details
1. **Database Schema**: Normalized design with User → Restaurant → Category → Dish relationships, supporting many-to-many category assignments
2. **Authentication Flow**: Email verification with 6-digit codes sent via Resend, session management via HTTP-only cookies
3. **Email Service**: Integrated Resend for transactional emails with beautiful HTML templates
4. **Menu Viewer**: Sticky headers with floating category navigation for seamless browsing
5. **QR Generation**: Used QR Server API for instant QR code generation without backend processing

### Scalability Considerations
- Database indexes on foreign keys for fast queries
- Singleton Prisma client pattern to prevent connection pooling issues
- Session-based auth to avoid token refresh complexity
- Email service integration for production-ready verification

## Technology Stack

### IDE & Development Environment
- **IDE**: VS Code with Next.js Extension Pack
- **Runtime**: Node.js 18+ with Next.js 16 (App Router)
- **Package Manager**: npm

### Core Technologies
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma
- **Email Service**: Resend (transactional emails)
- **Hosting**: Vercel

### Dependencies
```
next@^16.0.0
react@^19.0.0
prisma@^7.0.0
@prisma/client@^7.0.0
resend@^6.5.0
shadcn/ui (shadcn CLI installed)
tailwindcss@^4.0.0
typescript@^5.0.0
```

## AI Tools & Models Used

### Claude 3.5 Sonnet (v0)
- **Purpose**: Code generation, architecture planning, component design, email integration
- **Prompts Used**:
  1. "Create a digital menu management system with Prisma schema for restaurants"
  2. "Build an admin dashboard with restaurant and menu management"
  3. "Implement a customer menu viewer with sticky headers and floating navigation"
  4. "Add edit/delete functionality with proper authorization checks"
  5. "Integrate Resend email service for email verification"
  6. "Generate comprehensive documentation for deployment"

### AI Tool Effectiveness & Corrections

**What Worked Well:**
- Rapid scaffolding of database schema and relationships
- Consistent UI patterns across components using shadcn/ui
- Proper error handling and validation patterns
- Authentication flow with email verification
- Resend integration with HTML email templates

**Mistakes Identified & Corrected:**
1. **Initial Issue**: AI suggested NextAuth - Had to remove and implement custom email verification
2. **Cookie Handling**: AI used synchronous cookie access - Fixed to use `await cookies()` for Next.js 16
3. **Image Handling**: AI suggested Base64 encoding - Maintained for MVP, noted for future Blob storage
4. **Spice Level UI**: Initial simple text - Enhanced with visual indicator dots
5. **API Route Authorization**: Duplicate checks - Consolidated into middleware and route handlers
6. **File Writing**: Initially wrote files without reading existing content - Fixed to always read before write
7. **Email Implementation**: Initial placeholder - Replaced with full Resend integration with API key configuration

### Email Flow
```
User Registration/Login
    ↓
Generate 6-digit verification code + 10-minute expiry
    ↓
Call sendVerificationEmail() from lib/email.ts
    ↓
Nodemailer sends formatted email with code
    ↓
User receives email in inbox
    ↓
User enters code in app to verify
    ↓
Account verified → Session created → Access granted
```

### Features
- Beautiful HTML email templates with branding
- 10-minute code expiration
- Error handling for failed sends
- Console logging for debugging
- Production-ready configuration

## Edge Cases & Error Scenarios Handled

### Authentication
- Email already exists validation
- Verification code expiration (10 minutes)
- Invalid or expired codes
- Concurrent login attempts
- Session timeout handling
- Email delivery failures with fallback messaging

### Menu Management
- Dishes with no categories (still accessible)
- Categories with no dishes (displayed as empty)
- Duplicate category names allowed per restaurant (different restaurants)
- Price validation (non-negative floats)
- Spice level bounds (0-5)
- Image upload size (handled by browser)

### Customer Access
- Restaurant not found (404 error)
- Empty menu handling (shows message)
- Browser back button after deletion
- QR code generation failure (shows original link)
- Slow network scenarios (loading states)

### Authorization
- Users cannot access other users' restaurants
- Users cannot create dishes for unauthorized restaurants
- Middleware prevents direct access to protected routes
- API routes verify user ownership

### Data Consistency
- Cascade delete for restaurant → categories/dishes
- Orphaned dish-category relationships prevented
- Transaction-like behavior for category assignments

### Email Service
- API key validation on initialization
- Graceful fallback if email service unavailable
- Detailed error logging for troubleshooting
- Request/verification code rate-limiting ready (future)

## Edge Cases Unable to Handle Due to Time Constraints

### Image Storage & Optimization
- **Issue**: Images stored as Base64 in database
- **Limitation**: Database bloat for many high-res images
- **Solution Approach**: Integrate Vercel Blob or AWS S3 for production
- **Better Implementation**:
```javascript
// Would replace Base64 approach
const blob = await fetch(formData).then(r => r.blob());
const url = await put(`menu-images/${dishId}`, blob);
```

### Rate Limiting & Abuse Prevention
- **Issue**: No rate limiting on API endpoints
- **Risk**: Potential abuse of verification code endpoint
- **Solution Approach**: Implement with next-rate-limit or Upstash Redis
- **Production Approach**:
```typescript
// Add to API routes
import { Ratelimit } from "@upstash/ratelimit";
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});
```

### Multi-Language Support
- **Issue**: Menu descriptions are English-only
- **Opportunity**: Support i18n for international restaurants
- **Solution Approach**: Use next-intl or i18next
- **Benefit**: Customers could select language for menu

### Real-Time Updates
- **Issue**: Menu changes require refresh
- **Solution Approach**: Implement WebSocket with Socket.io or Server-Sent Events
- **Use Case**: Live price updates when multiple customers viewing menu

### Analytics & Insights
- **Issue**: No tracking of QR code scans or customer behavior
- **Solution Approach**: Add Vercel Analytics and custom event tracking
- **Metrics**: QR scans, popular items, category views

### Mobile App
- **Issue**: Web-only solution
- **Opportunity**: Native iOS/Android apps for better UX
- **Approach**: React Native with shared API

### Search & Filtering
- **Issue**: No search functionality for dishes
- **Optimization**: Add full-text search and filters (vegetarian, price range, etc.)

### Admin Analytics Dashboard
- **Issue**: No metrics on restaurant performance
- **Data Points**: Most viewed items, peak times, QR scan trends

## Performance Optimizations Applied

1. **Image Optimization**: Using Next.js Image component with lazy loading
2. **Database Queries**: Strategic inclusion of relations to minimize N+1 queries
3. **CSS**: Tailwind CSS with tree-shaking for minimal bundle
4. **API Caching**: Could add with `revalidatePath()` in Server Actions
5. **Email Service**: Asynchronous email sending to avoid blocking requests

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL (via Neon)
- npm or yarn
- Resend account (for email service)

### Setup Steps
```bash
# 1. Clone repository
git clone [repository-url]
cd digimenu

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Create .env.local file with:
DATABASE_URL="postgresql://user:password@host/database"
RESEND_API_KEY="re_your_api_key_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 4. Setup database
npx prisma migrate deploy
npx prisma generate

# 5. Run development server
npm run dev

# 6. Access application
# Navigate to http://localhost:3000
```

### Email Verification Testing
- Use your verified email in Resend dashboard
- Codes sent to inbox within 30 seconds
- Check spam folder if not received
- Console logs show email service calls for debugging

## Testing Account

For demo purposes:
- **Email**: devendrakkumar.dev@gmail.com (verified in Resend)
- **Verification Code**: Check your email inbox
- **Restaurant**: Create one after login

## Project Structure

```
digimenu/
├── app/
│   ├── api/              # API routes for backend logic
│   │   └── auth/         # Auth endpoints with Resend integration
│   ├── auth/             # Authentication pages (login, register)
│   ├── dashboard/        # Restaurant admin dashboard
│   ├── menu/             # Customer menu viewer
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   └── dashboard-layout.tsx
├── lib/
│   ├── auth.ts           # Session management
│   ├── db.ts             # Prisma client singleton
│   ├── email.ts          # Resend email service
│   └── utils.ts          # shadcn utilities
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── README.md             # This file
```

## Key Features Implemented

✅ User registration with email verification via Resend
✅ Login with email verification code
✅ Restaurant management (create, view multiple)
✅ Category management within restaurants
✅ Dish management with images and metadata
✅ Multi-category dish assignment
✅ Customer menu viewer with smooth scrolling
✅ Sticky category headers
✅ Floating navigation menu
✅ QR code generation and download
✅ Shareable menu links
✅ Edit and delete functionality
✅ Authorization and access control
✅ Responsive design for mobile and desktop
✅ TypeScript for type safety
✅ Database migrations ready for deployment
✅ Production-ready email service integration

## Deployment to Vercel

### Steps
1. Push code to GitHub repository
2. Connect repository to Vercel project
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `AUTH_EMAIL`: GMAIL EMAIL
   - `AUTH_PASSWORD`: GMAIL PASSWORD
4. Deploy - Vercel will automatically run migrations

### Database Connection Issues
```
Error: connect ECONNREFUSED
→ Verify Neon connection string in .env.local
→ Check network access is enabled in Neon dashboard
```

### Prisma Migration Issues
```
Error: Engine failed to start
→ Run: npx prisma generate
→ Run: npx prisma migrate deploy
```

### API Key Configuration
```
Error: RESEND_API_KEY is undefined
→ Create .env.local file in project root
→ Add `DATABASE_URL`, `AUTH_EMAIL` and `AUTH_PASSWORD` in .env
→ Restart development server after adding .env.local
```

## Code Quality & Standards

- **TypeScript**: Strict mode enabled for type safety
- **Prettier**: Code formatting enforced
- **ESLint**: Linting rules for consistency
- **Component Architecture**: Small, reusable, well-named components
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **API Documentation**: Clear parameter and response types
- **Database Design**: Normalized schema with proper relationships
- **Email Templates**: HTML formatted with proper styling