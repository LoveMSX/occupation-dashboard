
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
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/components/LanguageProvider";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
  subItems?: { label: string; path: string }[];
}

const NavItem = ({ icon, label, path, active, onClick, subItems }: NavItemProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Open the collapsible if current path is in subItems
    if (subItems?.some(item => location.pathname === item.path)) {
      setIsOpen(true);
    }
  }, [location.pathname, subItems]);

  if (subItems) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between px-4 py-2 text-left text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              (active || subItems.some(item => location.pathname === item.path)) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <div className="flex items-center">
              <span className="mr-3">{icon}</span>
              <span>{label}</span>
            </div>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-10">
          {subItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "w-full justify-start px-4 py-2 text-left text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.path ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
};

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  
  return (
    <div className="flex h-screen flex-col border-r bg-card px-2 py-4 shadow-sm animate-fade-in">
      <div className="flex items-center px-4 py-2 mb-8">
        <h1 className="text-xl font-semibold text-primary">{t('app.name')}</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        <NavItem
          icon={<Home size={18} />}
          label={t('dashboard')}
          path="/"
          active={location.pathname === "/"}
        />
        <NavItem
          icon={<BarChart3 size={18} />}
          label={t('analytics')}
          path="/analytics"
          active={location.pathname === "/analytics"}
          subItems={[
            { label: t('occupancy.rate'), path: "/analytics/occupancy" },
            { label: t('project.distribution'), path: "/analytics/projects" },
          ]}
        />
        <NavItem
          icon={<Users size={18} />}
          label={t('resources')}
          path="/employees"
          active={location.pathname === "/employees"}
        />
        <NavItem
          icon={<Briefcase size={18} />}
          label={t('projects')}
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
          icon={<Search size={18} />}
          label="AI Analyze"
          path="/ai-analyze"
          active={location.pathname === "/ai-analyze"}
        />
        <NavItem
          icon={<FileUp size={18} />}
          label={t('import')}
          path="/import"
          active={location.pathname === "/import"}
        />
      </nav>
      <div className="mt-auto px-2 space-y-1">
        <NavItem
          icon={<Settings size={18} />}
          label={t('settings')}
          path="/settings"
          active={location.pathname === "/settings"}
        />
        <NavItem
          icon={<LogOut size={18} />}
          label={t('logout')}
          path="/logout"
          onClick={() => console.log("Logout clicked")}
        />
      </div>
    </div>
  );
}
