
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, MapPin } from "lucide-react";
import { EmployeeData } from "@/components/employees/EmployeeCard";

interface EmployeeFiltersProps {
  employees: EmployeeData[];
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  skillFilter: string;
  setSkillFilter: (value: string) => void;
}

export function EmployeeFilters({
  employees,
  locationFilter,
  setLocationFilter,
  skillFilter,
  setSkillFilter
}: EmployeeFiltersProps) {
  // Get unique locations from employees
  const locations = Array.from(new Set(employees.map(emp => emp.location)));
  
  // Extract all unique skills from employees
  const allSkills = new Set<string>();
  employees.forEach(emp => {
    emp.skills?.forEach(skill => allSkills.add(skill));
  });
  const skills = Array.from(allSkills);
  
  return (
    <div className="flex flex-wrap gap-2">      
      <Select value={locationFilter} onValueChange={setLocationFilter}>
        <SelectTrigger className="w-[140px]">
          <MapPin className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all-locations" value="all">All Locations</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={skillFilter} onValueChange={setSkillFilter}>
        <SelectTrigger className="w-[140px]">
          <Tag className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Skill" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all-skills" value="all">All Skills</SelectItem>
          {skills.map((skill) => (
            <SelectItem key={skill} value={skill}>
              {skill}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
