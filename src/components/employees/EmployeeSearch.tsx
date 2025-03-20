
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmployeeSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function EmployeeSearch({ searchTerm, setSearchTerm }: EmployeeSearchProps) {
  return (
    <div className="relative flex-1 md:flex-initial md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search employees..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
