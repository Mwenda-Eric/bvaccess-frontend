'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Ban, Clock, MapPin, User, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge, CurrencyDisplay, LoadingPage } from '@/components/common';
import { VoidVoucherDialog } from '@/components/vouchers';
import { useVoucher, useVoidVoucher } from '@/hooks';
import { getVoucherStatus, formatDuration } from '@/types';
import { formatDateTime, formatDate } from '@/lib/utils';

export default function VoucherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

  const { data: voucher, isLoading, error } = useVoucher(id);
  const voidVoucher = useVoidVoucher();

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && voucher) {
      console.log('[VoucherDetailsPage] Received voucher:', voucher);
    }
  }, [voucher]);

  const handleVoidConfirm = (reason: string) => {
    voidVoucher.mutate(
      { id, reason },
      {
        onSuccess: () => {
          setVoidDialogOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingPage message="Loading voucher details..." />;
  }

  if (error || !voucher) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">Voucher not found</h2>
        <p className="text-muted-foreground">The voucher you're looking for doesn't exist.</p>
        <Button className="mt-4" asChild>
          <Link href="/vouchers">Back to Vouchers</Link>
        </Button>
      </div>
    );
  }

  const status = getVoucherStatus(voucher);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold">{voucher.code}</h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-muted-foreground">Voucher Details</p>
        </div>
        {!voucher.isVoid && (
          <Button variant="destructive" onClick={() => setVoidDialogOpen(true)}>
            <Ban className="mr-2 h-4 w-4" />
            Void Voucher
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Voucher Information */}
        <Card>
          <CardHeader>
            <CardTitle>Voucher Information</CardTitle>
            <CardDescription>Details about this voucher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{formatDuration(voucher.durationMinutes)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <CurrencyDisplay amount={voucher.price} size="lg" />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Bandwidth</p>
                <p className="font-medium">{voucher.bandwidth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {voucher.paymentMethod === 'EWallet' ? 'E-Wallet' : 'Cash'}
                </p>
              </div>
            </div>

            {voucher.buyerInfo && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Buyer Info</p>
                  <p className="font-medium">{voucher.buyerInfo}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Location & Operator */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Operator</CardTitle>
            <CardDescription>Where and who created this voucher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{voucher.locationName || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{voucher.operatorName || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>History of this voucher</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Created */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  {voucher.isVoid && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium">Voucher Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(voucher.createdAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    by {voucher.operatorName || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Voided */}
              {voucher.isVoid && voucher.voidedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <Ban className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Voucher Voided</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(voucher.voidedAt)}
                    </p>
                    {voucher.voidedByName && (
                      <p className="text-sm text-muted-foreground">
                        by {voucher.voidedByName}
                      </p>
                    )}
                    {voucher.voidReason && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium">Reason:</span> {voucher.voidReason}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Expires */}
              {!voucher.isVoid && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-px flex-1 bg-border" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <p className="font-medium text-muted-foreground">Expires</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(voucher.expiresAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Void Dialog */}
      <VoidVoucherDialog
        voucher={voucher}
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        onConfirm={handleVoidConfirm}
        isLoading={voidVoucher.isPending}
      />
    </div>
  );
}
