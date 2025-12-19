'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker, SearchInput } from '@/components/common';
import { useAllLocations, useAllOperators } from '@/hooks';
import { VoucherFilters as VoucherFiltersType } from '@/types';
import { DateRange } from 'react-day-picker';
import { formatDateForApi } from '@/lib/utils';
import { DURATION_OPTIONS, PAYMENT_METHODS } from '@/lib/constants';

interface VoucherFiltersProps {
  filters: VoucherFiltersType;
  onFiltersChange: (filters: VoucherFiltersType) => void;
}

export function VoucherFilters({ filters, onFiltersChange }: VoucherFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: locations } = useAllLocations();
  const { data: operators } = useAllOperators();

  const dateRange: DateRange | undefined =
    filters.dateFrom && filters.dateTo
      ? {
          from: new Date(filters.dateFrom),
          to: new Date(filters.dateTo),
        }
      : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: range?.from ? formatDateForApi(range.from) : undefined,
      dateTo: range?.to ? formatDateForApi(range.to) : undefined,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <SearchInput
          value={filters.search}
          onChange={(value) => onFiltersChange({ ...filters, search: value })}
          placeholder="Search by code..."
          className="w-64"
        />

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              !
            </span>
          )}
        </Button>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="flex flex-wrap gap-4 rounded-lg border bg-card p-4">
          {/* Location Filter */}
          <div className="w-48">
            <Select
              value={filters.locationIds?.[0] || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  locationIds: value === 'all' ? undefined : [value],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations?.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator Filter */}
          <div className="w-48">
            <Select
              value={filters.operatorIds?.[0] || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  operatorIds: value === 'all' ? undefined : [value],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Operators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operators</SelectItem>
                {operators?.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value === 'all' ? undefined : (value as 'active' | 'void' | 'expired'),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="void">Voided</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="w-40">
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  paymentMethod: value === 'all' ? undefined : (value as 'Cash' | 'EWallet'),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                {PAYMENT_METHODS.map((pm) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    {pm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Filter */}
          <div className="w-40">
            <Select
              value={filters.durationMinutes?.toString() || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  durationMinutes: value === 'all' ? undefined : parseInt(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Durations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                {DURATION_OPTIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value.toString()}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Select date range"
          />
        </div>
      )}
    </div>
  );
}
