
import { Bell, Search, Sun, Moon, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Clear previous highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        // Normalize to merge adjacent text nodes
        parent.normalize();
      }
    });
    
    // Function to highlight text in a text node
    const highlightTextInNode = (textNode: Text, term: string): boolean => {
      const text = textNode.textContent || '';
      const lowerText = text.toLowerCase();
      const termLower = term.toLowerCase();
      
      if (!lowerText.includes(termLower)) return false;
      
      const index = lowerText.indexOf(termLower);
      const before = text.substring(0, index);
      const match = text.substring(index, index + term.length);
      const after = text.substring(index + term.length);
      
      const fragment = document.createDocumentFragment();
      
      if (before) fragment.appendChild(document.createTextNode(before));
      
      const mark = document.createElement('mark');
      mark.className = 'search-highlight';
      mark.appendChild(document.createTextNode(match));
      fragment.appendChild(mark);
      
      if (after) fragment.appendChild(document.createTextNode(after));
      
      textNode.parentNode?.replaceChild(fragment, textNode);
      return true;
    };
    
    // Function to search through all text nodes
    const searchTextNodes = (element: Node): boolean => {
      let found = false;
      
      if (element.nodeType === Node.TEXT_NODE && element.textContent?.trim()) {
        found = highlightTextInNode(element as Text, searchTerm) || found;
      } else {
        const childNodes = Array.from(element.childNodes);
        for (const child of childNodes) {
          found = searchTextNodes(child) || found;
        }
      }
      
      return found;
    };
    
    // Start search from body
    const matchFound = searchTextNodes(document.body);
    
    // Scroll to first match
    const firstMatch = document.querySelector('.search-highlight');
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    if (!matchFound) {
      alert(t('search.no.results'));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-accent rounded-md"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search')}
                className="w-64 rounded-full bg-background pl-8 md:w-80 lg:w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
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
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
            <span className="sr-only">{t('notifications')}</span>
          </Button>
          
          <Avatar className="h-9 w-9 transition-transform hover:scale-110">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>
              {/* Prendre les 2 premières lettres */}
              {"User".slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
