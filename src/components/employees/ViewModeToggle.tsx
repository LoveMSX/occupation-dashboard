
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex rounded-md border">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="icon"
        onClick={() => setViewMode("grid")}
        className="rounded-r-none"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => setViewMode("list")}
        className="rounded-l-none"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
