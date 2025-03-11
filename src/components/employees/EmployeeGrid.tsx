
import { EmployeeCard, EmployeeData } from "@/components/employees/EmployeeCard";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EmployeeGridProps {
  employees: EmployeeData[];
  viewMode: "grid" | "list";
}

export function EmployeeGrid({ employees = [], viewMode = "grid" }: EmployeeGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 8 : 10;
  
  // Calculate total pages
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  if (!employees?.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium">No employees found</p>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
        : "space-y-4"}>
        {currentEmployees.map((employee) => (
          <EmployeeCard 
            key={employee.id} 
            employee={employee}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
