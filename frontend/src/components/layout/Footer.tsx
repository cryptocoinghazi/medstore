import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <span className="font-bold text-xl text-blue-900">MedStore</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Your trusted partner for genuine medicines, doctor consultations, and diagnostic tests. Delivering health to your doorstep across India.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-800">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Featured Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/medicines" className="hover:text-blue-600">Buy Medicines</Link></li>
              <li><Link href="/consult-doctor" className="hover:text-blue-600">Consult a Doctor</Link></li>
              <li><Link href="/lab-tests" className="hover:text-blue-600">Lab Tests</Link></li>
              <li><Link href="/health-plans" className="hover:text-blue-600">Health Plans</Link></li>
              <li><Link href="/ayurveda" className="hover:text-blue-600">Ayurveda</Link></li>
            </ul>
          </div>

          {/* For Stakeholders */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">For Partners</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/auth/register?role=doctor" className="hover:text-blue-600">Register as Doctor</Link></li>
              <li><Link href="/auth/register?role=pharmacy" className="hover:text-blue-600">Register Pharmacy</Link></li>
              <li><Link href="/auth/register?role=diagnostic" className="hover:text-blue-600">Register Lab</Link></li>
              <li><Link href="/corporate" className="hover:text-blue-600">Corporate Wellness</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                <span>123 Health Avenue, Tech City,<br />Hyderabad, Telangana 500081</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                <span>support@medstore.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MedStore Healthcare Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
