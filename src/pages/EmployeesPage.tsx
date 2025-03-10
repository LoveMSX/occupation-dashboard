import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "@/services/api";
import { EmployeeGrid } from "@/components/employees/EmployeeGrid";

type ViewMode = "cards" | "table" | "chart";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<ViewMode>("cards");

  // Fetch employees data
  const { data: employees = [], isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeApi.getAllEmployees
  });

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    const searchFields = [
      employee?.name?.toLowerCase() || "",
      employee?.position?.toLowerCase() || "",
      employee?.email?.toLowerCase() || "",
    ];
    return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employees</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Search and filters */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Employee Grid */}
      <EmployeeGrid 
        employees={filteredEmployees}
        viewMode={currentView === "cards" ? "grid" : "list"}
      />
    </div>
  );
};
