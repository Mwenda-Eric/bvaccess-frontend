'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Clock, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CurrencyDisplay } from '@/components/common';
import { formatDuration } from '@/lib/utils';

// Mock pricing data - in production this would come from an API
const initialPricing = [
  { id: '1', durationMinutes: 30, price: 25, label: '30 minutes' },
  { id: '2', durationMinutes: 60, price: 50, label: '1 hour' },
  { id: '3', durationMinutes: 120, price: 75, label: '2 hours' },
  { id: '4', durationMinutes: 1440, price: 150, label: '24 hours' },
];

export default function PricingSettingsPage() {
  const router = useRouter();
  const [pricing, setPricing] = useState(initialPricing);
  const [customPricePerMinute, setCustomPricePerMinute] = useState('0.50');

  const handlePriceChange = (id: string, newPrice: string) => {
    setPricing((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: parseFloat(newPrice) || 0 } : item
      )
    );
  };

  const handleSave = () => {
    // In production, this would call an API to save the pricing
    console.log('Saving pricing:', pricing, customPricePerMinute);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Pricing Configuration</h1>
          <p className="text-muted-foreground">Configure voucher pricing tiers</p>
        </div>
      </div>

      {/* Standard Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Standard Pricing Tiers</CardTitle>
              <CardDescription>Set prices for standard duration options</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Duration</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Price (HTG)</TableHead>
                <TableHead>Price per Hour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {tier.label}
                    </div>
                  </TableCell>
                  <TableCell>{tier.durationMinutes}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <CurrencyDisplay
                      amount={(tier.price / tier.durationMinutes) * 60}
                      size="sm"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Custom Duration Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Custom Duration Pricing</CardTitle>
              <CardDescription>Price per minute for custom durations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="customPrice">Price per Minute (HTG)</Label>
              <Input
                id="customPrice"
                type="number"
                step="0.01"
                value={customPricePerMinute}
                onChange={(e) => setCustomPricePerMinute(e.target.value)}
                className="w-32"
              />
            </div>
            <div className="pb-2">
              <p className="text-sm text-muted-foreground">
                = <CurrencyDisplay amount={parseFloat(customPricePerMinute) * 60} /> per hour
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This price is used when operators create vouchers with custom durations
            that don't match the standard tiers above.
          </p>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Preview</CardTitle>
          <CardDescription>See how prices will appear to operators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {pricing.map((tier) => (
              <div
                key={tier.id}
                className="rounded-lg border p-4 text-center hover:border-primary transition-colors"
              >
                <p className="text-lg font-semibold">{tier.label}</p>
                <CurrencyDisplay amount={tier.price} size="xl" className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
