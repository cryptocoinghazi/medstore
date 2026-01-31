'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Smartphone, Mail, UserCheck, ShieldCheck, HeartPulse } from 'lucide-react';

import { apiFetch } from '@/lib/api';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    role: 'patient',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      alert('Registration successful! Please login.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 text-white flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100 0 L0 100 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-700 font-bold text-2xl">+</span>
            </div>
            <span className="font-bold text-3xl">MedStore</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Join Our Healthcare Network</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-md">
            Whether you are a patient, doctor, or pharmacist, MedStore connects you to the right healthcare services instantly.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <HeartPulse className="h-6 w-6 text-blue-200" />
              <span>Comprehensive Health Management</span>
            </div>
            <div className="flex items-center space-x-3">
              <UserCheck className="h-6 w-6 text-blue-200" />
              <span>Verified Professionals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to get started with MedStore.
            </p>
          </div>

          <Card className="border-0 shadow-xl ring-1 ring-gray-100">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription>Enter your details to create a new account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-700 font-medium">Mobile Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="mobile"
                      name="mobile"
                      className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700 font-medium">I am a</Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors focus:bg-white"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="pharmacy">Pharmacist</option>
                    </select>
                    {/* Custom dropdown arrow if needed, but browser default is okay for now */}
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-lg shadow-md transition-all hover:shadow-lg mt-2" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center bg-gray-50/50 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Login here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
