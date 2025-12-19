'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, MapPin, MoreHorizontal, Edit, Power, Trash, DollarSign, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ActiveStatusBadge, LoadingPage, LoadingSpinner, ConfirmDialog, CurrencyDisplay } from '@/components/common';
import {
  useLocations,
  useCreateLocation,
  useUpdateLocation,
  useToggleLocationStatus,
  useDeleteLocation,
} from '@/hooks';
import {
  createLocationSchema,
  CreateLocationFormData,
  updateLocationSchema,
  UpdateLocationFormData,
} from '@/lib/validations';
import { Location } from '@/types';

export default function LocationsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    location: Location | null;
    action: 'toggle' | 'delete';
  }>({ open: false, location: null, action: 'toggle' });

  const { data, isLoading } = useLocations({ pageSize: 100 });
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const toggleStatus = useToggleLocationStatus();
  const deleteLocation = useDeleteLocation();

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateLocationFormData>({
    resolver: zodResolver(createLocationSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<UpdateLocationFormData>({
    resolver: zodResolver(updateLocationSchema),
  });

  const onCreateSubmit = (data: CreateLocationFormData) => {
    createLocation.mutate(
      {
        name: data.name,
        code: data.code.toUpperCase(),
        description: data.description || undefined,
        address: data.address || undefined,
      },
      {
        onSuccess: () => {
          setCreateDialogOpen(false);
          resetCreate();
        },
      }
    );
  };

  const onEditSubmit = (data: UpdateLocationFormData) => {
    if (!editingLocation) return;
    updateLocation.mutate(
      {
        id: editingLocation.id,
        data: {
          name: data.name,
          code: data.code?.toUpperCase() || undefined,
          description: data.description || undefined,
          address: data.address || undefined,
        },
      },
      {
        onSuccess: () => {
          setEditingLocation(null);
          resetEdit();
        },
      }
    );
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    resetEdit({
      name: location.name,
      code: location.code,
      description: location.description || '',
      address: location.address || '',
    });
  };

  const handleConfirm = () => {
    const { location, action } = confirmDialog;
    if (!location) return;

    if (action === 'toggle') {
      toggleStatus.mutate(
        { id: location.id, activate: !location.isActive },
        { onSuccess: () => setConfirmDialog({ open: false, location: null, action: 'toggle' }) }
      );
    } else {
      deleteLocation.mutate(location.id, {
        onSuccess: () => setConfirmDialog({ open: false, location: null, action: 'toggle' }),
      });
    }
  };

  if (isLoading) {
    return <LoadingPage message="Loading locations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-muted-foreground">
            {data?.pagination.totalCount || 0} total locations
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Location Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((location) => (
          <Card key={location.id} className="card-hover">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{location.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{location.code}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(location)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setConfirmDialog({ open: true, location, action: 'toggle' })
                    }
                  >
                    <Power className="mr-2 h-4 w-4" />
                    {location.isActive ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      setConfirmDialog({ open: true, location, action: 'delete' })
                    }
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <ActiveStatusBadge isActive={location.isActive} size="sm" />
              </div>
              {location.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {location.description}
                </p>
              )}
              {location.address && (
                <p className="text-xs text-muted-foreground">{location.address}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!data?.items || data.items.length === 0) && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No locations yet</h3>
            <p className="mt-2 text-muted-foreground">
              Add your first location to start selling vouchers
            </p>
            <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>Create a new location for selling vouchers</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Name *</Label>
                <Input id="create-name" {...registerCreate('name')} />
                {createErrors.name && (
                  <p className="text-sm text-destructive">{createErrors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-code">Code *</Label>
                <Input
                  id="create-code"
                  placeholder="e.g., LOC-001"
                  {...registerCreate('code')}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Uppercase letters, numbers, hyphens, and underscores only
                </p>
                {createErrors.code && (
                  <p className="text-sm text-destructive">{createErrors.code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea id="create-description" {...registerCreate('description')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-address">Address</Label>
                <Input id="create-address" {...registerCreate('address')} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createLocation.isPending}>
                {createLocation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingLocation} onOpenChange={(open) => !open && setEditingLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update location details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" {...registerEdit('name')} />
                {editErrors.name && (
                  <p className="text-sm text-destructive">{editErrors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code *</Label>
                <Input id="edit-code" {...registerEdit('code')} className="uppercase" />
                <p className="text-xs text-muted-foreground">
                  Uppercase letters, numbers, hyphens, and underscores only
                </p>
                {editErrors.code && (
                  <p className="text-sm text-destructive">{editErrors.code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" {...registerEdit('description')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" {...registerEdit('address')} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingLocation(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateLocation.isPending}>
                {updateLocation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Save Changes
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
            ? 'Delete Location'
            : confirmDialog.location?.isActive
            ? 'Deactivate Location'
            : 'Activate Location'
        }
        description={
          confirmDialog.action === 'delete'
            ? `Are you sure you want to delete ${confirmDialog.location?.name}? This action cannot be undone.`
            : confirmDialog.location?.isActive
            ? `Are you sure you want to deactivate ${confirmDialog.location?.name}?`
            : `Are you sure you want to activate ${confirmDialog.location?.name}?`
        }
        confirmLabel={confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
        onConfirm={handleConfirm}
        isLoading={toggleStatus.isPending || deleteLocation.isPending}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </div>
  );
}
