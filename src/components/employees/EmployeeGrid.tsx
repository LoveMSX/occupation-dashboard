import { EmployeeCard, EmployeeData } from "@/components/employees/EmployeeCard";

interface EmployeeGridProps {
  employees: EmployeeData[];
  viewMode: "grid" | "list"; 
}

export function EmployeeGrid({ employees = [], viewMode = "grid" }: EmployeeGridProps) {
  if (!employees) return null;

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
      {employees.filter(employee => employee?.id).map((employee) => (
        <EmployeeCard 
          key={employee.id} 
          employee={{
            id: employee.id,
            name: employee.name,
            appelation: employee.appelation || "",
            position: employee.position || employee.poste || "",
            email: employee.email || "",
            phone: employee.phone || "",
            avatar: employee.avatar,
            location: employee.location || "",
            joinDate: employee.joinDate || new Date().toISOString(),
            manager: employee.manager,
            skills: employee.skills || [],
            occupancyRate: employee.occupancyRate || 0,
            projects: employee.projects || []
          }} 
          viewMode={viewMode} 
        />
      ))}
      
      {employees.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No employees found</p>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
