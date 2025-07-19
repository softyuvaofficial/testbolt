'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderTree, 
  Tags, 
  BookOpen, 
  Database, 
  PlusCircle, 
  Calendar, 
  Image, 
  Users, 
  CreditCard, 
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderTree
  },
  {
    title: 'Test Tabs',
    href: '/admin/tabs',
    icon: Tags
  },
  {
    title: 'Test Series',
    href: '/admin/test-series',
    icon: BookOpen
  },
  {
    title: 'Questions Bank',
    href: '/admin/questions-bank',
    icon: Database
  },
  {
    title: 'Create Test',
    href: '/admin/create-test',
    icon: PlusCircle
  },
  {
    title: 'Live Test Scheduler',
    href: '/admin/live-test-scheduler',
    icon: Calendar
  },
  {
    title: 'Banners & Slider',
    href: '/admin/banners-slider',
    icon: Image
  },
  {
    title: 'Users Management',
    href: '/admin/users-management',
    icon: Users
  },
  {
    title: 'Transactions',
    href: '/admin/transactions',
    icon: CreditCard
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell
  }
];

export default function AdminSidebar({ onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">TestYukti Admin</h1>
            <p className="text-sm text-slate-400">Management Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content spacer for desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}