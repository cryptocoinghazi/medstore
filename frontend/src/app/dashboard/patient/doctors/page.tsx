'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, Calendar } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: string;
  specialty: string;
  consultation_fee: string;
  experience_years: number;
  qualifications: any;
  user: {
    name: string;
    email: string;
    mobile: string;
    address: any;
  };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchDoctors();
  }, [search, specialty]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (specialty && specialty !== 'all') query.append('specialty', specialty);

      const data = await apiFetch(`/doctors?${query.toString()}`);
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
      "Cardiologist", "Dermatologist", "Pediatrician", "Neurologist", "General Physician"
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
          <p className="text-gray-500">Book appointments with top specialists.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by doctor name..." 
            className="pl-9 border-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={specialty} 
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="all">All Specialties</option>
            {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
                 <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
             ))}
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Card 
                key={doc.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200 flex flex-col h-full" 
                onClick={() => router.push(`/dashboard/patient/doctors/${doc.id}`)}
            >
              <CardHeader className="pb-2 flex-grow-0">
                <div className="flex justify-between items-start mb-2">
                    <div className="bg-blue-100 text-blue-700 h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                        {doc.user.name.charAt(0)}
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        4.8
                    </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">{doc.user.name}</CardTitle>
                <p className="text-sm text-blue-600 font-medium">{doc.specialty}</p>
              </CardHeader>
              
              <CardContent className="space-y-3 text-sm text-gray-600 flex-grow">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Experience</span>
                    <span className="font-medium text-gray-900">{doc.experience_years} years</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-medium text-green-600">₹{Number(doc.consultation_fee).toFixed(0)}</span>
                </div>
                <div className="flex items-start pt-1">
                     <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                     <span className="text-gray-500 text-xs line-clamp-2">Available Online & In-Clinic</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 mt-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                      <Calendar className="mr-2 h-4 w-4" /> Book Now
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
          <Button 
            variant="link" 
            onClick={() => {setSearch(''); setSpecialty('all');}}
            className="mt-2 text-blue-600"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
