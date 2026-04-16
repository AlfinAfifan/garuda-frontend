'use client';
import { Navbar } from '@/components/main/components/Navbar';
import { Sidebar } from '@/components/main/components/Sidebar';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-primary-50">
      {/* Fixed Navbar */}
      <Navbar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />

      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Sidebar - Mobile */}
      <Sidebar isCollapsed={false} isMobile={true} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'} ml-0 overflow-x-hidden pt-16`}>
        <div className="h-full overflow-auto">
          <div className="max-w-10xl mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {/* {isMobileSidebarOpen && <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />} */}
    </div>
  );
}
