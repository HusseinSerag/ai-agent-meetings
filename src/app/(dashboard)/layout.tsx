import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/DashboardNavbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/DashboardSidebar";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col min-h-screen w-full bg-muted">
          <DashboardNavbar />
          {children}
        </main>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
