import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, Kanban, Package, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, testId: "nav-dashboard" },
  { title: "Clientes", url: "/clientes", icon: Users, testId: "nav-clientes" },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText, testId: "nav-orcamentos" },
  { title: "Pipeline", url: "/pipeline", icon: Kanban, testId: "nav-pipeline" },
  { title: "Produtos", url: "/produtos", icon: Package, testId: "nav-produtos" },
  { title: "Produção", url: "/producao", icon: Factory, testId: "nav-producao" },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3 mr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-serif text-xl font-bold text-primary-foreground">Z</span>
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold">Zoom CRM</h2>
            <p className="text-xs text-muted-foreground -mt-0.5">Comunicação Visual</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
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

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
