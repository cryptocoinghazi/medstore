'use client';

import React from 'react';
import Link from 'next/link';
import { Search, User, Menu, ShoppingCart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-4 flex md:mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <span className="hidden font-bold text-xl text-blue-900 sm:inline-block">
              MedStore
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-x-6 text-sm font-medium text-gray-700">
          <Link href="/medicines" className="hover:text-blue-600 transition-colors">Medicines</Link>
          <Link href="/lab-tests" className="hover:text-blue-600 transition-colors">Lab Tests</Link>
          <Link href="/consult-doctor" className="hover:text-blue-600 transition-colors">Consult Doctors</Link>
          <Link href="/cancer-care" className="hover:text-blue-600 transition-colors">Cancer Care</Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center justify-center px-4 md:px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search for medicines, doctors, lab tests..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-9 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
             <Phone className="h-5 w-5 text-gray-600" />
             <span className="sr-only">Contact</span>
          </Button>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <div className="hidden md:flex gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle - Placeholder functionality */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
