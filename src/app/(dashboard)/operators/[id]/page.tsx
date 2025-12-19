'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner, LoadingPage, CurrencyDisplay } from '@/components/common';
import {
  useOperatorWithStats,
  useUpdateOperator,
  useResetOperatorPassword,
  useAllLocations,
} from '@/hooks';
import {
  updateOperatorSchema,
  UpdateOperatorFormData,
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@/lib/validations';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

export default function OperatorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const { data: operatorData, isLoading } = useOperatorWithStats(id);
  const { data: locations } = useAllLocations();
  const updateOperator = useUpdateOperator();
  const resetPassword = useResetOperatorPassword();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateOperatorFormData>({
    resolver: zodResolver(updateOperatorSchema),
    values: operatorData
      ? {
          fullName: operatorData.fullName,
          email: operatorData.email || '',
          phoneNumber: operatorData.phoneNumber || '',
          locationId: operatorData.locationId || operatorData.location?.id,
          isActive: operatorData.isActive,
        }
      : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const isActive = watch('isActive');

  const onSubmit = (data: UpdateOperatorFormData) => {
    updateOperator.mutate(
      {
        id,
        data: {
          ...data,
          email: data.email || undefined,
          phoneNumber: data.phoneNumber || undefined,
        },
      },
      { onSuccess: () => router.push('/operators') }
    );
  };

  const onResetPassword = (data: ResetPasswordFormData) => {
    resetPassword.mutate(
      { id, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setResetPasswordOpen(false);
          resetPasswordForm();
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingPage message="Loading operator details..." />;
  }

  if (!operatorData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-lg font-semibold">Operator not found</h2>
        <Button className="mt-4" onClick={() => router.push('/operators')}>
          Back to Operators
        </Button>
      </div>
    );
  }

  // Stats may not be available from the backend - provide default values
  const stats = (operatorData as unknown as { stats?: { salesToday: number; revenueToday: number; revenueThisWeek: number; revenueThisMonth: number; averageTicket: number; totalSales: number; totalRevenue: number } }).stats || {
    salesToday: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    averageTicket: 0,
    totalSales: 0,
    totalRevenue: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{operatorData.fullName}</h1>
          <p className="text-muted-foreground">@{operatorData.username}</p>
        </div>
        <Button variant="outline" onClick={() => setResetPasswordOpen(true)}>
          <KeyRound className="mr-2 h-4 w-4" />
          Reset Password
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Operator Information</CardTitle>
              <CardDescription>Update operator details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register('fullName')} />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" {...register('phoneNumber')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationId">Default Location</Label>
                    <Select
                      value={watch('locationId') || 'none'}
                      onValueChange={(value) =>
                        setValue('locationId', value === 'none' ? undefined : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No default location</SelectItem>
                        {locations?.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Active Status</p>
                    <p className="text-sm text-muted-foreground">
                      {isActive
                        ? 'Operator can create vouchers'
                        : 'Operator is deactivated'}
                    </p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateOperator.isPending}>
                    {updateOperator.isPending && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Today's Sales</span>
                <span className="font-medium">{stats.salesToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Today's Revenue</span>
                <CurrencyDisplay amount={stats.revenueToday} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Week</span>
                <CurrencyDisplay amount={stats.revenueThisWeek} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Month</span>
                <CurrencyDisplay amount={stats.revenueThisMonth} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Ticket</span>
                <CurrencyDisplay amount={stats.averageTicket} />
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sales</span>
                  <span className="font-medium">{stats.totalSales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <CurrencyDisplay amount={stats.totalRevenue} size="lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Active</span>
                <span>
                  {operatorData.lastLoginAt
                    ? formatRelativeTime(operatorData.lastLoginAt)
                    : 'Never'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {operatorData.fullName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(onResetPassword)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...registerPassword('newPassword')}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerPassword('confirmPassword')}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resetPassword.isPending}>
                {resetPassword.isPending && (
                  <LoadingSpinner size="sm" className="mr-2" />
                )}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
