import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import BottomNavigation from "@/components/bottom-navigation";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Clientes from "@/pages/clientes";
import Orcamentos from "@/pages/orcamentos";
import Pipeline from "@/pages/pipeline";
import Produtos from "@/pages/produtos";
import Producao from "@/pages/producao";
import DealWorkspace from "@/pages/deal-workspace";
import ClientTimeline from "@/pages/client-timeline";
import Settings from "@/pages/settings";
import Users from "@/pages/users";
import Login from "@/pages/login";
import { ReactNode, useEffect } from "react";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </RequireAuth>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/clientes">
        <AuthenticatedLayout>
          <Clientes />
        </AuthenticatedLayout>
      </Route>
      <Route path="/client/:id/timeline">
        {(params) => (
          <AuthenticatedLayout>
            <ClientTimeline />
          </AuthenticatedLayout>
        )}
      </Route>
      <Route path="/orcamentos">
        <AuthenticatedLayout>
          <Orcamentos />
        </AuthenticatedLayout>
      </Route>
      <Route path="/pipeline">
        <AuthenticatedLayout>
          <Pipeline />
        </AuthenticatedLayout>
      </Route>
      <Route path="/deal/:id">
        {(params) => (
          <AuthenticatedLayout>
            <DealWorkspace />
          </AuthenticatedLayout>
        )}
      </Route>
      <Route path="/produtos">
        <AuthenticatedLayout>
          <Produtos />
        </AuthenticatedLayout>
      </Route>
      <Route path="/producao">
        <AuthenticatedLayout>
          <Producao />
        </AuthenticatedLayout>
      </Route>
      <Route path="/users">
        <AuthenticatedLayout>
          <Users />
        </AuthenticatedLayout>
      </Route>
      <Route path="/settings">
        <AuthenticatedLayout>
          <Settings />
        </AuthenticatedLayout>
      </Route>
      <Route path="/">
        <AuthenticatedLayout>
          <Dashboard />
        </AuthenticatedLayout>
      </Route>
      <Route>
        <AuthenticatedLayout>
          <NotFound />
        </AuthenticatedLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
