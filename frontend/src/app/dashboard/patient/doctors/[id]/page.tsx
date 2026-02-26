'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Award, Star, ArrowLeft } from 'lucide-react';
import { apiFetch } from '@/lib/api';

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

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [consultationType, setConsultationType] = useState<'online' | 'offline'>('online');
  const [symptoms, setSymptoms] = useState('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
  });

  const slots = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  useEffect(() => {
    if (params.id) {
      fetchDoctor(params.id as string);
    }
  }, [params.id]);

  const fetchDoctor = async (id: string) => {
    try {
      setLoading(true);
      const data = await apiFetch(`/doctors/${id}`);
      setDoctor(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
      if (!selectedSlot || !doctor) return;

      try {
          setBookingLoading(true);
          
          const timeParts = selectedSlot.match(/(\d+):(\d+) (AM|PM)/);
          if (!timeParts) return;
          
          let hours = parseInt(timeParts[1]);
          const minutes = parseInt(timeParts[2]);
          const ampm = timeParts[3];
          
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          const slotDate = new Date(selectedDate);
          slotDate.setHours(hours, minutes, 0, 0);

          await apiFetch('/appointments', {
              method: 'POST',
              body: JSON.stringify({
                  doctor_id: doctor.id,
                  appointment_date: selectedDate.toISOString().split('T')[0],
                  time_slot: slotDate.toISOString(),
                  consultation_type: consultationType,
                  symptoms: symptoms
              })
          });

          router.push('/dashboard/patient/appointments?success=true');
      } catch (err) {
          console.error(err);
          alert('Failed to book appointment. Slot might be taken.');
      } finally {
          setBookingLoading(false);
      }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!doctor) return <div className="p-8 text-center">Doctor not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="pl-0 hover:bg-transparent hover:text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Doctors
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctor Profile */}
        <Card className="md:col-span-1 h-fit border-none shadow-md bg-gradient-to-b from-white to-blue-50">
            <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 text-blue-700 h-24 w-24 rounded-full flex items-center justify-center font-bold text-3xl mb-4">
                    {doctor.user.name.charAt(0)}
                </div>
                <CardTitle className="text-xl font-bold">{doctor.user.name}</CardTitle>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                <div className="flex items-center justify-center mt-2 text-yellow-500 text-sm font-medium">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    4.8 (120 reviews)
                </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span>{doctor.experience_years} Years Experience</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>{typeof doctor.user.address === 'string' ? doctor.user.address : 'Clinic Address'}</span>
                </div>
                <div className="pt-4 border-t border-blue-100">
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Qualifications</p>
                    <p className="font-medium">{doctor.qualifications?.degree || 'MBBS'}</p>
                    <p className="text-gray-500">{doctor.qualifications?.university}</p>
                </div>
            </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="md:col-span-2 border-gray-100 shadow-md">
            <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Consultation Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setConsultationType('online')}
                            className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                                consultationType === 'online' 
                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <span className="font-medium">Video Call</span>
                        </button>
                        <button
                            onClick={() => setConsultationType('offline')}
                            className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                                consultationType === 'offline' 
                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <span className="font-medium">In-Clinic</span>
                        </button>
                    </div>
                </div>

                {/* Date Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {dates.map((date) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const dayNum = date.getDate();
                            const month = date.toLocaleDateString('en-US', { month: 'short' });
                            
                            return (
                                <button
                                    key={date.toString()}
                                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                                    className={`min-w-[80px] p-3 rounded-lg border text-center transition-all ${
                                        isSelected 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                        : 'border-gray-200 hover:border-blue-300 bg-white'
                                    }`}
                                >
                                    <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{dayName}</div>
                                    <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{dayNum}</div>
                                    <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{month}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Slot Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-1 rounded-md text-sm font-medium transition-all ${
                                    selectedSlot === slot 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Symptoms */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (Optional)</label>
                    <textarea 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[80px]"
                        placeholder="Describe your symptoms..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </div>

                {/* Summary & Pay */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="text-lg font-bold text-gray-900">₹{Number(doctor.consultation_fee).toFixed(2)}</span>
                    </div>
                    <Button 
                        onClick={handleBook} 
                        disabled={!selectedSlot || bookingLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                    >
                        {bookingLoading ? 'Processing...' : `Confirm Booking`}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
