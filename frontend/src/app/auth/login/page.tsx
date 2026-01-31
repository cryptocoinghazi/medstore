'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Smartphone, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const router = useRouter();
  
  // Supabase client removed for now as we are using custom backend auth
  // const supabase = createBrowserClient(...) 

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate OTP sent
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp, role: 'patient' }),
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard/patient');
      } else {
        alert('Login failed: No token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Hero/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 L0 100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl">+</span>
            </div>
            <span className="font-bold text-3xl">MedStore</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Your Health, Simplified.</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-md">
            Access your prescriptions, book appointments, and manage your health records securely in one place.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-blue-200" />
              <span>Secure & Private Health Data</span>
            </div>
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-blue-200" />
              <span>Easy Mobile Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          <Card className="border-0 shadow-xl ring-1 ring-gray-100">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl">
                {step === 'mobile' ? 'Mobile Login' : 'Verify OTP'}
              </CardTitle>
              <CardDescription>
                {step === 'mobile' 
                  ? 'We will send you a One Time Password to your mobile number.' 
                  : `Enter the OTP sent to +91 ${mobile}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'mobile' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-gray-700 font-medium">Mobile Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="mobile"
                        className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        pattern="[0-9]{10}"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-lg shadow-md transition-all hover:shadow-lg" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                      <>
                        Get OTP <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-gray-700 font-medium">One Time Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="otp"
                        className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white letter-spacing-2"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        pattern="[0-9]{6}"
                        maxLength={6}
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-lg shadow-md transition-all hover:shadow-lg" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify & Login'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-700"
                    onClick={() => setStep('mobile')}
                    type="button"
                  >
                    Change Mobile Number
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center bg-gray-50/50 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                New to MedStore?{' '}
                <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
function createClientComponentClient() {
  throw new Error('Function not implemented.');
}

