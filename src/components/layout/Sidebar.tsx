import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Users,
  Briefcase,
  FileUp,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/components/LanguageProvider";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
  subItems?: { label: string; path: string }[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NavItem = ({ path, icon, label, onClick }: NavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname === path;

  return (
    <Tooltip content={label}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-4 py-2 text-left text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
        onClick={() => {
          if (onClick) onClick();
          else navigate(path);
        }}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </Button>
    </Tooltip>
  );
};

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className={cn(
        "flex flex-col h-screen bg-background border-r",
        isOpen ? "w-64" : "w-16"
      )}>
        <div className="flex items-center px-4 py-2 mb-8">
          <h1 className="text-xl font-semibold text-primary">{t("app.name")}</h1>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          <NavItem
            icon={<Home size={18} />}
            label={t("dashboard")}
            path="/"
            active={location.pathname === "/"}
          />
          <NavItem
            icon={<BarChart3 size={18} />}
            label={t("analytics")}
            path="/analytics"
            active={location.pathname.startsWith("/analytics")}
            subItems={[
              { 
                label: t("occupancy.rate"), 
                path: "/analytics/occupancy"
              },
              { 
                label: t("project.distribution"), 
                path: "/analytics/projects"
              },
              { 
                label: "Analyse des ventes", 
                path: "/analytics/sales"
              },
              { 
                label: "Performance commerciale", 
                path: "/analytics/sales-performance"
              }
            ]}
            isOpen={location.pathname.startsWith("/analytics")}
            onOpenChange={() => {}}
          />
          <NavItem
            icon={<Users size={18} />}
            label={t("resources")}
            path="/employees"
            active={location.pathname === "/employees"}
          />
          <NavItem
            icon={<Briefcase size={18} />}
            label={t("projects")}
            path="/projects"
            active={location.pathname === "/projects"}
          />
          <NavItem
            icon={<CreditCard size={18} />}
            label="Avant vente"
            path="/sales"
            active={location.pathname === "/sales"}
          />

          <NavItem
            icon={<FileUp size={18} />}
            label="AI Analyze"
            path="/ai-analyze"
            active={location.pathname === "/ai-analyze"}
          />
        </nav>
        <div className="mt-auto px-2 space-y-1">
          <NavItem
            icon={<Settings size={18} />}
            label={t("settings")}
            path="/settings"
            active={location.pathname === "/settings"}
          />
          <NavItem
            icon={<LogOut size={18} />}
            label={t("logout")}
            path="/logout"
            onClick={() => console.log("Logout clicked")}
          />
        </div>
      </nav>
    </TooltipProvider>
  );
}
