'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  Wifi,
  ArrowLeft,
  Plus,
  Search,
  Trash,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LoadingPage,
  LoadingSpinner,
  ConfirmDialog,
  Pagination,
  CurrencyDisplay,
} from '@/components/common';
import {
  usePlans,
  useWifiCodes,
  useGenerateWifiCodes,
  useDeleteWifiCode,
} from '@/hooks';
import { useDebounce } from '@/hooks';
import { WifiCode } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

const generateSchema = z.object({
  planId: z.string().min(1, 'Plan tier is required'),
  count: z.number().min(1, 'Must generate at least 1 code').max(1000, 'Maximum 1000 codes'),
});

type GenerateFormData = z.infer<typeof generateSchema>;

export default function WifiCodesPage() {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    code: WifiCode | null;
  }>({ open: false, code: null });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebounce(search, 300);

  const { data: plans } = usePlans();
  const { data: codesData, isLoading } = useWifiCodes({
    page,
    pageSize,
    planId: planFilter !== 'all' ? planFilter : undefined,
    isUsed: statusFilter === 'all' ? undefined : statusFilter === 'used',
    search: debouncedSearch || undefined,
  });
  const generateCodes = useGenerateWifiCodes();
  const deleteCode = useDeleteWifiCode();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GenerateFormData>({
    resolver: zodResolver(generateSchema),
    defaultValues: { count: 50 },
  });

  const onGenerateSubmit = (data: GenerateFormData) => {
    generateCodes.mutate(
      { planId: data.planId, count: data.count },
      {
        onSuccess: () => {
          setGenerateDialogOpen(false);
          reset({ count: 50 });
        },
      }
    );
  };

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  if (isLoading) {
    return <LoadingPage message="Loading WiFi codes..." />;
  }

  const totalAvailable = codesData?.pagination?.totalCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/plans">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">WiFi Codes</h1>
            <p className="text-muted-foreground">
              {totalAvailable} total codes
            </p>
          </div>
        </div>
        <Button onClick={() => setGenerateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Codes
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by code..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={planFilter}
              onValueChange={(value) => {
                setPlanFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {plans?.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.planName} - {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Plan Tier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codesData?.items?.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm">
                        {code.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(code.code, code.id)}
                      >
                        {copiedId === code.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {code.planName} - {code.planTierName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CurrencyDisplay amount={code.price} size="sm" />
                  </TableCell>
                  <TableCell>
                    {code.isUsed ? (
                      <Badge variant="secondary">Used</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        Available
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {code.operatorName || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(code.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {!code.isUsed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteDialog({ open: true, code })}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!codesData?.items || codesData.items.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Wifi className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No WiFi codes found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGenerateDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Generate Codes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {codesData?.pagination && codesData.pagination.totalCount > 0 && (
        <Pagination
          currentPage={codesData.pagination.currentPage}
          totalPages={codesData.pagination.totalPages}
          pageSize={codesData.pagination.pageSize}
          totalCount={codesData.pagination.totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Generate Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate WiFi Codes</DialogTitle>
            <DialogDescription>
              Generate a batch of WiFi access codes for a plan tier
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onGenerateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Plan Tier *</Label>
                <Select
                  onValueChange={(value) => setValue('planId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans
                      ?.filter((p) => p.isActive)
                      .map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.planName} - {plan.name} (HTG {plan.price})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.planId && (
                  <p className="text-sm text-destructive">{errors.planId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="generate-count">Number of Codes *</Label>
                <Input
                  id="generate-count"
                  type="number"
                  min="1"
                  max="1000"
                  {...register('count', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 1,000 codes per batch
                </p>
                {errors.count && (
                  <p className="text-sm text-destructive">{errors.count.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={generateCodes.isPending}>
                {generateCodes.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Generate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete WiFi Code"
        description={`Are you sure you want to delete code "${deleteDialog.code?.code}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteDialog.code) {
            deleteCode.mutate(deleteDialog.code.id, {
              onSuccess: () => setDeleteDialog({ open: false, code: null }),
            });
          }
        }}
        isLoading={deleteCode.isPending}
        variant="destructive"
      />
    </div>
  );
}
