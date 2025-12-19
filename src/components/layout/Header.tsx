'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, Moon, Sun, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/common';
import { UserMenu } from './UserMenu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/vouchers': 'Vouchers',
  '/reports': 'Reports',
  '/reports/daily': 'Daily Report',
  '/reports/period': 'Period Report',
  '/operators': 'Operators',
  '/locations': 'Locations',
  '/admins': 'Admin Users',
  '/settings': 'Settings',
  '/settings/pricing': 'Pricing Settings',
  '/settings/profile': 'Profile Settings',
};

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Check for partial matches (for dynamic routes)
  const pathParts = pathname.split('/');
  if (pathParts[1] === 'vouchers' && pathParts[2]) {
    return 'Voucher Details';
  }
  if (pathParts[1] === 'operators' && pathParts[2]) {
    return pathParts[2] === 'new' ? 'New Operator' : 'Operator Details';
  }

  return 'Dashboard';
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search (desktop only) */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-8"
              />
            </div>
          </div>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>

          {/* Language switcher */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <LanguageSwitcher />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Change language</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>

          {/* User menu */}
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  );
}
