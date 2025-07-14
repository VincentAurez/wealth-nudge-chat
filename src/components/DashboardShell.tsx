import { ReactNode } from "react";
import { DashboardNav } from "./sidebar/DashboardNav";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <DashboardNav />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {children}
      </div>
    </div>
  );
}