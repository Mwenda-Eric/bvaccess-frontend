'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  Plus,
  CreditCard,
  MoreHorizontal,
  Edit,
  Power,
  Trash,
  Wifi,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ActiveStatusBadge,
  LoadingPage,
  LoadingSpinner,
  ConfirmDialog,
  CurrencyDisplay,
} from '@/components/common';
import {
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from '@/hooks';
import { Plan } from '@/types';

const planSchema = z.object({
  planName: z.string().min(1, 'Plan group name is required').max(50),
  name: z.string().min(1, 'Tier name is required').max(100),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().min(0, 'Price must be 0 or more'),
  sortOrder: z.number().min(0, 'Sort order must be 0 or more'),
});

type PlanFormData = z.infer<typeof planSchema>;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) {
    const hours = minutes / 60;
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  const days = minutes / 1440;
  return days === 1 ? '1 day' : `${days} days`;
}

export default function PlansPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    plan: Plan | null;
    action: 'toggle' | 'delete';
  }>({ open: false, plan: null, action: 'toggle' });

  const { data: plans, isLoading } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: { planName: 'Plan A', sortOrder: 1 },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
  });

  const onCreateSubmit = (data: PlanFormData) => {
    createPlan.mutate(
      {
        planName: data.planName,
        name: data.name,
        durationMinutes: data.durationMinutes,
        price: data.price,
        sortOrder: data.sortOrder,
      },
      {
        onSuccess: () => {
          setCreateDialogOpen(false);
          resetCreate({ planName: 'Plan A', sortOrder: 1 });
        },
      }
    );
  };

  const onEditSubmit = (data: PlanFormData) => {
    if (!editingPlan) return;
    updatePlan.mutate(
      {
        id: editingPlan.id,
        data: {
          planName: data.planName,
          name: data.name,
          durationMinutes: data.durationMinutes,
          price: data.price,
          isActive: editingPlan.isActive,
          sortOrder: data.sortOrder,
        },
      },
      {
        onSuccess: () => {
          setEditingPlan(null);
          resetEdit();
        },
      }
    );
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    resetEdit({
      planName: plan.planName,
      name: plan.name,
      durationMinutes: plan.durationMinutes,
      price: plan.price,
      sortOrder: plan.sortOrder,
    });
  };

  const handleConfirm = () => {
    const { plan, action } = confirmDialog;
    if (!plan) return;

    if (action === 'toggle') {
      updatePlan.mutate(
        {
          id: plan.id,
          data: {
            planName: plan.planName,
            name: plan.name,
            durationMinutes: plan.durationMinutes,
            price: plan.price,
            isActive: !plan.isActive,
            sortOrder: plan.sortOrder,
          },
        },
        { onSuccess: () => setConfirmDialog({ open: false, plan: null, action: 'toggle' }) }
      );
    } else {
      deletePlan.mutate(plan.id, {
        onSuccess: () => setConfirmDialog({ open: false, plan: null, action: 'toggle' }),
      });
    }
  };

  if (isLoading) {
    return <LoadingPage message="Loading plans..." />;
  }

  // Group plans by planName
  const groupedPlans: Record<string, Plan[]> = {};
  plans?.forEach((plan) => {
    if (!groupedPlans[plan.planName]) {
      groupedPlans[plan.planName] = [];
    }
    groupedPlans[plan.planName].push(plan);
  });

  // Sort each group by sortOrder
  Object.values(groupedPlans).forEach((group) =>
    group.sort((a, b) => a.sortOrder - b.sortOrder)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plans</h1>
          <p className="text-muted-foreground">
            {plans?.length || 0} plan tiers across {Object.keys(groupedPlans).length} groups
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/plans/wifi-codes">
              <Wifi className="mr-2 h-4 w-4" />
              WiFi Codes
            </Link>
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan Tier
          </Button>
        </div>
      </div>

      {/* Plan Groups */}
      {Object.entries(groupedPlans).map(([planName, tiers]) => (
        <Card key={planName}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{planName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {tiers.length} tier{tiers.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price (HTG)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatDuration(plan.durationMinutes)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CurrencyDisplay amount={plan.price} size="sm" />
                    </TableCell>
                    <TableCell>
                      <ActiveStatusBadge isActive={plan.isActive} size="sm" />
                    </TableCell>
                    <TableCell>{plan.sortOrder}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(plan)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmDialog({ open: true, plan, action: 'toggle' })
                            }
                          >
                            <Power className="mr-2 h-4 w-4" />
                            {plan.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              setConfirmDialog({ open: true, plan, action: 'delete' })
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {(!plans || plans.length === 0) && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No plans yet</h3>
            <p className="mt-2 text-muted-foreground">
              Create your first pricing plan to get started
            </p>
            <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Plan Tier
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Plan Tier</DialogTitle>
            <DialogDescription>Create a new pricing tier within a plan group</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-planName">Plan Group *</Label>
                <Input
                  id="create-planName"
                  placeholder="e.g., Plan A"
                  {...registerCreate('planName')}
                />
                {createErrors.planName && (
                  <p className="text-sm text-destructive">{createErrors.planName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-name">Tier Name *</Label>
                <Input
                  id="create-name"
                  placeholder="e.g., 30 Minutes"
                  {...registerCreate('name')}
                />
                {createErrors.name && (
                  <p className="text-sm text-destructive">{createErrors.name.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-duration">Duration (minutes) *</Label>
                  <Input
                    id="create-duration"
                    type="number"
                    min="1"
                    {...registerCreate('durationMinutes', { valueAsNumber: true })}
                  />
                  {createErrors.durationMinutes && (
                    <p className="text-sm text-destructive">{createErrors.durationMinutes.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-price">Price (HTG) *</Label>
                  <Input
                    id="create-price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...registerCreate('price', { valueAsNumber: true })}
                  />
                  {createErrors.price && (
                    <p className="text-sm text-destructive">{createErrors.price.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-sortOrder">Sort Order</Label>
                <Input
                  id="create-sortOrder"
                  type="number"
                  min="0"
                  {...registerCreate('sortOrder', { valueAsNumber: true })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPlan.isPending}>
                {createPlan.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan Tier</DialogTitle>
            <DialogDescription>Update plan tier details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-planName">Plan Group *</Label>
                <Input id="edit-planName" {...registerEdit('planName')} />
                {editErrors.planName && (
                  <p className="text-sm text-destructive">{editErrors.planName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tier Name *</Label>
                <Input id="edit-name" {...registerEdit('name')} />
                {editErrors.name && (
                  <p className="text-sm text-destructive">{editErrors.name.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (minutes) *</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    {...registerEdit('durationMinutes', { valueAsNumber: true })}
                  />
                  {editErrors.durationMinutes && (
                    <p className="text-sm text-destructive">{editErrors.durationMinutes.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (HTG) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...registerEdit('price', { valueAsNumber: true })}
                  />
                  {editErrors.price && (
                    <p className="text-sm text-destructive">{editErrors.price.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sortOrder">Sort Order</Label>
                <Input
                  id="edit-sortOrder"
                  type="number"
                  min="0"
                  {...registerEdit('sortOrder', { valueAsNumber: true })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingPlan(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatePlan.isPending}>
                {updatePlan.isPending && <LoadingSpinner size="sm" className="mr-2" />}
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
            ? 'Delete Plan Tier'
            : confirmDialog.plan?.isActive
            ? 'Deactivate Plan Tier'
            : 'Activate Plan Tier'
        }
        description={
          confirmDialog.action === 'delete'
            ? `Are you sure you want to delete "${confirmDialog.plan?.name}"? This will deactivate the tier.`
            : confirmDialog.plan?.isActive
            ? `Are you sure you want to deactivate "${confirmDialog.plan?.name}"?`
            : `Are you sure you want to activate "${confirmDialog.plan?.name}"?`
        }
        confirmLabel={confirmDialog.action === 'delete' ? 'Delete' : 'Confirm'}
        onConfirm={handleConfirm}
        isLoading={updatePlan.isPending || deletePlan.isPending}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </div>
  );
}
