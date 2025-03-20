
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmployeeSearch({ value, onChange }: EmployeeSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search employees..."
        className="pl-8 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default EmployeeSearch;
