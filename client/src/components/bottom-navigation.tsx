import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, KanbanSquare, Package, ClipboardList } from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/clientes", icon: Users, label: "Clientes" },
  { path: "/orcamentos", icon: FileText, label: "Orçamentos" },
  { path: "/pipeline", icon: KanbanSquare, label: "Pipeline" },
  { path: "/produtos", icon: Package, label: "Produtos" },
  { path: "/producao", icon: ClipboardList, label: "Produção" },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-pb"
      data-testid="bottom-navigation"
    >
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`bottom-nav-${item.label.toLowerCase()}`}
            >
              <div 
                className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover-elevate active-elevate-2"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
