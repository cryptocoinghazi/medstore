import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Pill, Stethoscope, TestTube, ShieldCheck, Clock, Truck, Smartphone, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Your Health, <br/>Our Responsibility
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl mx-auto">
              India's most trusted healthcare platform. Order medicines, book doctors, and get lab tests at home.
            </p>
            
            {/* Search Box */}
            <div className="mt-10 p-2 bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto">
              <div className="flex items-center px-4 py-2 w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-100">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <select className="bg-transparent outline-none text-gray-700 font-medium w-full md:w-32">
                  <option>Hyderabad</option>
                  <option>Bangalore</option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                </select>
              </div>
              <div className="flex-1 flex items-center px-4 py-2 w-full">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search medicines, doctors, labs..." 
                  className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <Button className="w-full md:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Search
              </Button>
            </div>
            
            <div className="pt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-blue-100">
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">Popular: Paracetamol</span>
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">Diabetes Care</span>
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">Vitamin D</span>
            </div>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-slate-50 rounded-t-[50%] scale-x-150"></div>
      </section>

      {/* Services Grid */}
      <section className="py-20 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pharmacy */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 hover:-translate-y-1 transition-transform duration-300 border border-gray-100 group cursor-pointer">
              <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <Pill className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Medicines</h3>
              <p className="text-gray-500 mb-4">Genuine medicines delivered to your doorstep within 2 hours.</p>
              <span className="text-blue-600 font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                Order Now <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </div>

            {/* Doctor Consultation */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 hover:-translate-y-1 transition-transform duration-300 border border-gray-100 group cursor-pointer">
              <div className="h-14 w-14 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                <Stethoscope className="h-7 w-7 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Consult Doctors</h3>
              <p className="text-gray-500 mb-4">Connect with top specialists online or book clinic visits.</p>
              <span className="text-teal-600 font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                Book Appointment <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </div>

            {/* Lab Tests */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 hover:-translate-y-1 transition-transform duration-300 border border-gray-100 group cursor-pointer">
              <div className="h-14 w-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <TestTube className="h-7 w-7 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Tests</h3>
              <p className="text-gray-500 mb-4">Safe home sample collection and accurate digital reports.</p>
              <span className="text-purple-600 font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                Schedule Test <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </div>

            {/* Health Plans */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 hover:-translate-y-1 transition-transform duration-300 border border-gray-100 group cursor-pointer">
              <div className="h-14 w-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                <ShieldCheck className="h-7 w-7 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Health Plans</h3>
              <p className="text-gray-500 mb-4">Comprehensive health membership for your entire family.</p>
              <span className="text-orange-600 font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                Explore Plans <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MedStore?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We are committed to providing the best healthcare experience with safety, quality, and convenience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Genuine Medicines</h3>
              <p className="text-gray-500">We source directly from manufacturers and authorized distributors to ensure authenticity.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Superfast Delivery</h3>
              <p className="text-gray-500">Get your medicines delivered within 2 hours in select cities and 24 hours pan-India.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted by Millions</h3>
              <p className="text-gray-500">Rated 4.8/5 by over 1 million happy customers for our reliable service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">Healthcare in your pocket. <br/>Download the App.</h2>
              <p className="text-gray-300 text-lg">Book appointments, order medicines, and view reports on the go. Get exclusive app-only discounts.</p>
              <div className="flex gap-4">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 h-14 px-8 rounded-xl text-lg font-semibold flex items-center gap-3">
                  <Smartphone className="h-6 w-6" /> App Store
                </Button>
                <Button className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 h-14 px-8 rounded-xl text-lg font-semibold flex items-center gap-3">
                  <Smartphone className="h-6 w-6" /> Play Store
                </Button>
              </div>
            </div>
            {/* Phone Mockup Placeholder */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-[500px] bg-gray-800 rounded-[3rem] border-8 border-gray-700 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-700 rounded-b-xl z-20"></div>
                <div className="h-full w-full bg-blue-600 flex items-center justify-center text-center p-6">
                   <div className="text-white">
                      <div className="h-16 w-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold">+</span>
                      </div>
                      <h3 className="font-bold text-xl">MedStore App</h3>
                      <p className="text-sm opacity-80 mt-2">Coming Soon</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
