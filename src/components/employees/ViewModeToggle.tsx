
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid, List } from 'lucide-react';

export interface ViewModeToggleProps {
  mode: 'grid' | 'table';
  onChange: (mode: 'grid' | 'table') => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <ToggleGroup type="single" value={mode} onValueChange={value => value && onChange(value as 'grid' | 'table')}>
      <ToggleGroupItem value="grid" aria-label="Grid View">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table View">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default ViewModeToggle;
