
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Calendar, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Prescription {
  id: string;
  prescription_number: string;
  created_at: string;
  image_url: string;
  status: 'pending' | 'verified' | 'rejected';
  type: 'digital' | 'uploaded';
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const data = await apiFetch('/prescriptions');
      setPrescriptions(data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-gray-500 text-sm">Manage and track your prescription uploads</p>
        </div>
        <Link href="/dashboard/patient/prescriptions/upload">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" /> Upload New
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions yet</h3>
          <p className="text-gray-500 mb-6">Upload a prescription to order medicines easily.</p>
          <Link href="/dashboard/patient/prescriptions/upload">
            <Button>Upload Now</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gray-100 group">
                  {rx.image_url ? (
                    <img src={rx.image_url} alt="Prescription" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FileText className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <a href={rx.image_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" /> View Full
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-900 truncate" title={rx.prescription_number}>
                        {rx.prescription_number || 'Unnamed Prescription'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(rx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(rx.status)}`}>
                      {getStatusIcon(rx.status)}
                      <span className="capitalize">{rx.status}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
