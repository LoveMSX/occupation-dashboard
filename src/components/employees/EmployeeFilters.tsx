
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/LanguageProvider';

export interface EmployeeFiltersProps {
  departments: string[];
  positions: string[];
  skills: string[];
  locations: string[];
  filters: {
    departments: string[];
    positions: string[];
    skills: string[];
    locations: string[];
  };
  onChange: (filters: {
    departments: string[];
    positions: string[];
    skills: string[];
    locations: string[];
  }) => void;
}

export function EmployeeFilters({
  departments,
  positions,
  skills,
  locations,
  filters,
  onChange,
}: EmployeeFiltersProps) {
  const { t } = useLanguage();
  
  const handleFilterChange = (category: keyof typeof filters, value: string) => {
    const currentFilters = [...filters[category]];
    
    if (currentFilters.includes(value)) {
      onChange({
        ...filters,
        [category]: currentFilters.filter((item) => item !== value),
      });
    } else {
      onChange({
        ...filters,
        [category]: [...currentFilters, value],
      });
    }
  };

  const clearFilters = () => {
    onChange({
      departments: [],
      positions: [],
      skills: [],
      locations: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.departments.length +
      filters.positions.length +
      filters.skills.length +
      filters.locations.length
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>{t('filters')}</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 rounded-sm px-1.5 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{t('filters')}</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                {t('clear.all')}
              </Button>
            )}
          </div>
          <Separator className="my-2" />
          <div className="space-y-4">
            <div>
              <h5 className="mb-2 text-sm font-medium">{t('department')}</h5>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={`department-${dept}`}
                      checked={filters.departments.includes(dept)}
                      onCheckedChange={() =>
                        handleFilterChange('departments', dept)
                      }
                    />
                    <label
                      htmlFor={`department-${dept}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {dept}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium">{t('position')}</h5>
              <div className="space-y-2">
                {positions.map((position) => (
                  <div key={position} className="flex items-center space-x-2">
                    <Checkbox
                      id={`position-${position}`}
                      checked={filters.positions.includes(position)}
                      onCheckedChange={() =>
                        handleFilterChange('positions', position)
                      }
                    />
                    <label
                      htmlFor={`position-${position}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {position}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium">{t('skills')}</h5>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={filters.skills.includes(skill)}
                      onCheckedChange={() => handleFilterChange('skills', skill)}
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium">{t('location')}</h5>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={() =>
                        handleFilterChange('locations', location)
                      }
                    />
                    <label
                      htmlFor={`location-${location}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.departments.map((dept) => (
            <Badge key={`dept-${dept}`} variant="secondary" className="gap-1">
              {dept}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('departments', dept)}
              />
            </Badge>
          ))}
          {filters.positions.map((position) => (
            <Badge
              key={`position-${position}`}
              variant="secondary"
              className="gap-1"
            >
              {position}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('positions', position)}
              />
            </Badge>
          ))}
          {filters.skills.map((skill) => (
            <Badge key={`skill-${skill}`} variant="secondary" className="gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('skills', skill)}
              />
            </Badge>
          ))}
          {filters.locations.map((location) => (
            <Badge
              key={`location-${location}`}
              variant="secondary"
              className="gap-1"
            >
              {location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('locations', location)}
              />
            </Badge>
          ))}
          {activeFilterCount > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearFilters}
            >
              {t('clear.all')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmployeeFilters;
