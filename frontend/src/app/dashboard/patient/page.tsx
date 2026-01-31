'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Package, 
  FileText, 
  IndianRupee, 
  Upload, 
  Search, 
  Stethoscope, 
  TestTube, 
  Bell, 
  ShoppingBag, 
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export default function PatientDashboard() {
  const [greeting, setGreeting] = useState('Good Morning');
  const [userName, setUserName] = useState('Patient');
  
  // Date formatting
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Dynamic greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch User Profile
    const fetchProfile = async () => {
      try {
        // Try getting user from localStorage first for instant render
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.name) setUserName(parsedUser.name);
        }

        const user = await apiFetch('/auth/profile');
        if (user && user.name) {
          setUserName(user.name);
          // Update local storage with latest data
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">Patient Portal</span>
            <span className="text-gray-300">|</span>
            <Calendar className="h-3.5 w-3.5" />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {greeting}, <span className="text-blue-600">{userName}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Account Active & Verified
            <span className="text-gray-300 mx-1">•</span>
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">Last login: Just now</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block w-72 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              type="search" 
              placeholder="Search medicines, doctors..." 
              className="pl-10 h-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all shadow-sm rounded-full group-hover:border-blue-300" 
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full relative hover:bg-blue-50 border-gray-200 h-10 w-10 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
            <span className="font-bold text-white text-sm">
              {userName === 'Patient' ? 'P' : userName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Active Orders */}
        <Link href="/dashboard/patient/orders" className="group block h-full">
          <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-white h-full ring-1 ring-black/5 group-hover:ring-blue-200">
            <div className="absolute top-0 right-0 p-4 opacity-[0.08] group-hover:opacity-15 transition-opacity">
              <Package className="h-24 w-24 text-blue-600 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                Active Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mt-2">
                <div className="text-3xl font-bold text-gray-900">0</div>
                <span className="text-xs font-medium text-gray-500 mb-1.5 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  In progress
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-50 flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">Track delivery status</span>
                <span className="text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
                  View Orders <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Prescriptions */}
        <Link href="/dashboard/patient/prescriptions" className="group block h-full">
          <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 via-white to-white h-full ring-1 ring-black/5 group-hover:ring-amber-200">
            <div className="absolute top-0 right-0 p-4 opacity-[0.08] group-hover:opacity-15 transition-opacity">
              <FileText className="h-24 w-24 text-amber-600 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-md">
                  <FileText className="h-4 w-4 text-amber-600" />
                </div>
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mt-2">
                <div className="text-3xl font-bold text-gray-900">0</div>
                <span className="text-xs font-medium text-amber-700 mb-1.5 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Action Needed
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-amber-50 flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">Pending approvals</span>
                <span className="text-amber-700 flex items-center group-hover:translate-x-1 transition-transform">
                  Review Now <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Health Savings */}
        <Link href="/dashboard/patient/profile" className="group block h-full">
          <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 via-white to-white h-full ring-1 ring-black/5 group-hover:ring-green-200">
            <div className="absolute top-0 right-0 p-4 opacity-[0.08] group-hover:opacity-15 transition-opacity">
              <IndianRupee className="h-24 w-24 text-green-600 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-md">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </div>
                Health Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mt-2">
                <div className="text-3xl font-bold text-gray-900">₹0</div>
                <span className="text-xs font-medium text-green-700 mb-1.5 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Lifetime Savings
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-green-50 flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">Available balance</span>
                <span className="text-green-700 flex items-center group-hover:translate-x-1 transition-transform">
                  View Wallet <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Quick Actions
          </h2>
          <Button variant="ghost" size="sm" className="text-sm text-blue-600 hover:bg-blue-50">
            View All Services
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Primary Action - Upload Rx */}
          <Link href="/dashboard/patient/prescriptions/upload" className="md:col-span-1 group">
            <Card className="h-full bg-blue-600 border-none shadow-md hover:shadow-xl hover:bg-blue-700 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 bg-white/10 h-32 w-32 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
              <CardContent className="flex flex-col items-start justify-center p-6 h-full text-white relative z-10">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">Upload Rx</h3>
                <p className="text-blue-100 text-sm mb-4">Quickest way to order medicines.</p>
                <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white group-hover:text-blue-700 transition-all">
                  Upload Now <ArrowRight className="h-3 w-3 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Secondary Action - Search Medicines */}
          <Link href="/dashboard/patient/medicines" className="md:col-span-1 group">
            <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer bg-white group-hover:bg-purple-50/30">
              <CardContent className="flex flex-col items-start justify-center p-6 h-full">
                <div className="p-3 bg-purple-50 rounded-xl mb-4 group-hover:bg-purple-100 transition-colors">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">Search Medicines</h3>
                <p className="text-gray-500 text-sm">Find brands & substitutes.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Secondary Action - Book Appointment */}
          <Link href="/dashboard/patient/doctors" className="md:col-span-1 group">
            <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer bg-white group-hover:bg-teal-50/30">
              <CardContent className="flex flex-col items-start justify-center p-6 h-full">
                <div className="p-3 bg-teal-50 rounded-xl mb-4 group-hover:bg-teal-100 transition-colors">
                  <Stethoscope className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">Book Appointment</h3>
                <p className="text-gray-500 text-sm">Consult top doctors online.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Secondary Action - Lab Tests */}
          <Link href="/dashboard/patient/lab-tests" className="md:col-span-1 group">
            <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer bg-white group-hover:bg-orange-50/30">
              <CardContent className="flex flex-col items-start justify-center p-6 h-full">
                <div className="p-3 bg-orange-50 rounded-xl mb-4 group-hover:bg-orange-100 transition-colors">
                  <TestTube className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">Lab Tests</h3>
                <p className="text-gray-500 text-sm">Home sample collection.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 bg-gray-50/30 py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Recent Timeline</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Your latest health activities</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs font-medium">
            View Full History
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white">
            <div className="relative mb-6 group cursor-default">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-white p-5 rounded-full shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                <Clock className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your timeline is fresh</h3>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed px-4">
              We're ready to log your health journey. Once you order medicines or consult a doctor, it will appear here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md px-4">
              <Link href="/dashboard/patient/medicines" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all h-10">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Order Medicines
                </Button>
              </Link>
              <Link href="/dashboard/patient/doctors" className="flex-1">
                <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 h-10">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Find a Doctor
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}