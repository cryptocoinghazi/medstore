'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  User, 
  Settings 
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await apiFetch('/auth/profile');
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user profile in sidebar', error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const navGroups = [
    {
      title: "Health & Care",
      items: [
        { href: '/dashboard/patient', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/patient/medicines', label: 'Medicines', icon: Pill },
        { href: '/dashboard/patient/orders', label: 'My Orders', icon: ShoppingBag },
        { href: '/dashboard/patient/prescriptions', label: 'Prescriptions', icon: FileText },
      ]
    },
    {
      title: "Account",
      items: [
        { href: '/dashboard/patient/profile', label: 'Profile', icon: User },
        { href: '/dashboard/patient/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <span className="font-bold text-xl text-blue-900 tracking-tight">MedStore</span>
          </Link>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className="block group/item">
                      <div 
                        className={`
                          relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-blue-600 rounded-r-full" />
                        )}
                        <item.icon 
                          className={`
                            mr-3 h-4 w-4 transition-colors
                            ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover/item:text-gray-600'}
                          `} 
                        />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Patient'}</p>
              <p className="text-xs text-gray-500 truncate">ID: {user?.id ? `#${user.id.substring(0, 6)}` : '...'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white">
          <button onClick={toggleSidebar} className="text-gray-500">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-gray-900">Dashboard</span>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
