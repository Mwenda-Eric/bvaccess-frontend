// Application Constants

export const APP_NAME = 'BV Access';
export const APP_DESCRIPTION = 'WiFi Voucher Management System';

// Currency
export const CURRENCY = {
  code: 'HTG',
  symbol: 'G',
  name: 'Haitian Gourde',
  locale: 'fr-HT',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = {
  display: 'dd/MM/yyyy',
  displayWithTime: 'dd/MM/yyyy HH:mm',
  api: 'yyyy-MM-dd',
  time: 'HH:mm',
  full: 'EEEE, dd MMMM yyyy',
};

// Chart colors - use var() directly since CSS variables are hex values
export const CHART_COLORS = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  quinary: 'var(--chart-5)',
};

// Status colors
export const STATUS_COLORS = {
  active: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  void: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  expired: {
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
  },
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
};

// Duration options (in minutes)
export const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 1440, label: '24 hours' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'EWallet', label: 'E-Wallet' },
];

// Admin roles
export const ADMIN_ROLES = [
  { value: 'SuperAdmin', label: 'Super Admin' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Viewer', label: 'Viewer' },
];

// Chart periods
export const CHART_PERIODS = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '12m', label: '12 Months' },
];

// Export formats
export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
];

// Sidebar navigation items
export const NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'LayoutDashboard',
    roles: ['SuperAdmin', 'Admin', 'Viewer'],
  },
  {
    title: 'Vouchers',
    href: '/vouchers',
    icon: 'Ticket',
    roles: ['SuperAdmin', 'Admin', 'Viewer'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: 'BarChart3',
    roles: ['SuperAdmin', 'Admin', 'Viewer'],
  },
  {
    title: 'Operators',
    href: '/operators',
    icon: 'Users',
    roles: ['SuperAdmin', 'Admin'],
  },
  {
    title: 'Locations',
    href: '/locations',
    icon: 'MapPin',
    roles: ['SuperAdmin', 'Admin'],
  },
  {
    title: 'Admins',
    href: '/admins',
    icon: 'Shield',
    roles: ['SuperAdmin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'Settings',
    roles: ['SuperAdmin', 'Admin'],
  },
];

// Days of the week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DAYS_OF_WEEK_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
