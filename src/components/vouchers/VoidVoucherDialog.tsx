'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common';
import { voidVoucherSchema, VoidVoucherFormData } from '@/lib/validations';
import { Voucher } from '@/types';

interface VoidVoucherDialogProps {
  voucher: Voucher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function VoidVoucherDialog({
  voucher,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: VoidVoucherDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VoidVoucherFormData>({
    resolver: zodResolver(voidVoucherSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = (data: VoidVoucherFormData) => {
    onConfirm(data.reason);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Void Voucher</DialogTitle>
          <DialogDescription>
            Are you sure you want to void voucher{' '}
            <span className="font-mono font-semibold">{voucher?.code}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for voiding</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for voiding this voucher..."
                {...register('reason')}
                disabled={isLoading}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              Void Voucher
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
