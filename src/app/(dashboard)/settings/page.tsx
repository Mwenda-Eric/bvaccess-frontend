'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Settings, User, DollarSign, Info, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account and password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Update your personal information, change your password, and manage your
              account security settings.
            </p>
            <Button asChild>
              <Link href="/settings/profile">
                Manage Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        {session?.user?.role !== 'Viewer' && (
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <DollarSign className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Pricing Configuration</CardTitle>
                  <CardDescription>Manage voucher pricing tiers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Configure pricing for different voucher durations and customize
                special pricing options.
              </p>
              <Button asChild>
                <Link href="/settings/pricing">
                  Configure Pricing
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Application and API status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">API Status</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Online
                </Badge>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="mt-1 font-medium">1.0.0</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="mt-1 font-medium capitalize">
                {process.env.NODE_ENV || 'development'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="mt-1 font-medium">HTG (Haitian Gourde)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>About BV Access</CardTitle>
              <CardDescription>WiFi Voucher Management System</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            BV Access is a comprehensive WiFi voucher management system designed for
            businesses in Haiti. It provides real-time sales tracking, multi-location
            support, and detailed analytics to help you manage your WiFi voucher
            business efficiently.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline">Made in Haiti</Badge>
            <Badge variant="outline">HTG Currency</Badge>
            <Badge variant="outline">Multi-language</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
