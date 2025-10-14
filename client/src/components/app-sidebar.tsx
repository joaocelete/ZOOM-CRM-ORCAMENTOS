import { LayoutDashboard, Users, FileText, Kanban, Package, Factory, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, testId: "nav-dashboard" },
  { title: "Clientes", url: "/clientes", icon: Users, testId: "nav-clientes" },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText, testId: "nav-orcamentos" },
  { title: "Pipeline", url: "/pipeline", icon: Kanban, testId: "nav-pipeline" },
  { title: "Produtos", url: "/produtos", icon: Package, testId: "nav-produtos" },
  { title: "Produção", url: "/producao", icon: Factory, testId: "nav-producao" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-serif text-xl font-bold text-primary-foreground">Z</span>
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">Zoom CRM</h2>
            <p className="text-xs text-muted-foreground">Comunicação Visual</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={item.testId}>
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
