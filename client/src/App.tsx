import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Clientes from "@/pages/clientes";
import Orcamentos from "@/pages/orcamentos";
import Pipeline from "@/pages/pipeline";
import Produtos from "@/pages/produtos";
import Producao from "@/pages/producao";
import DealWorkspace from "@/pages/deal-workspace";
import ClientTimeline from "@/pages/client-timeline";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/client/:id/timeline" component={ClientTimeline} />
      <Route path="/orcamentos" component={Orcamentos} />
      <Route path="/pipeline" component={Pipeline} />
      <Route path="/deal/:id" component={DealWorkspace} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/producao" component={Producao} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
