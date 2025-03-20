import { EmployeeData } from "@/components/employees/EmployeeCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeTableProps {
  employees: EmployeeData[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Occupancy Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.phone}</TableCell>
            <TableCell>{employee.location}</TableCell>
            <TableCell>{employee.joinDate}</TableCell>
            <TableCell>{employee.manager}</TableCell>
            <TableCell>{employee.occupancyRate}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
