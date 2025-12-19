'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Shield, MoreHorizontal, Edit, Power, Trash, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActiveStatusBadge, LoadingPage, LoadingSpinner, ConfirmDialog, Pagination } from '@/components/common';
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useToggleAdminStatus,
  useDeleteAdmin,
  useResetAdminPassword,
} from '@/hooks';
import {
  createAdminSchema,
  CreateAdminFormData,
  resetPasswordSchema,
  ResetPasswordFormData,
} from '@/lib/validations';
import { Admin, AdminRole } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { ADMIN_ROLES, DEFAULT_PAGE_SIZE } from '@/lib/constants';

function getRoleBadgeColor(role: AdminRole): string {
  switch (role) {
    case 'SuperAdmin':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'Admin':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState<Admin | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    admin: Admin | null;
    action: 'toggle' | 'delete';
  }>({ open: false, admin: null, action: 'toggle' });

  const { data: admins, isLoading } = useAdmins();
  const createAdmin = useCreateAdmin();
  const toggleStatus = useToggleAdminStatus();
  const deleteAdmin = useDeleteAdmin();
  const resetPassword = useResetAdminPassword();

  // Client-side pagination
  const totalCount = admins?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedAdmins = admins?.slice(startIndex, startIndex + pageSize) || [];

  const data = {
    items: paginatedAdmins,
    pagination: {
      currentPage: page,
      pageSize,
      totalPages,
      totalCount,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  };

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    setValue: setCreateValue,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { role: 'Admin' },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onCreateSubmit = (data: CreateAdminFormData) => {
    createAdmin.mutate(data, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        resetCreate();
      },
    });
  };

  const onResetPassword = (data: ResetPasswordFormData) => {
    if (!resetPasswordAdmin) return;
    resetPassword.mutate(
      { id: resetPasswordAdmin.id, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setResetPasswordAdmin(null);
          resetPasswordForm();
        },
      }
    );
  };

  const handleConfirm = () => {
    const { admin, action } = confirmDialog;
    if (!admin) return;

    if (action === 'toggle') {
      toggleStatus.mutate(
        { id: admin.id, activate: !admin.isActive },
        { onSuccess: () => setConfirmDialog({ open: false, admin: null, action: 'toggle' }) }
      );
    } else {
      deleteAdmin.mutate(admin.id, {
        onSuccess: () => setConfirmDialog({ open: false, admin: null, action: 'toggle' }),
      });
    }
  };

  if (isLoading) {
    return <LoadingPage message="Loading admins..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">
            {data?.pagination.totalCount || 0} total admins
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.fullName}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(admin.role)} variant="secondary">
                    <Shield className="mr-1 h-3 w-3" />
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActiveStatusBadge isActive={admin.isActive} size="sm" />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {admin.lastLoginAt ? formatRelativeTime(admin.lastLoginAt) : 'Never'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setResetPasswordAdmin(admin)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setConfirmDialog({ open: true, admin, action: 'toggle' })
                        }
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          setConfirmDialog({ open: true, admin, action: 'delete' })
                        }
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No admins found
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin</DialogTitle>
            <DialogDescription>Create a new admin user</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...registerCreate('username')} />
                {createErrors.username && (
                  <p className="text-sm text-destructive">{createErrors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...registerCreate('fullName')} />
                {createErrors.fullName && (
                  <p className="text-sm text-destructive">{createErrors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...registerCreate('email')} />
                {createErrors.email && (
                  <p className="text-sm text-destructive">{createErrors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  defaultValue="Admin"
                  onValueChange={(value) => setCreateValue('role', value as AdminRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...registerCreate('password')} />
                {createErrors.password && (
                  <p className="text-sm text-destructive">{createErrors.password.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createAdmin.isPending}>
                {createAdmin.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Create Admin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordAdmin} onOpenChange={(open) => !open && setResetPasswordAdmin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {resetPasswordAdmin?.fullName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(onResetPassword)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...registerPassword('newPassword')} />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResetPasswordAdmin(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={resetPassword.isPending}>
                {resetPassword.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={
          confirmDialog.action === 'delete'
            ? 'Delete Admin'
            : confirmDialog.admin?.isActive
            ? 'Deactivate Admin'
            : 'Activate Admin'
        }
        description={
          confirmDialog.action === 'delete'
            ? `Are you sure you want to delete ${confirmDialog.admin?.fullName}? This action cannot be undone.`
            : confirmDialog.admin?.isActive
            ? `Are you sure you want to deactivate ${confirmDialog.admin?.fullName}?`
            : `Are you sure you want to activate ${confirmDialog.admin?.fullName}?`
        }
        confirmLabel={confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
        onConfirm={handleConfirm}
        isLoading={toggleStatus.isPending || deleteAdmin.isPending}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </div>
  );
}
