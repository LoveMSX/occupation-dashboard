
import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface LayoutProps {
  children: React.ReactNode;
  contentClassName?: string;
}

export function Layout({ children, contentClassName }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-y-auto p-4 ${contentClassName}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
