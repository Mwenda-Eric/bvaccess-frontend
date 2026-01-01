# BV Access - NextJS Admin Dashboard Development Prompt

## Project Overview

Build a complete **NextJS 14+** admin dashboard for the **BV Access** WiFi voucher management system. This dashboard will:
1. Provide a secure admin login portal
2. Display real-time metrics and analytics from the .NET backend API
3. Allow management of vouchers, operators, locations, and settings
4. Generate and export reports
5. Provide a beautiful, responsive, and intuitive user interface

The system is deployed in **Haiti** and uses **HTG (Haitian Gourde)** as the currency. The dashboard should support both **English** and **French** (Haiti's official languages).

---

## Technology Stack Requirements

- **NextJS 14+** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query (React Query)** for data fetching and caching
- **Recharts** or **Chart.js** for data visualization
- **NextAuth.js** for authentication
- **React Hook Form** + **Zod** for form handling
- **date-fns** for date manipulation
- **Lucide React** for icons
- **next-themes** for dark/light mode
- **next-intl** or **i18next** for internationalization (EN/FR)

---

## API Integration

### Base Configuration
```typescript
// Environment variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### API Client Setup
Create a centralized API client using Axios or Fetch with:
- Base URL configuration
- Automatic token attachment via interceptors
- Token refresh handling
- Error response transformation
- Request/response logging (development)

### Authentication Flow
1. Admin enters email/password on login page
2. Frontend calls POST /api/auth/admin/login
3. Store access token in memory, refresh token in httpOnly cookie
4. Use NextAuth.js session management
5. Automatic token refresh before expiry
6. Redirect to login on 401 responses

---

## Application Structure

```
bvaccess-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard shell with sidebar
│   │   ├── page.tsx                # Main dashboard/overview
│   │   ├── vouchers/
│   │   │   ├── page.tsx            # Vouchers list
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Voucher details
│   │   ├── reports/
│   │   │   ├── page.tsx            # Reports overview
│   │   │   ├── daily/
│   │   │   │   └── page.tsx
│   │   │   ├── period/
│   │   │   │   └── page.tsx
│   │   │   └── export/
│   │   │       └── page.tsx
│   │   ├── operators/
│   │   │   ├── page.tsx            # Operators list
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Operator details/edit
│   │   ├── locations/
│   │   │   └── page.tsx            # Locations management
│   │   ├── admins/
│   │   │   └── page.tsx            # Admin users (SuperAdmin only)
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── pricing/
│   │       │   └── page.tsx
│   │       └── profile/
│   │           └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileNav.tsx
│   │   └── UserMenu.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── SalesByLocationChart.tsx
│   │   ├── SalesByDurationChart.tsx
│   │   ├── PaymentMethodsChart.tsx
│   │   ├── TopOperatorsTable.tsx
│   │   ├── RecentVouchersTable.tsx
│   │   └── HourlyHeatmap.tsx
│   ├── vouchers/
│   │   ├── VouchersTable.tsx
│   │   ├── VoucherFilters.tsx
│   │   ├── VoucherDetails.tsx
│   │   ├── VoidVoucherDialog.tsx
│   │   └── ExportDialog.tsx
│   ├── operators/
│   │   ├── OperatorsTable.tsx
│   │   ├── OperatorForm.tsx
│   │   └── OperatorStats.tsx
│   ├── locations/
│   │   ├── LocationsTable.tsx
│   │   ├── LocationForm.tsx
│   │   └── LocationStats.tsx
│   ├── reports/
│   │   ├── DateRangePicker.tsx
│   │   ├── ReportFilters.tsx
│   │   ├── ReportTable.tsx
│   │   └── ReportCharts.tsx
│   └── common/
│       ├── DataTable.tsx
│       ├── Pagination.tsx
│       ├── SearchInput.tsx
│       ├── StatusBadge.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── ConfirmDialog.tsx
│       └── CurrencyDisplay.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   ├── useVouchers.ts
│   ├── useOperators.ts
│   ├── useLocations.ts
│   ├── useReports.ts
│   └── useDebounce.ts
├── lib/
│   ├── api/
│   │   ├── client.ts               # API client setup
│   │   ├── auth.ts                 # Auth API calls
│   │   ├── vouchers.ts             # Voucher API calls
│   │   ├── dashboard.ts            # Dashboard API calls
│   │   ├── reports.ts              # Reports API calls
│   │   ├── operators.ts            # Operators API calls
│   │   └── locations.ts            # Locations API calls
│   ├── auth.ts                     # NextAuth configuration
│   ├── utils.ts                    # Utility functions
│   ├── constants.ts                # App constants
│   └── validations/
│       ├── auth.ts
│       ├── voucher.ts
│       └── operator.ts
├── types/
│   ├── api.ts                      # API response types
│   ├── auth.ts
│   ├── voucher.ts
│   ├── operator.ts
│   ├── location.ts
│   ├── dashboard.ts
│   └── report.ts
├── providers/
│   ├── QueryProvider.tsx
│   ├── ThemeProvider.tsx
│   └── AuthProvider.tsx
├── stores/                         # Zustand stores (if needed)
│   └── useFilterStore.ts
├── i18n/
│   ├── en.json
│   └── fr.json
└── public/
    ├── logo.svg
    └── favicon.ico
```

---

## Page Specifications

### 1. Login Page (/login)

**Design:**
- Centered card layout
- Company logo at top
- Email and password fields
- "Remember me" checkbox
- "Forgot password?" link
- Login button with loading state
- Error message display
- Language switcher (EN/FR)
- Dark/light mode toggle

**Functionality:**
- Form validation with Zod
- Submit to NextAuth signIn
- Redirect to dashboard on success
- Display API error messages
- Rate limiting feedback

**Visual Style:**
- Gradient background matching BV Access brand colors
- Clean, modern card design
- Subtle animations on interactions

---

### 2. Dashboard Overview (/)

**Layout:**
- Full-width header with greeting and date
- 4-column stat cards row
- 2-column layout for main charts
- Recent activity section

**Stat Cards (Top Row):**
1. **Today's Revenue**
   - Large HTG amount
   - Percentage change from yesterday (green/red arrow)
   - Sparkline mini-chart

2. **Today's Sales**
   - Number of vouchers sold
   - Percentage change from yesterday
   - Sparkline mini-chart

3. **Active Operators**
   - Number currently online/active today
   - Total operators count

4. **Weekly Revenue**
   - HTG amount for current week
   - Percentage change from last week

**Main Charts Section:**

**Revenue Chart (Left - 60% width):**
- Line/Area chart showing revenue over time
- Toggle: 7 days / 30 days / 90 days / 12 months
- Hover tooltips with exact values
- Compare with previous period option

**Sales by Location (Right - 40% width):**
- Horizontal bar chart
- Show top 5 locations
- HTG amounts and percentages

**Secondary Charts Row:**

**Sales by Duration (Pie/Donut):**
- Show distribution: 30min, 1hr, 2hrs, 24hrs, Custom
- Percentage labels
- Legend

**Payment Methods (Pie/Donut):**
- Cash vs E-Wallet distribution
- Percentage labels

**Hourly Distribution (Heatmap):**
- 7x24 grid (days x hours)
- Color intensity based on sales volume
- Useful for identifying peak times

**Bottom Section:**

**Recent Vouchers Table:**
- Last 10 vouchers created
- Columns: Code, Location, Duration, Price, Operator, Time
- Quick actions: View, Void
- "View All" link

**Top Operators This Week:**
- Leaderboard style
- Rank, Name, Sales Count, Revenue
- Mini progress bars

---

### 3. Vouchers Page (/vouchers)

**Header:**
- Page title with total count
- Export button (CSV, Excel)
- Search input

**Filters Bar:**
- Location dropdown (multi-select)
- Operator dropdown (multi-select)
- Status: All, Active, Voided, Expired
- Payment Method: All, Cash, E-Wallet
- Date range picker
- Duration filter
- Clear filters button

**Data Table:**
- Columns:
  - Checkbox (for bulk actions)
  - Code (monospace font, clickable)
  - Location
  - Duration
  - Bandwidth
  - Payment Method
  - Price (HTG)
  - Status (badge)
  - Operator
  - Created At
  - Actions (View, Void)
- Sortable columns
- Row hover effects
- Status color coding

**Pagination:**
- Page size selector (10, 20, 50, 100)
- Page navigation
- "Showing X to Y of Z results"

**Voucher Details Modal/Page:**
- All voucher information
- QR code display
- Operator info
- Timeline (created, voided if applicable)
- Void action with confirmation

---

### 4. Reports Page (/reports)

**Report Types:**

**Daily Report:**
- Date picker
- Summary cards (total sales, revenue, voids)
- Hourly breakdown chart
- By location breakdown
- By operator breakdown
- Exportable

**Period Report:**
- Date range picker
- Daily trend chart
- Comparison with previous period
- Aggregated statistics
- Breakdown tables

**Export Options:**
- PDF with charts
- Excel with raw data
- CSV
- Email scheduling

---

### 5. Operators Page (/operators)

**List View:**
- Table with: Name, Username, Email, Location, Status, Last Active, Sales Today
- Search by name/email
- Filter by location, status
- Actions: Edit, Activate/Deactivate, Reset Password

**Create/Edit Form:**
- Full name
- Username
- Email
- Phone number
- Default location (dropdown)
- Status toggle
- Password (create) / Reset password button (edit)

**Operator Detail Page:**
- Profile information
- Performance stats
- Sales chart (last 30 days)
- Recent vouchers list
- Activity log

---

### 6. Locations Page (/locations)

**List View:**
- Cards or table layout
- Each location shows:
  - Name and code
  - Today's sales/revenue
  - Total sales/revenue
  - Active status
  - Number of operators assigned

**Create/Edit Modal:**
- Name
- Code (auto-generated option)
- Description
- Address
- Status toggle

**Location Stats (expandable or separate view):**
- Revenue chart for this location
- Top operators at this location
- Peak hours

---

### 7. Admin Users Page (/admins) - SuperAdmin Only

**List View:**
- Name, Email, Role, Status, Last Login
- Actions: Edit, Deactivate, Delete

**Create/Edit Form:**
- Full name
- Email
- Role (Admin, Viewer)
- Status

---

### 8. Settings Page (/settings)

**Sections:**

**Pricing Configuration:**
- Edit pricing tiers
- Set custom price per minute
- Preview price changes

**General Settings:**
- Company name
- Default language
- Timezone
- Currency display format

**Profile Settings:**
- Change password
- Update email
- Two-factor authentication (future)

**System Information:**
- API status
- Last sync time
- Version info

---

## Component Specifications

### Sidebar Component
```
- Logo (links to dashboard)
- Navigation items:
  - Dashboard (Home icon)
  - Vouchers (Ticket icon)
  - Reports (BarChart icon)
  - Operators (Users icon)
  - Locations (MapPin icon)
  - Admins (Shield icon) - SuperAdmin only
  - Settings (Settings icon)
- Collapsible on desktop
- Full overlay on mobile
- Active state highlighting
- Hover effects
```

### Header Component
```
- Breadcrumbs
- Search bar (global search)
- Notification bell (future)
- Theme toggle (sun/moon)
- Language switcher (EN/FR)
- User menu dropdown:
  - Profile link
  - Settings link
  - Logout
```

### StatCard Component
```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  chart?: React.ReactNode; // Sparkline
  loading?: boolean;
}
```

### DataTable Component
```tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (column: string, order: 'asc' | 'desc') => void;
  };
  selection?: {
    selected: string[];
    onSelectionChange: (ids: string[]) => void;
  };
  emptyState?: React.ReactNode;
}
```

### CurrencyDisplay Component
```tsx
interface CurrencyDisplayProps {
  amount: number;
  currency?: string; // Default: 'HTG'
  size?: 'sm' | 'md' | 'lg';
  showSymbol?: boolean;
  className?: string;
}

// Usage: <CurrencyDisplay amount={1500} /> → "1,500.00 HTG"
```

### StatusBadge Component
```tsx
interface StatusBadgeProps {
  status: 'active' | 'void' | 'expired' | 'pending';
  size?: 'sm' | 'md';
}

// Colors:
// active: green
// void: red
// expired: gray
// pending: yellow
```

---

## TypeScript Interfaces

### API Response Types
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  traceId?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}
```

### Domain Types
```typescript
interface Voucher {
  id: string;
  code: string;
  durationMinutes: number;
  bandwidth: 'Unlimited' | 'Limited';
  paymentMethod: 'Cash' | 'EWallet';
  price: number;
  buyerInfo?: string;
  location: Location;
  createdBy: User;
  createdAt: string;
  expiresAt: string;
  isVoid: boolean;
  voidedAt?: string;
  voidedBy?: User;
  voidReason?: string;
}

interface Location {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  isActive: boolean;
}

interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  defaultLocation?: Location;
  isActive: boolean;
  lastLoginAt?: string;
}

interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: 'SuperAdmin' | 'Admin' | 'Viewer';
  isActive: boolean;
  lastLoginAt?: string;
}

interface DashboardSummary {
  today: PeriodStats;
  yesterday: PeriodStats;
  thisWeek: PeriodStats;
  thisMonth: PeriodStats;
  percentageChanges: {
    salesToday: number;
    revenueToday: number;
    salesWeek: number;
    revenueWeek: number;
  };
}

interface PeriodStats {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  voidedCount?: number;
  voidedAmount?: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }>;
}
```

---

## Styling Guidelines

### Color Palette (Tailwind Config)
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  // Haitian flag colors for accents
  haiti: {
    blue: '#00209F',
    red: '#D21034',
  }
}
```

### Dark Mode
- Use Tailwind's dark: prefix
- Persist preference in localStorage
- Smooth transitions between modes

### Typography
- Font: Inter (or system-ui fallback)
- Monospace for codes: JetBrains Mono or Fira Code

### Spacing & Layout
- Consistent padding: 16px (sm), 24px (md), 32px (lg)
- Card border radius: 8px
- Shadow for elevation
- Max content width: 1440px

---

## Data Fetching Patterns

### React Query Setup
```typescript
// hooks/useVouchers.ts
export function useVouchers(params: VoucherFilters) {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => vouchersApi.getList(params),
    staleTime: 1000 * 60, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function useVoidVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      vouchersApi.void(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Voucher voided successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
```

### Dashboard Data
```typescript
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    refetchInterval: 1000 * 60, // Refresh every minute
  });
}

export function useRevenueChart(period: string) {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: () => dashboardApi.getRevenueChart(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

---

## Authentication Implementation

### NextAuth Configuration
```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await authApi.login({
          email: credentials?.email!,
          password: credentials?.password!,
        });

        if (response.success && response.data) {
          return {
            id: response.data.admin.id,
            email: response.data.admin.email,
            name: response.data.admin.fullName,
            role: response.data.admin.role,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
```

### Protected Routes
```typescript
// middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Role-Based Access
```typescript
// components/common/RoleGuard.tsx
export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session || !allowedRoles.includes(session.user.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
```

---

## Internationalization (i18n)

### Setup
- Default: English
- Available: English, French
- Language selector in header
- Persist in localStorage
- Format dates/numbers based on locale

### Translation Keys Structure
```json
// en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading...",
    "noResults": "No results found"
  },
  "dashboard": {
    "title": "Dashboard",
    "todayRevenue": "Today's Revenue",
    "todaySales": "Today's Sales",
    "weeklyRevenue": "Weekly Revenue"
  },
  "vouchers": {
    "title": "Vouchers",
    "code": "Code",
    "duration": "Duration",
    "status": {
      "active": "Active",
      "void": "Voided",
      "expired": "Expired"
    },
    "void": {
      "title": "Void Voucher",
      "confirm": "Are you sure you want to void this voucher?",
      "reason": "Reason for voiding"
    }
  }
}
```

---

## Error Handling

### Global Error Boundary
- Catch unexpected errors
- Show friendly error message
- Option to retry or go home
- Log errors to monitoring service

### API Error Handling
- Toast notifications for user-facing errors
- Form field errors displayed inline
- Network errors with retry option
- Session expired → redirect to login

### Loading States
- Skeleton loaders for tables
- Spinner for buttons
- Progress indicators for exports

---

## Performance Optimization

1. **Code Splitting**
   - Dynamic imports for heavy components (charts)
   - Route-based splitting (automatic with App Router)

2. **Data Caching**
   - React Query caching strategy
   - Stale-while-revalidate pattern

3. **Image Optimization**
   - Next.js Image component
   - SVG for icons

4. **Bundle Size**
   - Analyze with @next/bundle-analyzer
   - Tree-shake unused components

---

## Accessibility (a11y)

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus management
- Color contrast compliance
- Screen reader support

---

## Testing (Optional but Recommended)

1. **Unit Tests (Vitest/Jest)**
   - Utility functions
   - Custom hooks

2. **Component Tests (Testing Library)**
   - Critical components
   - Form validations

3. **E2E Tests (Playwright)**
   - Login flow
   - Critical user journeys

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=BV Access Dashboard
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Server-only
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
```

---

## Deployment Considerations

- Docker support
- Environment-based configuration
- Build optimization
- Static asset caching
- Health check endpoint

---

## First Steps

1. Initialize project with shadcn/ui setup
2. Configure Tailwind with custom colors
3. Set up NextAuth authentication
4. Create API client and hooks
5. Build layout components (Sidebar, Header)
6. Implement login page
7. Build dashboard page with charts
8. Implement vouchers list with filters
9. Add remaining pages
10. Implement i18n
11. Add dark mode
12. Testing and optimization

---

## Design Inspiration

- Clean, modern admin dashboard aesthetic
- Similar to: Vercel Dashboard, Linear, Stripe Dashboard
- Focus on data visualization clarity
- Ample white space
- Consistent component styling
- Smooth micro-interactions

---

## Important Notes

- All monetary values should display with 2 decimal places and "HTG" suffix
- Dates should respect user's locale (DD/MM/YYYY for FR, MM/DD/YYYY for EN)
- Times in 24-hour format
- Numbers use locale-appropriate separators (1,234.56 or 1 234,56)
- Mobile-responsive design is essential
- Offline support is NOT required (always connected dashboard)

Begin implementation with a clean, well-organized codebase following React/NextJS best practices and modern patterns.
