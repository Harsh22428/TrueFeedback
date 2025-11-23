
# TrueFeedback - AI Assistant Guide

## Project Overview

TrueFeedback is an anonymous social messaging platform built with Next.js 15. It allows users to receive anonymous messages similar to platforms like Qooh.me. Users can control whether they accept messages, view their received messages in a dashboard, and manage their feedback.

### Key Features
- User authentication with NextAuth.js (email/username + password)
- Email verification system with verification codes
- Anonymous message sending/receiving
- Toggle to accept/reject incoming messages
- Dashboard for message management
- AI-powered message suggestions using OpenAI
- Real-time UI updates with React 19

---

## Tech Stack

### Core Framework
- **Next.js 15.4.6** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type safety

### Authentication & Authorization
- **NextAuth.js 4.24.11** - Authentication framework
- **bcryptjs** - Password hashing
- JWT-based session strategy

### Database & ODM
- **MongoDB** - NoSQL database
- **Mongoose 8.14.1** - MongoDB object modeling

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **Lucide React** - Icon library
- **next-themes** - Dark mode support
- **Framer Motion** - Animations

### Forms & Validation
- **React Hook Form 7.62.0** - Form state management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers** - Form validation integration

### AI & Email
- **@ai-sdk/openai** - OpenAI integration
- **ai** - Vercel AI SDK
- **Resend** - Email delivery service
- **@react-email/components** - Email templates

### Other Libraries
- **axios** - HTTP client
- **dayjs** - Date manipulation
- **embla-carousel-react** - Carousel component
- **sonner** - Toast notifications
- **usehooks-ts** - Custom React hooks

---

## Codebase Structure

```
TrueFeedback/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (app)/              # Authenticated app routes
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── page.tsx        # Home page
│   │   │   └── layout.tsx      # App layout
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── verify/[username]/
│   │   ├── api/                # API routes
│   │   │   ├── accept-messages/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── check-username-unique/
│   │   │   ├── delete-message/[messageid]/
│   │   │   ├── get-messages/
│   │   │   ├── send-message/
│   │   │   ├── sign-up/
│   │   │   ├── suggest-messages/
│   │   │   └── verify-code/
│   │   ├── u/[username]/       # Public user profile
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── navbar.tsx
│   │   └── messageCard.tsx
│   ├── context/                # React Context providers
│   │   └── AuthProvider.tsx
│   ├── helpers/                # Utility functions
│   │   └── sendVerificationEmail.ts
│   ├── lib/                    # Library configurations
│   │   ├── dbConnect.ts        # MongoDB connection
│   │   ├── dbname.ts           # Database name constant
│   │   ├── resend.ts           # Email service config
│   │   └── utils.ts            # Utility functions
│   ├── model/                  # Mongoose models
│   │   └── user.ts             # User & Message models
│   ├── schemas/                # Zod validation schemas
│   │   ├── acceptMessageSchema.ts
│   │   ├── messageSchema.ts
│   │   ├── signInSchema.ts
│   │   ├── signUpSchema.ts
│   │   └── verifySchema.ts
│   └── middleware.ts           # Next.js middleware (auth)
├── types/                      # TypeScript type definitions
│   ├── ApiResponse.ts
│   └── next-auth.d.ts
├── emails/                     # Email templates
├── public/                     # Static assets
└── [config files]
```

---

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `MessageCard.tsx`)
- **Pages**: lowercase with hyphens (e.g., `sign-in/page.tsx`)
- **Utilities/Helpers**: camelCase (e.g., `sendVerificationEmail.ts`)
- **Types/Schemas**: camelCase with descriptive names (e.g., `signUpSchema.ts`)

### Code Style
- **TypeScript**: Strict mode enabled
- **Imports**: Use `@/` alias for src directory
- **Components**: Functional components with TypeScript
- **Client Components**: Explicitly marked with `"use client"`
- **API Routes**: Export named functions (GET, POST, etc.)

### Database Patterns
- **Connection**: Singleton pattern with connection caching in `dbConnect.ts`
- **Models**: Mongoose schemas with TypeScript interfaces
- **Model Export**: Use existing model or create new: `mongoose.models.User || mongoose.model<User>("User", UserSchema)`

---

## Authentication Flow

### NextAuth Configuration
Location: `src/app/api/auth/[...nextauth]/options.ts`

**Strategy**: JWT-based sessions
**Provider**: Credentials (email/username + password)

**Session Data Structure**:
```typescript
{
  user: {
    _id: string
    email: string
    username: string
    isVerified: boolean
    isAcceptingMessages: boolean
  }
}
```

### Middleware Protection
Location: `src/middleware.ts`

**Protected Routes**:
- `/dashboard/*` - Requires authentication

**Redirect Logic**:
- Authenticated users accessing `/`, `/sign-in`, `/sign-up`, `/verify` → redirected to `/dashboard`
- Unauthenticated users accessing `/dashboard` → redirected to `/sign-in`

---

## Database Schema

### User Model
Location: `src/model/user.ts`

```typescript
{
  username: string          // unique, 2-20 chars, alphanumeric + underscore
  email: string            // unique, valid email format
  password: string         // hashed with bcryptjs
  verifyCode: string       // 6-digit verification code
  verifyCodeExpiry: Date   // expiry timestamp
  isVerified: boolean      // default: false
  isAcceptingMessages: boolean  // default: true
  messages: Message[]      // embedded messages array
  createdAt: Date
}
```

### Message Schema (Embedded)
```typescript
{
  content: string
  createdAt: Date
}
```

### Database Connection
- MongoDB URI: `process.env.MONGODB_URI`
- Database name: Defined in `src/lib/dbname.ts`
- Connection caching: Prevents multiple connections in development

---

## API Routes

All API routes follow RESTful conventions and return consistent JSON responses.

### Standard Response Format
```typescript
{
  success: boolean
  message: string
  // additional fields based on endpoint
}
```

### Available Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/sign-up` | POST | User registration | No |
| `/api/verify-code` | POST | Verify email code | No |
| `/api/check-username-unique` | GET | Check username availability | No |
| `/api/send-message` | POST | Send anonymous message | No |
| `/api/auth/[...nextauth]` | * | NextAuth handlers | Varies |
| `/api/accept-messages` | POST | Toggle message acceptance | Yes |
| `/api/get-messages` | GET | Fetch user messages | Yes |
| `/api/delete-message/[messageid]` | DELETE | Delete specific message | Yes |
| `/api/suggest-messages` | POST | AI-generated message suggestions | Yes |

### AI Integration Pattern
Location: `src/app/api/suggest-messages/route.ts`

- **Runtime**: Edge runtime
- **Model**: OpenAI GPT-3.5-turbo-instruct
- **Response**: Streaming text via Vercel AI SDK
- **Error Handling**: Specific OpenAI API error handling

---

## Component Patterns

### UI Components
Location: `src/components/ui/`

All UI components are from **shadcn/ui** (Radix UI + Tailwind):
- `button.tsx` - Button variants
- `form.tsx` - Form controls
- `input.tsx` - Text inputs
- `card.tsx` - Card layouts
- `alert-dialog.tsx` - Modals
- `switch.tsx` - Toggle switches
- `separator.tsx` - Dividers
- `avatar.tsx` - User avatars
- `carousel.tsx` - Carousels
- `textarea.tsx` - Multi-line inputs
- `label.tsx` - Form labels
- `sonner.tsx` - Toast notifications

### Custom Components
- **Navbar** (`components/navbar.tsx`): Session-aware navigation with auth state
- **MessageCard** (`components/messageCard.tsx`): Individual message display with delete functionality

### Component Guidelines
1. **Use `"use client"`** for components with interactivity, hooks, or browser APIs
2. **Server Components** by default for static content and data fetching
3. **Styling**: Use Tailwind utility classes with `cn()` helper for conditional classes

---

## Form Validation

### Zod Schemas
Location: `src/schemas/`

All forms use Zod for validation with React Hook Form.

**Example Pattern**:
```typescript
// Schema definition
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string({message: 'Email is required'}),
  password: z.string().min(6, {message: 'password must be at least 6 characters'})
})

// Usage with React Hook Form
const form = useForm<z.infer<typeof signUpSchema>>({
  resolver: zodResolver(signUpSchema),
  defaultValues: { ... }
})
```

### Username Validation
- Min: 2 characters
- Max: 20 characters
- Pattern: `^[a-zA-Z0-9_]+$` (alphanumeric + underscore only)
- No special characters allowed

---

## Environment Variables

Required environment variables (add to `.env.local`):

```env
# Database
MONGODB_URI=mongodb://...

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=re_...

# OpenAI
OPENAI_API_KEY=sk-...
```

---

## Development Workflows

### Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Development Server
- URL: http://localhost:3000
- Hot reload enabled
- TypeScript checking in IDE

### Build Configuration
- Build command: `npm run build --no-lint`
- Linting disabled during build (handled separately)
- Output: `.next/` directory

---

## Common Patterns & Best Practices

### 1. Database Operations
Always call `dbConnect()` at the start of API routes:
```typescript
export async function POST(request: Request) {
  await dbConnect();
  // ... rest of handler
}
```

### 2. Error Handling in API Routes
Use try-catch with consistent response format:
```typescript
try {
  // operation
  return Response.json({ success: true, message: '...' }, { status: 200 })
} catch (error) {
  console.log("Error:", error)
  return Response.json({ success: false, message: 'Internal server Error' }, { status: 500 })
}
```

### 3. Password Hashing
Always hash passwords before storing:
```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);
// For verification:
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### 4. Session Access in Components
```typescript
"use client";
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
const user = session?.user;
```

### 5. Path Aliases
Use `@/` for all imports from src directory:
```typescript
import { UserModal } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { Button } from "@/components/ui/button";
```

### 6. Type Safety
- Always define TypeScript interfaces for data structures
- Use Zod schemas for runtime validation
- Extend NextAuth types in `types/next-auth.d.ts`

---

## AI Assistant Guidelines

### When Making Changes

1. **Read Before Modifying**
   - Always read files before editing
   - Understand existing patterns
   - Maintain consistency with codebase style

2. **Database Changes**
   - Update both Mongoose schema and TypeScript interface
   - Consider migration impacts on existing data
   - Test connection handling

3. **API Route Changes**
   - Follow existing response format
   - Include proper error handling
   - Call `dbConnect()` for database operations
   - Use appropriate HTTP status codes

4. **Component Updates**
   - Determine if `"use client"` directive is needed
   - Use existing UI components from `components/ui/`
   - Maintain responsive design patterns (mobile-first)

5. **Authentication Changes**
   - Update NextAuth options if session structure changes
   - Update middleware matcher for new protected routes
   - Sync changes with type definitions

### Common Tasks

#### Adding a New API Route
1. Create `route.ts` in appropriate directory under `src/app/api/`
2. Import `dbConnect` if database access needed
3. Export named function (GET, POST, PUT, DELETE)
4. Follow error handling pattern
5. Return consistent JSON response format

#### Adding a New Page
1. Create `page.tsx` in route group: `(app)` or `(auth)`
2. Determine if server or client component
3. Add to middleware matcher if protected
4. Import and use existing UI components

#### Modifying Database Schema
1. Update interface in `src/model/user.ts`
2. Update Mongoose schema
3. Consider backward compatibility
4. Update related API responses

#### Adding Form Validation
1. Create Zod schema in `src/schemas/`
2. Import in component
3. Use with React Hook Form + zodResolver
4. Add appropriate error messages

### Security Considerations

1. **Never commit sensitive data**
   - All `.env*` files are gitignored
   - Use environment variables for secrets

2. **Password Security**
   - Always use bcrypt for hashing
   - Never log or expose passwords

3. **Input Validation**
   - Validate all user inputs with Zod
   - Sanitize data before database operations
   - Check authentication on protected routes

4. **Error Messages**
   - Don't expose sensitive system information
   - Keep error messages user-friendly
   - Log detailed errors server-side only




---



### Commit Guidelines
- Clear, descriptive commit messages
- Reference issue numbers when applicable
- Group related changes together

---


