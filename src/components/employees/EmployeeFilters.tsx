
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User } from "lucide-react";
import { EmployeeData } from "@/components/employees/EmployeeCard";

interface EmployeeFiltersProps {
  employees: EmployeeData[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  positionFilter: string;
  setPositionFilter: (value: string) => void;
}

export function EmployeeFilters({
  employees,
  searchTerm,
  setSearchTerm,
  positionFilter, 
  setPositionFilter
}: EmployeeFiltersProps) {
  // Get unique positions from employees, filtering out empty values
  const positions = Array.from(
    new Set(employees.map(emp => emp.position).filter(Boolean))
  ).sort();
  
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher une ressource..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select value={positionFilter} onValueChange={setPositionFilter}>
        <SelectTrigger className="w-[150px]">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{positionFilter === "all" ? "Tous postes" : positionFilter}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous postes</SelectItem>
          {positions.map((position) => (
            <SelectItem key={position} value={position}>
              {position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
