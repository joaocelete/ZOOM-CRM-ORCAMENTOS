import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Clientes from "@/pages/clientes";
import Orcamentos from "@/pages/orcamentos";
import Pipeline from "@/pages/pipeline";
import Produtos from "@/pages/produtos";
import Producao from "@/pages/producao";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/orcamentos" component={Orcamentos} />
      <Route path="/pipeline" component={Pipeline} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/producao" component={Producao} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-1 flex-col">
              <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background px-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
