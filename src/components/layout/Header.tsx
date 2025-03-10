
import { Bell, Search, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const getPageTitle = useCallback((path: string) => {
    switch (true) {
      case path === '/': return t('dashboard');
      case path === '/employees': return t('employees');
      case path === '/projects': return t('projects');
      case path === '/analytics': return t('analytics');
      case path === '/analytics/occupancy': return t('occupancy.rate');
      case path === '/analytics/projects': return t('project.distribution');
      case path === '/import': return t('import');
      case path === '/settings': return t('settings');
      default: return t('dashboard');
    }
  }, [t]);

  useEffect(() => {
    setPageTitle(getPageTitle(location.pathname));
  }, [location.pathname, getPageTitle]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 backdrop-blur-sm transition-all animate-fade-in">
      <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-64 rounded-full bg-background pl-8 md:w-80 lg:w-96"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-5 w-5" />
              <span className="sr-only">{t('language')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              <span className={language === 'en' ? 'font-bold' : ''}>{t('english')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('fr')}>
              <span className={language === 'fr' ? 'font-bold' : ''}>{t('french')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className={cn("h-5 w-5 transition-all hover:text-amber-500")} />
          ) : (
            <Moon className={cn("h-5 w-5 transition-all hover:text-indigo-500")} />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            3
          </span>
          <span className="sr-only">{t('notifications')}</span>
        </Button>
        
        <Avatar className="h-9 w-9 transition-transform hover:scale-110">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
