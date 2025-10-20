import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users as UsersIcon, FileText, Kanban, Package, Factory, Settings, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, testId: "nav-dashboard", permission: "dashboard" as const },
  { title: "Clientes", url: "/clientes", icon: UsersIcon, testId: "nav-clientes", permission: "clientes" as const },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText, testId: "nav-orcamentos", permission: "orcamentos" as const },
  { title: "Pipeline", url: "/pipeline", icon: Kanban, testId: "nav-pipeline", permission: "pipeline" as const },
  { title: "Produtos", url: "/produtos", icon: Package, testId: "nav-produtos", permission: "produtos" as const },
  { title: "Produção", url: "/producao", icon: Factory, testId: "nav-producao", permission: "producao" as const },
  { title: "Configurações", url: "/settings", icon: Settings, testId: "nav-settings", permission: "settings" as const },
];

interface CompanySettings {
  companyName: string;
  logo?: string;
}

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Buscar configurações da empresa para o logo
  const { data: companySettings } = useQuery<CompanySettings>({
    queryKey: ["/api/settings"],
  });

  // Filtrar itens de navegação baseado nas permissões
  const visibleNavItems = navItems.filter((item) => hasPermission(item.permission));

  const handleLogout = async () => {
    await logout();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "salesperson":
        return "Vendedor";
      case "employee":
        return "Funcionário";
      default:
        return role;
    }
  };

  const LogoComponent = () => (
    <div className="flex items-center gap-3">
      {companySettings?.logo ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
          <img 
            src={companySettings.logo} 
            alt="Logo da empresa" 
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="font-serif text-xl font-bold text-primary-foreground">Z</span>
        </div>
      )}
      <div>
        <h2 className="font-serif text-lg font-semibold">
          {companySettings?.companyName || "Zoom CRM"}
        </h2>
        <p className="text-xs text-muted-foreground -mt-0.5">Comunicação Visual</p>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo - sempre visível */}
        <div className="flex items-center gap-3 mr-4 md:mr-8">
          <LogoComponent />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {visibleNavItems.map((item) => {
            const isActive = location === item.url;
            const Icon = item.icon;
            return (
              <Link key={item.url} href={item.url}>
                <Button
                  variant="ghost"
                  className={cn(
                    "gap-2",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                  data-testid={item.testId}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden ml-auto mr-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="mobile-menu-button">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <LogoComponent />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {visibleNavItems.map((item) => {
                  const isActive = location === item.url;
                  const Icon = item.icon;
                  return (
                    <Link key={item.url} href={item.url} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-12",
                          isActive && "bg-primary/10 text-primary font-medium"
                        )}
                        data-testid={`mobile-${item.testId}`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.title}
                      </Button>
                    </Link>
                  );
                })}
              </div>
              
              {/* User info no mobile */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user && getRoleBadge(user.role)}
                    </p>
                  </div>
                </div>
                
                {hasPermission("users") && (
                  <Link href="/users" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 mb-2">
                      <UsersIcon className="h-4 w-4" />
                      Gerenciar Usuários
                    </Button>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                  data-testid="mobile-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop User Menu */}
        <div className="hidden lg:flex ml-auto items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2" data-testid="button-user-menu">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  <span className="text-xs font-normal text-muted-foreground mt-1">
                    {user && getRoleBadge(user.role)}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hasPermission("users") && (
                <DropdownMenuItem asChild>
                  <Link href="/users">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Gerenciar Usuários
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Theme Toggle */}
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
