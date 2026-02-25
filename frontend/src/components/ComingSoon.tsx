
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComingSoonPage({ title, description }: { title: string, description: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
        <Construction className="h-16 w-16 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500 max-w-md mb-8 text-lg">{description}</p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Link href="/dashboard/patient">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
