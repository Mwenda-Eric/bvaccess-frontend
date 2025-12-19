'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActiveStatusBadge, Pagination, LoadingPage, ConfirmDialog } from '@/components/common';
import { useOperators, useToggleOperatorStatus, useDeleteOperator } from '@/hooks';
import { formatRelativeTime } from '@/lib/utils';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { Operator } from '@/types';
import { MoreHorizontal, Edit, Power, Trash } from 'lucide-react';

export default function OperatorsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    operator: Operator | null;
    action: 'toggle' | 'delete';
  }>({ open: false, operator: null, action: 'toggle' });

  const { data, isLoading } = useOperators({
    page,
    pageSize,
    search: search || undefined,
  });

  const toggleStatus = useToggleOperatorStatus();
  const deleteOperator = useDeleteOperator();

  const handleToggleStatus = (operator: Operator) => {
    setConfirmDialog({ open: true, operator, action: 'toggle' });
  };

  const handleDelete = (operator: Operator) => {
    setConfirmDialog({ open: true, operator, action: 'delete' });
  };

  const handleConfirm = () => {
    const { operator, action } = confirmDialog;
    if (!operator) return;

    if (action === 'toggle') {
      toggleStatus.mutate(
        { id: operator.id, activate: !operator.isActive },
        { onSuccess: () => setConfirmDialog({ open: false, operator: null, action: 'toggle' }) }
      );
    } else {
      deleteOperator.mutate(operator.id, {
        onSuccess: () => setConfirmDialog({ open: false, operator: null, action: 'toggle' }),
      });
    }
  };

  if (isLoading) {
    return <LoadingPage message="Loading operators..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Operators</h1>
          <p className="text-muted-foreground">
            {data?.pagination.totalCount || 0} total operators
          </p>
        </div>
        <Button asChild>
          <Link href="/operators/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Operator
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search operators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((operator) => (
              <TableRow key={operator.id}>
                <TableCell className="font-medium">{operator.fullName}</TableCell>
                <TableCell className="font-mono text-sm">@{operator.username}</TableCell>
                <TableCell>{operator.email || '-'}</TableCell>
                <TableCell>{operator.location?.name || '-'}</TableCell>
                <TableCell>
                  <ActiveStatusBadge isActive={operator.isActive} size="sm" />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {operator.lastLoginAt
                    ? formatRelativeTime(operator.lastLoginAt)
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/operators/${operator.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(operator)}>
                        <Power className="mr-2 h-4 w-4" />
                        {operator.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(operator)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {(!data?.items || data.items.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No operators found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          pageSize={data.pagination.pageSize}
          totalCount={data.pagination.totalCount}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ ...confirmDialog, open })
        }
        title={
          confirmDialog.action === 'delete'
            ? 'Delete Operator'
            : confirmDialog.operator?.isActive
            ? 'Deactivate Operator'
            : 'Activate Operator'
        }
        description={
          confirmDialog.action === 'delete'
            ? `Are you sure you want to delete ${confirmDialog.operator?.fullName}? This action cannot be undone.`
            : confirmDialog.operator?.isActive
            ? `Are you sure you want to deactivate ${confirmDialog.operator?.fullName}? They will no longer be able to create vouchers.`
            : `Are you sure you want to activate ${confirmDialog.operator?.fullName}?`
        }
        confirmLabel={confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
        onConfirm={handleConfirm}
        isLoading={toggleStatus.isPending || deleteOperator.isPending}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </div>
  );
}
