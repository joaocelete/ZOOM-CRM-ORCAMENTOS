import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, KanbanSquare, Package, ClipboardList } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", permission: "dashboard" as const },
  { path: "/clientes", icon: Users, label: "Clientes", permission: "clientes" as const },
  { path: "/orcamentos", icon: FileText, label: "Orçamentos", permission: "orcamentos" as const },
  { path: "/pipeline", icon: KanbanSquare, label: "Pipeline", permission: "pipeline" as const },
  { path: "/produtos", icon: Package, label: "Produtos", permission: "produtos" as const },
  { path: "/producao", icon: ClipboardList, label: "Produção", permission: "producao" as const },
];

export default function BottomNavigation() {
  const [location] = useLocation();
  const { hasPermission } = usePermissions();

  // Filtrar itens de navegação baseado nas permissões
  const visibleNavItems = navItems.filter((item) => hasPermission(item.permission));

  // Se não há itens visíveis, não mostra a navegação
  if (visibleNavItems.length === 0) {
    return null;
  }

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-pb"
      data-testid="bottom-navigation"
    >
      <div className="flex h-16"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))` }}
      >
        {visibleNavItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          const testId = item.path === "/" ? "dashboard" : item.path.slice(1);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`bottom-nav-${testId}`}
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
